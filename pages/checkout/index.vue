<template>
  <div>
    <Navbar />
    <div class="container gap-4 mx-auto">
      <h2 class="text-2xl font-bold my-4">Checkout</h2>
      <div v-if="cart.length === 0" class="text-center text-gray-500">
        Keranjang belanja kosong.
      </div>
      <div v-else>
        <div
          v-for="(product, index) in cart"
          :key="index"
          class="flex items-center justify-between my-2"
        >
          <div class="flex items-center">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-12 h-12 mr-4"
            />
            <div>
              <p class="font-bold">{{ product.name }}</p>
              <p>{{ formatPrice(product.price) }}</p>
              <p>Jumlah: {{ product.quantity }}</p>
            </div>
          </div>
          <button @click="openDeleteModal(index)" class="btn btn-error">
            Hapus
          </button>
        </div>
        <div class="flex justify-between items-center mt-4">
          <p class="font-bold">Total:</p>
          <p>{{ formatPrice(totalPrice) }}</p>
        </div>
        <button @click="checkout" class="btn btn-primary mt-4 mx-auto">
          Proses Checkout
        </button>
      </div>

      <!-- Modal dialog -->
      <dialog id="deleteModal" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Konfirmasi Hapus</h3>
          <p>Apakah Anda yakin ingin menghapus item ini?</p>
          <div class="mt-2 flex justify-end gap-3">
            <button @click="closeDeleteModal" class="btn btn-primary">
              Tidak
            </button>
            <button @click="confirmDelete" class="btn btn-error">Ya</button>
          </div>
        </div>
      </dialog>
      <!-- End Modal dialog -->

    </div>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import axios from "axios";

export default {
  head() {
    return {
      title: "Checkout",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Your page description",
        },
      ],
    };
  },
  components: {
    Navbar,
  },
  data() {
    return {
      cart: [],
      deleteIndex: null,
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    },
  },
  async created() {
    await this.fetchData();
  },
  mounted() {
    this.beforeRouteEnter();
  },
  methods: {
    async fetchData() {
      if (process.client) {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          this.cart = JSON.parse(cartData);
        } else {
          this.cart = [];
        }
      }
    },

    beforeRouteEnter() {
      if (this.cart.length === 0) {
        this.$router.push("/");
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

    openDeleteModal(index) {
      this.deleteIndex = index;
      const modal = document.getElementById("deleteModal");
      modal.showModal();
    },

    closeDeleteModal() {
      const modal = document.getElementById("deleteModal");
      modal.close();
    },

    confirmDelete() {
      if (this.deleteIndex !== null) {
        this.removeFromCart(this.deleteIndex);
        this.closeDeleteModal();
      }
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.beforeRouteEnter();

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    saveCartToLocalStorage() {
      const dataCheckout = {
        customerName: "Faris",
        cart: this.cart,
        totalPrice: this.totalPrice,
      };

      localStorage.setItem("checkout", JSON.stringify(dataCheckout));
    },

    async checkout() {
      try {
        this.saveCartToLocalStorage();
        this.$router.push("/payments");
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Checkout gagal. Terjadi kesalahan.");
      }
    },
  },
};
</script>
