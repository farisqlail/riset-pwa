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
    <span>{{err}}</span>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      customerName: "",
      cart: [],
      err: "",
    };
  },
  async created() {
    // await this.fetchCartData();
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

    isAppInstalled(packageName) {
      try {
        window.Android.isAppInstalled(packageName);
        return true;
      } catch (error) {
        return false;
      }
    },

    generateValidBarcodeValue() {
      return "2132137538472"; // Replace with your logic
    },

    generateValidQRCodeValue() {
      return "This is sample"; // Replace with your logic
    },

    getBase64(pageWidth, filePath) {
      return "base64_string"; // Replace with your logic
    },

    getHTMLEquivalent(s) {
      return s.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    },

    // Your Nuxt.js component
    printReceipt() {
      // const receiptData = {
      //   customerName: this.customerName,
      //   items: this.cart,
      //   totalPrice: this.totalPrice,
      // };

      // Step 1: Create data string
      let printData = `<113>Mate Technologies<100>Website: www.matetech.in\nEmail: matetusshar@gmail.com`;

      // Step 2: Print text data
      printData += `<110>test ini print `;

      // Step 3: Print image
      // const imagePath = "/BluetoothPrint/test.jpg"; // Adjust the path based on your project structure
      // const imageBase64 = await this.getBase64(48, imagePath);
      // printData += `<IMAGE>1#${imageBase64}`;

      // Step 4: Print Barcode
      // const barcodeValue = "2132137538472";
      // printData += `<BARCODE>0#100#50#${barcodeValue}`;

      // Step 5: Print QR Code
      // const qrCodeValue = "This is sample";
      // printData += `<QR>1#40#${qrCodeValue}`;

      // Step 6: Print HTML
      const htmlCode = this.getHTMLEquivalent(
        '<div><div style="float:left;"><b>This is left</b></div><div style="float:right;font-size:15px;">This is right</div></div>'
      );
      printData += `<HTML>${htmlCode}`;

      // Step 7: Check if Bluetooth Print app is installed
      const appInstalled = this.isAppInstalled("mate.bluetoothprint");

      // Step 8: Open Bluetooth Print app with the prepared data
      if (appInstalled) {
        const sendIntent = {
          action: "android.intent.action.SEND",
          packageName: "mate.bluetoothprint",
          type: "text/plain",
          extras: {
            "android.intent.extra.TEXT": printData,
          },
        };

        window.Android.startActivity(sendIntent);
      } else {
        this.err = "Bluetooth Print app is not installed.";
      }
    },

    //old function
    // async printReceipt() {
    //   const receiptData = {
    //     customerName: this.customerName,
    //     items: this.cart,
    //     totalPrice: this.totalPrice,
    //   };

    //   const uniqueItems = Array.from(
    //     new Set(receiptData.items.map((item) => item.name))
    //   );

    //   const itemsContent = uniqueItems
    //     .map((item) => {
    //       const matchedItem = receiptData.items.find((i) => i.name === item);
    //       return `${matchedItem.name} - ${
    //         matchedItem.quantity
    //       } pcs - ${this.formatPrice(matchedItem.price)}`;
    //     })
    //     .join("</br>");

    //   const printableContent = `
    //       <span align="center">invoice</span></br>
    //       Customer Name: ${receiptData.customerName}
    //       </br> -------------------------- </br>
    //       Items:</br></br>
    //       ${itemsContent}
    //       </br>
    //       </br> -------------------------- </br> </br>
    //       Total Price: ${this.formatPrice(receiptData.totalPrice)}
    //       </br></br>
    //   `;

    //   window.document.write(printableContent);
    //   window.document.close();
    //   window.onafterprint = () => {
    //     window.document.close("", "_blank");
    //   };
    //   window.print();

    //   this.saveTransaction(receiptData);

    //   // Reload after print (adjust the timing as needed)
    //   setTimeout(() => {
    //     this.$store.commit("resetCart");
    //     this.$store.commit("resetCheckout");
    //     this.$router.push("/");
    //   }, 1000); // Wait for 1 second before reloading
    // },
  },
};
</script>