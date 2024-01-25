<template>
  <b-card class="mt-4">
    <div class="text-center">
      <h4>Terimakasih</h4>

      <p>
        Silakan cetak nota dan lanjutkan ke antrian pemesanan untuk
        menyelesaikan pembayaran
      </p>

      <div class="row">
        <div class="col">
          <b-button block variant="success" @click="printReceipt">
            Cetak nota
          </b-button>
        </div>
        <div class="col">
          <b-button @click="backToMain" class="btn btn-danger btn-block">
            Kembali ke home
          </b-button>
        </div>
      </div>
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

      // Merge with checkoutData from localStorage
      const checkoutData = JSON.parse(localStorage.getItem("checkoutData")) || {
        items: [],
        customerName: "",
      };
      this.cart = mergedCart.concat(checkoutData.items);
      this.customerName = checkoutData.customerName;

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

    backToMain() {
      const receiptData = {
        customerName: this.customerName,
        items: this.cart,
        totalPrice: this.totalPrice,
      };

      this.saveTransaction(receiptData);

      this.$store.commit("resetCart");
      this.$store.commit("resetCheckout");
      this.$router.push("/");
    },

    saveTransaction(transactionData) {
      // Cek apakah sudah ada data transaksi sebelumnya di localStorage
      const existingTransactions =
        JSON.parse(localStorage.getItem("transactions")) || [];

      // Tambahkan data transaksi baru
      existingTransactions.push(transactionData);

      // Simpan kembali data transaksi ke localStorage
      localStorage.setItem(
        "transactions",
        JSON.stringify(existingTransactions)
      );
    },

    // Fungsi untuk mendapatkan data transaksi dari localStorage
    getTransactions() {
      // Dapatkan data transaksi dari localStorage
      const existingTransactions =
        JSON.parse(localStorage.getItem("transactions")) || [];

      return existingTransactions;
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

      const uniqueItems = Array.from(
        new Set(receiptData.items.map((item) => item.name))
      );

      const itemsContent = uniqueItems
        .map((item) => {
          const matchedItem = receiptData.items.find((i) => i.name === item);
          return `${matchedItem.name} - ${
            matchedItem.quantity
          } pcs - ${this.formatPrice(matchedItem.price)}`;
        })
        .join("</br>");

      const printableContent = `
          <span align="center">invoice</span></br>
          Customer Name: ${receiptData.customerName}
          </br> -------------------------- </br>
          Items:</br></br>
          ${itemsContent}
          </br>
          </br> -------------------------- </br> </br>
          Total Price: ${this.formatPrice(receiptData.totalPrice)}
          </br></br>
      `;

      const newWindow = window.open("", "_blank");
      newWindow.document.write(printableContent);
      newWindow.document.close(); // Close the document to finalize the writing

      newWindow.onafterprint = () => {
        newWindow.close(); // Close the new window after printing
        // Perform additional actions after printing if needed
      };

      newWindow.print();

      this.saveTransaction(receiptData);

      // Reload after print (adjust the timing as needed)
      setTimeout(() => {
        this.$store.commit("resetCart");
        this.$store.commit("resetCheckout");
        this.$router.push("/");
      }, 1000); // Wait for 1 second before reloading
    },

    //print bluetooth
    async printReceipt() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ["e7d2a5c2-301e-0030-76e5-4d5f83000000"] }],
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(
          "e7d2a5c2-301e-0030-76e5-4d5f83000000"
        );
        const characteristic = await service.getCharacteristic(
          "e0cbf06c-cd8b-4647-bb8a-263b43f0f974"
        );

        const receiptData = {
          customerName: this.customerName,
          items: this.cart,
          totalPrice: this.totalPrice,
        };

        // Create a formatted receipt content
        const printableContent = `
      <span align="center">invoice</span></br>
      Customer Name: ${receiptData.customerName}
      </br> -------------------------- </br>
      Items:</br></br>
      ${receiptData.items
        .map(
          (item) =>
            `${item.name} - ${item.quantity} pcs - ${this.formatPrice(
              item.price
            )}`
        )
        .join("</br>")}
      </br>
      </br> -------------------------- </br> </br>
      Total Price: ${this.formatPrice(receiptData.totalPrice)}
      </br></br>
    `;

        // Convert the content to Uint8Array
        const encoder = new TextEncoder("utf-8");
        const data = encoder.encode(printableContent);

        // Write the data to the Bluetooth characteristic
        await characteristic.writeValue(data);

        // Handle success or perform additional actions
        console.log("Print successful");

        this.saveTransaction(receiptData);

        // Reload after print (adjust the timing as needed)
        setTimeout(() => {
          this.$store.commit("resetCart");
          this.$store.commit("resetCheckout");
          this.$router.push("/");
        }, 1000); // Wait for 1 second before reloading
      } catch (error) {
        // Handle errors
        console.error("Error printing:", error);
      }
    },
  },
};
</script>