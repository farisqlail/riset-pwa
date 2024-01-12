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

      const printableContent = `
        <span align="center">invoice</span></br>
        Customer Name: ${receiptData.customerName}
        </br> -------------------------- </br>
        Items:</br></br>
        ${receiptData.items
          .map((item) => `${item.name} - ${item.quantity} pcs - ${item.price}`)
          .join("</br>")}
        </br>
        </br> -------------------------- </br> </br>
        Total Price: ${receiptData.totalPrice}
        </br></br>
      `;

      // Set the content of the new window
      window.document.write(printableContent);

      // Print the document
      window.document.close(); // Close the document to finalize the writing
      window.print();

      // Close the new window after printing
      window.onafterprint = function () {
        window.close();
      };

      // Reload after print (adjust the timing as needed)
      setTimeout(() => {
        this.$store.commit("resetCart");
        this.$store.commit("resetCheckout");
        this.$router.push("/");
      }, 1000); // Wait for 1 second before reloading
      location.reload();
    },
  },
};
</script>