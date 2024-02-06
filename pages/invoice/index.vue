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
            Cetak nota local
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
import axios from "axios";

export default {
  data() {
    return {
      customerName: "",
      cart: [],
      err: "",
      respon: [],
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

    async printAndroid() {
      try {
        const apiUrl =
          "https://cloud.interactive.co.id/myprofit/api/get_print_myorder_pwa";
        const response = await axios.get(apiUrl);
        const printUrl = `my.bluetoothprint.scheme://${apiUrl}`;

        // Redirect to the print URL
        window.location.href = printUrl;

        this.respon = response;
      } catch (error) {
        console.error("Error fetching print data:", error);
      }
    },

    async printDesktop(receiptData, printableContent) {
      window.document.write(printableContent);
      window.document.close();
      window.onafterprint = () => {
        window.document.close("", "_blank");
      };
      window.print();
      this.saveTransaction(receiptData);
      // Reload after print (adjust the timing as needed)
      setTimeout(() => {
        this.$store.commit("resetCart");
        this.$store.commit("resetCheckout");
        this.$router.push("/");
      }, 1000);
    },

    //old function
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

      const isAndroid = navigator.userAgent.toLowerCase().includes("android");

      if (isAndroid) {
        await this.printAndroid();
      } else {
        await this.printDesktop(receiptData, printableContent);
      }
    },
  },
};
</script>