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
          <b-card tag="article" style="max-width: 20rem" class="mb-2">
            <nuxt-img
              :src="getOptimizedImage(product.product_images)"
              width="200"
              height="200"
              crop="fill"
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

      <toast-component
        :show-toast="showToast"
        :variant="toastVariant"
        :message="toastMessage"
        @toast-hidden="onToastHidden"
      />

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
              <b-button @click="openModalAlertDelete(index)" variant="danger"
                >Hapus</b-button
              >
            </div>
          </b-list-group-item>
        </b-list-group>

        <template #modal-footer>
          <div v-if="cart.length == 0">
            <b-button
              to="/checkout"
              class="btn btn-success"
              variant="primary"
              disabled
              >Checkout</b-button
            >
          </div>
          <div v-else>
            <nuxt-link to="/checkout" class="btn btn-success" variant="primary"
              >Checkout</nuxt-link
            >
          </div>
        </template>
      </b-modal>

      <!-- delete item -->
      <b-modal
        v-model="alertDeleteModal"
        id="alertDeleteModal"
        title="Hapus item"
      >
        <p>Apakah anda yakin untuk menghapus item ini dalam cart ?</p>
        <template #modal-footer>
          <b-button variant="dark" @click="alertDeleteModal = false"
            >Batal</b-button
          >
          <b-button @click="removeFromCart(indexItem)" variant="danger"
            >Hapus</b-button
          >
        </template>
      </b-modal>
      <!-- end delete item -->
    </main>
  </div>
</template>

<script>
import axios from "axios";
import CartModal from "~/components/CartModal.vue";
import ToastComponent from '~/components/Toast.vue';

export default {
  components: {
    BModalCart: CartModal,
    'toast-component': ToastComponent,
  },

  data() {
    return {
      cart: [],
      guides: [],
      showToast: false,
      showCartModal: false,
      alertDeleteModal: false,
      totalPrice: 0,
      currentPage: 1,
      perPage: 6,
      indexItem: 0,
      showToast: false,
      toastVariant: "success",
      toastMessage: "Item berhasil ditambahkan ke keranjang!",
    };
  },

  head() {
    return {
      title: "Riset PWA",
    };
  },

  async created() {
    // Fetch cart data asynchronously when the component is created
    await this.fetchCartData();
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
    this.getData();
    this.calculateTotalPrice();
  },
  methods: {
    refresh() {
      this.$store.commit("resetGuides");
      location.reload();
    },

    showToastMessage(variant, message) {
      this.toastVariant = variant;
      this.toastMessage = message;
      this.showToast = true;
    },

    async fetchCartData() {
      await this.$store.dispatch("fetchCartData");
      const cartItems = this.$store.state.cart;

      const mergedCart = cartItems.reduce((result, item) => {
        const existingItem = result.find(
          (mergedItem) => mergedItem.name === item.name
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          result.push({ ...item });
        }
        return result;
      }, []);

      this.cart = mergedCart;
      this.calculateTotalPrice();
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
          this.guides = response.data.data;

          localStorage.setItem("guides", JSON.stringify(this.guides));

          return this.guides;
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
      this.showToastMessage('success', 'Item berhasil ditambahkan ke keranjang!');
    },

    openCartModal() {
      this.showCartModal = true;
    },

    openModalAlertDelete(index) {
      this.showCartModal = false;
      this.alertDeleteModal = true;
      this.indexItem = index;
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(this.cart));

      this.alertDeleteModal = false;
      this.showToastMessage('success', 'Item berhasil dihapus dari keranjang!');
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
      } else if (this.cart[index].quantity == 1) {
        this.openModalAlertDelete(index);
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

    nextPage() {
      if (this.endIndex < this.guides.length) {
        this.showCartModal = false; // Menutup modal sebelum pindah ke halaman berikutnya
        this.currentPage++;
      }
    },
  },
};
</script>