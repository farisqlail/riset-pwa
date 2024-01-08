<!-- pages/checkouts/index.vue -->
<template>
  <div class="container mt-5">
    <h2>Checkout</h2>
    <b-form @submit.prevent="submitOrder">
      <b-form-group label="Nama">
        <b-form-input v-model="customerName" required></b-form-input>
      </b-form-group>

      <!-- Tampilkan data keranjang -->
      <div v-if="cart.length > 0">
        <h3>Ringkasan Pesanan</h3>
        <ul>
          <li v-for="(item, index) in cart" :key="index">
            {{ item.name }} - {{ formatPrice(item.price) }} ({{ item.quantity }} pcs)
          </li>
        </ul>
      </div>

      <b-button type="submit" variant="success">Pesan Sekarang</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customerName: "",
      cart: this.$store.state.cart,  // Akses data keranjang dari store
    };
  },
  methods: {
    submitOrder() {
      // Lakukan proses submit order sesuai kebutuhan
      console.log("Order Submitted:", {
        customerName: this.customerName,
        items: this.cart,
      });

      // Setelah submit, Anda dapat mereset state keranjang atau melakukan navigasi ke halaman lain
      this.$store.commit("resetCart");
      this.$router.push("/");
    },
    formatPrice(value) {
      return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    },
  },
};
</script>
