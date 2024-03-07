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
        <input
          type="button"
          class="btn btn-info btn-wide"
          @click="printAndroid"
          value="Cetak Nota"
        />
        <button class="btn btn-error btn-wide" @click="redirectToHome">
          Kembali ke home
        </button>
      </div>
      {{ errors }}
      {{ errors2 }}
      {{ errors3 }}
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
      isAndroid: "",
      errors: "",
      errors2: "",
      errors3: "",
    };
  },
  async mounted() {
    // this.isAndroid = navigator.userAgent.toLowerCase().includes("android");
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

    printAndroid() {
      const checkoutData = this.loadCheckoutFromLocalStorage();
      const groupedItems = {};
      checkoutData.cart.forEach((item) => {
        if (!groupedItems[item.name]) {
          groupedItems[item.name] = {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          };
        } else {
          groupedItems[item.name].quantity += item.quantity;
        }
      });

      // Buat string untuk daftar item
      let cartString = "";
      const groupedItemsArray = Object.values(groupedItems);
      groupedItemsArray.forEach((item, index) => {
        cartString += `[${item.name}, ${item.price}, ${item.quantity}]`;
        // Tambahkan koma jika bukan item terakhir
        if (index !== groupedItemsArray.length - 1) {
          cartString += " \n"; // Tambahkan baris baru setelah setiap item, kecuali item terakhir
        }
      });

      const name = checkoutData.customerName;
      const price = checkoutData.totalPrice;
      Android.showToast(name, price, cartString);
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

    printReceipt() {
      // const checkoutData = this.loadCheckoutFromLocalStorage(); // Load checkout data from local storage
      // const receiptData = {
      //   customerName: this.customerName,
      //   items: this.cart,
      //   totalPrice: this.totalPrice,
      //   ...checkoutData, // Include loaded checkout data
      // };

      // const uniqueItems = Array.from(
      //   new Set(receiptData.items.map((item) => item.name))
      // );

      // const itemsContent = uniqueItems
      //   .map((item) => {
      //     const matchedItem = receiptData.items.find((i) => i.name === item);
      //     return `${matchedItem.name} - ${
      //       matchedItem.quantity
      //     } pcs - ${this.formatPrice(matchedItem.price)}`;
      //   })
      //   .join("</br>");

      // const printableContent = `
      //     <span align="center">invoice</span></br>
      //     Customer Name: ${receiptData.customerName}
      //     </br> -------------------------- </br>
      //     Items:</br></br>
      //     ${itemsContent}
      //     </br>
      //     </br> -------------------------- </br> </br>
      //     Total Price: ${this.formatPrice(receiptData.totalPrice)}
      //     </br></br>
      // `;

      this.isAndroid = navigator.userAgent.toLowerCase().includes("android");

      if (this.isAndroid) {
        this.printAndroid(data);
      } else {
        this.printDesktop(receiptData, printableContent);
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
