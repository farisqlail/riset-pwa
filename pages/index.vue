<template>
  <div>
    <Navbar />
    <div class="container gap-4 mx-auto">
      <div class="flex gap-4 justify-center">
        <button class="btn btn-primary mb-2" @click="openModalCart">
          Lihat keranjang
        </button>

        <button @click="goToCheckout" class="btn btn-info">Checkout</button>
      </div>

      <div class="grid grid-cols-5 gap-4">
        <!-- Card -->
        <div
          v-for="(product, index) in displayedProducts"
          :key="product.id"
          class="card w-56 bg-base-100 shadow-xl"
        >
          <figure>
            <img
              :src="product.product_images"
              :alt="product.product_name"
              width="384"
              height="216"
              layout="responsive"
              loading="lazy"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ product.product_name }}</h2>
            <p>{{ formatPrice(product.product_pricenow) }}</p>
            <div class="card-actions justify-end">
              <button @click="addToCart(product)" class="btn btn-primary">
                Beli
              </button>
            </div>
          </div>
        </div>
        <!-- End Card -->
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-4 mb-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="btn btn-info mr-2"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-info"
      >
        Next
      </button>
    </div>
    <!-- End Pagination -->

    <!-- Cart Modal -->
    <dialog id="cart_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Keranjang Belanja</h3>
        <ul>
          <li
            v-for="(product, index) in cart"
            :key="index"
            class="flex items-center justify-between mt-3"
          >
            <div class="flex items-center mb-2">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-12 h-12 mr-4"
              />
              <div>
                <p>{{ product.name }}</p>
                <p>{{ formatPrice(product.price) }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <button
                @click="decrementQuantity(index)"
                class="btn btn-secondary mr-2"
              >
                -
              </button>
              <span>{{ product.quantity }}</span>
              <button
                @click="incrementQuantity(index)"
                class="btn btn-secondary ml-2"
              >
                +
              </button>
              <button
                @click="removeFromCart(index)"
                class="btn btn-primary ml-4"
              >
                Hapus
              </button>
            </div>
          </li>
        </ul>
        <button @click="closeCartModal" class="btn mt-4">Tutup</button>
      </div>
    </dialog>
    <!-- End Cart Modal -->
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "~/components/Navbar.vue";
import ToastComponent from "~/components/Toast.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Navbar,
    "toast-component": ToastComponent,
  },
  data() {
    return {
      products: [],
      cart: [],
      showCartModal: false,
      showToast: false,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
    displayedProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.products.slice(startIndex, endIndex);
    },
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    goToCheckout() {
      const router = useRouter();
      router.push("/checkout");
    },

    async fetchProducts() {
      try {
        const response = await axios.get(
          "https://cloud.interactive.co.id/restapi/myprofit/data_product_30k.php"
        );

        const responseData = response.data.data_product;

        this.products = responseData.slice(0, 3000);

        localStorage.setItem("products", JSON.stringify(this.products));

        return this.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    formatPrice(value) {
      const price = parseInt(value);
      return price.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },

    openModalCart() {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }

      const modal = document.getElementById("cart_modal");
      modal.showModal();
    },

    addToCart(product) {
      // Cek apakah produk sudah ada dalam keranjang
      const existingProductIndex = this.cart.findIndex(
        (item) => item.name === product.product_name
      );

      if (existingProductIndex !== -1) {
        this.cart[existingProductIndex].quantity++;
      } else {
        this.cart.push({
          name: product.product_name,
          price: product.product_pricenow,
          image: product.product_images,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(this.cart));

      this.showToastMessage(
        "success",
        "Item berhasil ditambahkan ke keranjang!",
        false
      );

      const modal = document.getElementById("cart_modal");
      modal.showModal(); // Menampilkan modal
    },

    decrementQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.updateLocalStorage();
      }
    },

    incrementQuantity(index) {
      this.cart[index].quantity++;
      this.updateLocalStorage();
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.updateLocalStorage();
    },

    updateLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    closeCartModal() {
      const modal = document.getElementById("cart_modal");
      modal.close(); // Menutup modal
    },

    showToastMessage(variant, message, status) {
      this.toastVariant = variant;
      this.toastMessage = message;
      this.showToast = status;

      setTimeout(() => {
        this.hideToast();
      }, 1000);
    },

    hideToast() {
      this.showToast = false;
    },
  },
});
</script>
