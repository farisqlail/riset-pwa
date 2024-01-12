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