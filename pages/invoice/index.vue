<template>
  <b-card class="mt-4">
    <div class="text-center">
      <h4>Terimakasih</h4>

      <p>
        Silakan cetak nota dan lanjutkan ke antrian pemesanan untuk
        menyelesaikan pembayaran
      </p>

      <b-button block variant="success" @click="printReceipt">
        Cetak nota
      </b-button>
    </div>
    <div id="printerDiv" style="display: none"></div>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      customerName: "",
      cart: [],
    };
  },
  async created() {
    // Fetch cart data asynchronously when the component is created
    await this.fetchCartData();
  },
  methods: {
    async fetchCartData() {
      await this.$store.dispatch("fetchCartData");
      const cartItems = this.$store.state.cart;

      // Merge items with the same name
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

      // Check if there is checkoutData in localStorage
      const checkoutData = localStorage.getItem("checkoutData");
      if (checkoutData) {
        const parsedCheckoutData = JSON.parse(checkoutData);
        // Merge checkoutData with the current cart
        this.cart = this.cart.concat(parsedCheckoutData.items);
        this.customerName = parsedCheckoutData.customerName;
      }

      console.log(checkoutData);

      this.calculateTotalPrice();
    },

    calculateTotalPrice() {
      this.totalPrice = this.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    formatPrice(value) {
      const price = parseInt(value);
      return price.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },

    // Your Nuxt.js component

    async printReceipt() {
      const receiptData = {
        customerName: this.customerName,
        items: this.cart,
        totalPrice: this.totalPrice,
      };

      try {
        const response = await this.$http.post(
          "/api/print-receipt",
          receiptData,
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": window.csrf_token,
            },
          }
        );

        if (response && response.data && response.data.success) {
          console.log("Receipt printed successfully");
        } else {
          console.error(
            "Error printing receipt:",
            response && response.data ? response.data.message : "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error sending receipt data:", error.message);
      }

      // Reload after print (adjust the timing as needed)
      this.$store.commit("resetCart");
      this.$store.commit("resetCheckout");
      this.$router.push("/");
    },
  },
};
</script>