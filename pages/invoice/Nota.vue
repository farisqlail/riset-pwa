<template>
  <div class="invoice-container">
    <div class="invoice-header">
      <h2>Invoice</h2>
      <p>Customer: {{ customerName }}</p>
      {{}}
    </div>
    <div class="invoice-body">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatPrice(item.price) }}</td>
            <td>{{ formatPrice(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="invoice-footer">
      <p>Total Price: {{ formatPrice(totalPrice) }}</p>
    </div>
  </div>
</template>
  
<script>
export default {
  props: {
    customerName: String,
    cart: Array,
    totalPrice: Number,
  },
  mounted() {
    const receiptData = JSON.parse(this.$route.query.receiptData || "{}");
    console.log(this.$route);
    // Process the receiptData as needed
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
  },
};
</script>
  
<style scoped>
.invoice-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
}

.invoice-header {
  text-align: center;
  margin-bottom: 20px;
}

.invoice-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.invoice-body th,
.invoice-body td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.invoice-footer {
  text-align: right;
  font-weight: bold;
}
</style>
  