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

    async isAppInstalled(packageName) {
      try {
        await window.Android.isAppInstalled(packageName);
        return true;
      } catch (error) {
        return false;
      }
    },

    // Function to generate a valid barcode value
    generateValidBarcodeValue() {
      // Implement your logic to generate a valid barcode value
      return "2132137538472";
    },

    // Function to generate a valid QR code value
    generateValidQRCodeValue() {
      // Implement your logic to generate a valid QR code value
      return "This is sample";
    },

    // Function to get the base64 representation of an image
    getBase64(pageWidth, filePath) {
      // Implement your logic to get the base64 string corresponding to the image
      // ...

      // Return the base64 string
      return "base64_string";
    },

    // Function to get the HTML equivalent
    getHTMLEquivalent(s) {
      return s.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
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

      // Check if running in an Android WebView
      const isAndroidWebView = window.Android && window.Android.printPage;

      if (isAndroidWebView) {
        // Handle Android-specific printing logic here
        window.Android.printPage();
      } else {
        // For other platforms, use the standard window.print()
        window.document.write(printableContent);
        window.document.close();
        window.onafterprint = () => {
          window.document.close("", "_blank");
        };
        window.print();
      }

      // Prepare data for Bluetooth Print app
      const dataForBluetoothPrint = `
        <113>Mate Technologies<100>Website: www.matetech.in\nEmail: matetusshar@gmail.com
        <IMAGE>1#${this.getBase64(48, "path/to/your/image.jpg")}
        <BARCODE>0#100#50#${generateValidBarcodeValue()}
        <QR>1#40#${generateValidQRCodeValue()}
        <HTML>${this.getHTMLEquivalent(
          '<div><div style="float:left;"><b>This is left</b></div><div style="float:right;font-size:15px;">This is right</div></div>'
        )}`;

      // Check if Bluetooth Print app is installed
      const appInstalled = await this.isAppInstalled("mate.bluetoothprint");

      // Open Bluetooth Print app with the prepared data
      if (appInstalled) {
        const sendIntent = {
          action: "android.intent.action.SEND",
          packageName: "mate.bluetoothprint",
          type: "text/plain",
          extras: {
            "android.intent.extra.TEXT": dataForBluetoothPrint,
          },
        };

        window.Android.startActivity(sendIntent);
      } else {
        console.error("Bluetooth Print app is not installed.");
      }

      this.saveTransaction(receiptData);

      // Reload after print (adjust the timing as needed)
      setTimeout(() => {
        this.$store.commit("resetCart");
        this.$store.commit("resetCheckout");
        this.$router.push("/");
      }, 1000); // Wait for 1 second before reloading
    },

    //print bluetooth
    // async printReceipt() {
    //   try {
    //     const device = await navigator.bluetooth.requestDevice({
    //       filters: [{ services: ["e7d2a5c2-301e-0030-76e5-4d5f83000000"] }],
    //     });

    //     const server = await device.gatt.connect();
    //     const service = await server.getPrimaryService(
    //       "e7d2a5c2-301e-0030-76e5-4d5f83000000"
    //     );
    //     const characteristic = await service.getCharacteristic(
    //       "e0cbf06c-cd8b-4647-bb8a-263b43f0f974"
    //     );

    //     const receiptData = {
    //       customerName: this.customerName,
    //       items: this.cart,
    //       totalPrice: this.totalPrice,
    //     };

    //     // Create a formatted receipt content
    //     const printableContent = `
    //   <span align="center">invoice</span></br>
    //   Customer Name: ${receiptData.customerName}
    //   </br> -------------------------- </br>
    //   Items:</br></br>
    //   ${receiptData.items
    //     .map(
    //       (item) =>
    //         `${item.name} - ${item.quantity} pcs - ${this.formatPrice(
    //           item.price
    //         )}`
    //     )
    //     .join("</br>")}
    //   </br>
    //   </br> -------------------------- </br> </br>
    //   Total Price: ${this.formatPrice(receiptData.totalPrice)}
    //   </br></br>
    // `;

    //     // Convert the content to Uint8Array
    //     const encoder = new TextEncoder("utf-8");
    //     const data = encoder.encode(printableContent);

    //     // Write the data to the Bluetooth characteristic
    //     await characteristic.writeValue(data);

    //     // Handle success or perform additional actions
    //     console.log("Print successful");

    //     this.saveTransaction(receiptData);

    //     // Reload after print (adjust the timing as needed)
    //     setTimeout(() => {
    //       this.$store.commit("resetCart");
    //       this.$store.commit("resetCheckout");
    //       this.$router.push("/");
    //     }, 1000); // Wait for 1 second before reloading
    //   } catch (error) {
    //     // Handle errors
    //     console.error("Error printing:", error);
    //   }
    // },
  },
};
</script>