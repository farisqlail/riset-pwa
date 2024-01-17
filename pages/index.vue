<template>
  <div>
    <main>
      <div class="text-center mt-3">
        <b-button @click="openCartModal" variant="primary"
          >Lihat Keranjang</b-button
        >
        <b-button @click="refresh" variant="warning"
          >Refresh Pembaruan</b-button
        >
      </div>

      <div class="row mt-3 mb-5">
        <div
          class="col-md-4"
          v-for="(product, index) in paginatedGuides"
          :key="index"
        >
          <b-card img-top tag="article" style="max-width: 20rem" class="mb-2">
            <nuxt-img
              :src="getOptimizedImage(product.product_images)"
              :alt="product.product_name"
              width="200"
              height="200"
              loading="lazy"
            />

            <h5>{{ product.product_name }}</h5>
            <span>
              {{ formatPrice(product.product_pricenow) }}
            </span>

            <b-button
              href="#"
              variant="success"
              class="float-right"
              @click="addToCart(product)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h1.929l.743-2h-4.195z"
                />
              </svg>
            </b-button>
          </b-card>
        </div>
      </div>

      <div class="pagination d-flex justify-content-center mb-5">
        <b-button class="mr-3" :disabled="currentPage === 1" @click="prevPage"
          >Previous</b-button
        >
        <!-- <span>{{ currentPage }}</span> -->
        <b-button
          variant="success"
          :disabled="endIndex >= guides.length"
          @click="nextPage"
          >Next</b-button
        >
      </div>

      <b-toast
        v-model="showToast"
        auto-hide-delay="2000"
        variant="success"
        @hidden="onToastHidden"
      >
        Item berhasil ditambahkan ke keranjang!
      </b-toast>

      <b-modal v-model="showCartModal" size="lg" title="Shopping Cart">
        <b-list-group flush>
          <b-list-group-item
            v-for="(item, index) in cart"
            :key="index"
            class="d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <nuxt-img
                :src="getOptimizedImage(item.image)"
                :alt="item.name"
                width="50"
                height="50"
                class="mr-2"
                loading="lazy"
              />
              <span
                >{{ item.name }} - {{ formatPrice(item.price) }} ({{
                  item.quantity
                }}
                pcs)</span
              >
            </div>
            <div>
              <b-button
                @click="decreaseQuantity(index)"
                variant="info"
                class="mr-2"
                >Kurangi</b-button
              >
              <b-button
                @click="increaseQuantity(index)"
                variant="success"
                class="mr-2"
                >Tambah</b-button
              >
              <b-button @click="removeFromCart(index)" variant="danger"
                >Hapus</b-button
              >
            </div>
          </b-list-group-item>
        </b-list-group>

        <template #modal-footer>
          <b-button @click="openCheckout" variant="primary">Checkout</b-button>
        </template>
      </b-modal>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cart: [],
      guides: [],
      showToast: false,
      showCartModal: false,
      totalPrice: 0,
      currentPage: 1,
      perPage: 6,
    };
  },

  head() {
    return {
      title: "Riset PWA",
    };
  },
  computed: {
    startIndex() {
      return (this.currentPage - 1) * this.perPage;
    },
    endIndex() {
      return this.currentPage * this.perPage;
    },
    paginatedGuides() {
      return this.guides.slice(this.startIndex, this.endIndex);
    },
  },
  mounted() {
    this.asyncData();
    this.getData();
    this.calculateTotalPrice();
  },
  methods: {
    refresh() {
      location.reload();
    },

    getOptimizedImage(imageUrl) {
      const supportsWebP = this.browserSupportsWebP();
      let optimizedPath = imageUrl;

      if (supportsWebP) {
        optimizedPath += "?format=webp";
      }

      return optimizedPath;
    },

    browserSupportsWebP() {
      const elem = document.createElement("canvas");

      if (!!(elem.getContext && elem.getContext("2d"))) {
        return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      }

      // WebGL is not supported
      return false;
    },

    async asyncData() {
      try {
        await this.$store.dispatch("fetchCartData");

        // Check if running on the client side
        const cartData = process.client
          ? JSON.parse(localStorage.getItem("cart") || "[]")
          : [];

        return { cart: cartData };
      } catch (error) {
        console.error("Error in asyncData:", error);
        return { cart: [] };
      }
    },

    async getData() {
      try {
        if (localStorage.getItem("guides")) {
          this.guides = JSON.parse(localStorage.getItem("guides") || "[]");
          this.$store.commit("setGuides", this.guides);

          return this.guides;
        }

        // Fetch data from the API
        if (process.client) {
          const response = await axios.get(
            "https://cloud.interactive.co.id/myprofit/api/get_product?salt=m4riyAdiH43hhaEh&appid=MP01M51463F20230206169&loc_id=51203"
          );

          this.guides = response.data.data;
          localStorage.setItem("guides", JSON.stringify(this.guides));
          this.$store.commit("setGuides", this.guides);

          return this.guides;
        } else {
          console.error("Error fetching guides: Client not available");

          return [];
        }
      } catch (error) {
        console.error("Error fetching guides:", error);

        return [];
      }
    },

    async updateCartData(newCartData) {
      this.$store.dispatch("setDataCart", newCartData);
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.endIndex < this.guides.length) {
        this.currentPage++;
      }
    },

    addToCart(product) {
      const existingItem = this.cart.find(
        (item) => item.name === product.product_name
      );
      this.$store.commit("addToCart", product);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({
          name: product.product_name,
          price: product.product_pricenow,
          image: product.product_images,
          quantity: 1,
        });
      }

      // Save directly to localStorage after modifying the cart
      if (process.client) {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
      this.calculateTotalPrice();
      this.showToast = true;
    },

    openCheckout() {
      console.log("Data sent to checkout:", {
        customerName: this.customerName,
        cart: this.cart,
        totalPrice: this.totalPrice,
      });
      this.$router.push("/checkout");
    },

    openCartModal() {
      this.showCartModal = true;
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    onToastHidden() {
      this.showToast = false; // Menyembunyikan toast setelah ditutup
    },

    calculateTotalPrice() {
      return new Promise((resolve) => {
        // Simulate an asynchronous operation (e.g., fetching data)
        if (process.client) {
          setTimeout(() => {
            this.totalPrice = this.cart.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            resolve();
          }, 0); // Adjust the timeout as needed
        }
      });
    },

    formatPrice(value) {
      const price = parseInt(value);
      return price.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },

    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.calculateTotalPrice();

        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    },

    increaseQuantity(index) {
      this.cart[index].quantity++;
      this.calculateTotalPrice();

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    getOptimizedImage(imagePath) {
      // Check if the browser supports WebP format
      const supportsWebP = this.browserSupportsWebP();

      // Modify the imagePath to include the desired optimizations
      // For example, you can append query parameters for resizing or format
      let optimizedPath = imagePath;

      // Append query parameters for WebP format if supported
      if (supportsWebP) {
        optimizedPath += "?format=webp";
      }

      return optimizedPath;
    },

    browserSupportsWebP() {
      // Check if the browser supports WebP format
      const elem = document.createElement("canvas");

      if (!!(elem.getContext && elem.getContext("2d"))) {
        // Was able or not to get WebP representation
        return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      }

      // WebGL is not supported
      return false;
    },
  },
};
</script>

<style scoped>
.cart-item-image {
  width: 50px; /* Sesuaikan dengan ukuran yang diinginkan */
  height: auto;
  margin-right: 10px;
}

.row-item {
  display: flex;
  flex-direction: column;
}

.row-item .item-cart {
  display: flex;
  justify-content: space-between;
}
</style>