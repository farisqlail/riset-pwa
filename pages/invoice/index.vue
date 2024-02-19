<template>
  <div>
    <Navbar />
    <div class="container gap-4 mx-auto">
      <h2 class="text-2xl font-bold my-4 text-center">Terimakasih</h2>
      <p class="text-center">
        Silakan cetak nota dan lanjutkan ke antrian pemesanan untuk
        menyelesaikan pembayaran
      </p>

      <div class="btn-group flex gap-2 justify-center mt-4">
        <button class="btn btn-info btn-wide" @click="printReceipt">
          Cetak Nota
        </button>
        <button class="btn btn-error btn-wide" @click="redirectToHome">
          Kembali ke home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import Navbar from "~/components/Navbar.vue";

export default defineComponent({
  head() {
    return {
      title: "Invoice",
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
      customerName: "",
      checkout: [],
      data: [],
    };
  },
  mounted() {
    this.loadCheckoutFromLocalStorage();
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

    loadCheckoutFromLocalStorage() {
      const checkoutData = localStorage.getItem("checkout");
      if (checkoutData) {
        return JSON.parse(checkoutData);
      }
      return {}; // Return empty object if no data is found
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

    async printReceipt() {
      const checkoutData = this.loadCheckoutFromLocalStorage(); // Load checkout data from local storage
      const receiptData = {
        customerName: this.customerName,
        items: this.cart,
        totalPrice: this.totalPrice,
        ...checkoutData, // Include loaded checkout data
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

    redirectToHome() {
      const checkoutData = this.loadCheckoutFromLocalStorage();
      const receiptData = {
        customerName: this.customerName,
        items: this.cart,
        totalPrice: this.totalPrice,
        ...checkoutData,
      };
      this.saveTransaction(receiptData);
      localStorage.removeItem("cart");
      this.$router.push("/");
    },
  },
});
</script>
