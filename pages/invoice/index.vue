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

    async printReceipt() {
      const receiptData = {
        customerName: this.customerName,
        items: this.cart,
        totalPrice: this.totalPrice,
      };

      // Convert the receipt data to a printable format
      const printableContent = `
    <html>
        <head>
            <title>Receipt</title>
            <!-- Include any styles or additional head content here -->
        </head>
        <style>
            body {
              font-family: tahoma;
            }
        </style>
        <body>
            <h2>Receipt</h2>
            <p>Customer Name: ${receiptData.customerName}</p>
            <ul>
            ${receiptData.items
              .map(
                (item) =>
                  `<li>${item.name} - ${item.quantity} pcs - ${item.price} </li>`
              )
              .join("")}
            </ul>
            <p>Total Price: ${receiptData.totalPrice}</p>
            <!-- Include any additional content here -->
        </body>
        </html>
    `;

      // Set the current window's document content
      window.document.write(printableContent);

      // Print the document
      window.print();
      
      //reload setelah print
      location.reload();

      this.$store.commit("resetCart");
    },
  },
};
</script>