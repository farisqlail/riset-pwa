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
              width="200"
              height="200"
              crop="fill"
              loading="lazy"
              img-top
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

      <b-modal-cart
        :show-cart-modal="showCartModal"
        :cart="cart"
        :format-price="formatPrice"
        :get-optimized-image="getOptimizedImage"
        @decrease-quantity="decreaseQuantity"
        @increase-quantity="increaseQuantity"
        @remove-from-cart="removeFromCart"
        @open-checkout="openCheckout"
      ></b-modal-cart>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import CartModal from "~/components/CartModal.vue";

export default {
  components: {
    BModalCart: CartModal,
  },
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
    optimizedImagePath() {
      return this.browserSupportsWebP()
        ? `${this.imagePath}?format=webp`
        : this.imagePath;
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
        // Check if guides are already in localStorage
        const localGuides = localStorage.getItem("guides");
        if (localGuides) {
          this.guides = JSON.parse(localGuides);
          return this.guides;
        }

        // Fetch data from the API
        if (process.client) {
          const apiUrl =
            "https://cloud.interactive.co.id/myprofit/api/get_product?salt=m4riyAdiH43hhaEh&appid=MP01M51463F20230206169&loc_id=51203";

          const response = await axios.get(apiUrl);

          // Use the response directly
          this.guides = response.data.data;

          // Cache the guides in localStorage
          localStorage.setItem("guides", JSON.stringify(this.guides));

          return this.guides;
        } else {
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

      // if (process.client) {
      //   localStorage.setItem("cart", JSON.stringify(this.cart));
      // }

      this.calculateTotalPrice();
      this.showToast = true;
    },

    openCheckout() {
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
      this.showToast = false;
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
          }, 0);
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
      const supportsWebP = this.browserSupportsWebP();
      let optimizedPath = imagePath;

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