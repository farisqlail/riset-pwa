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
          <button @click="removeFromCart(index)" class="btn btn-error">
            Hapus
          </button>
        </div>
        <div class="flex justify-between items-center mt-4">
          <p class="font-bold">Total:</p>
          <p>{{ formatPrice(totalPrice) }}</p>
        </div>
        <button @click="checkout" class="btn btn-primary mt-4">
          Proses Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import axios from "axios";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      cart: [],
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
  mounted() {
    // Ambil data dari local storage atau API, tergantung implementasi Anda
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
  },
  methods: {
    formatPrice(value) {
      const price = parseInt(value);
      return price.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.saveCartToLocalStorage();
    },
    saveCartToLocalStorage() {
      const dataCheckout = {
        customerName: "Faris",
        cart: this.cart,
        totalPrice: this.totalPrice
      };
      localStorage.setItem("checkout", JSON.stringify(dataCheckout));
    },
    async checkout() {
      try {
        // Proses checkout, misalnya mengirim data ke server atau menampilkan pesan berhasil
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
