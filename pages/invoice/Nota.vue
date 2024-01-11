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

  // Create a new window
  // const printWindow = window.print();

  // Set the content of the new window
  // window.document.write(printableContent);

  // Print the document
  // window.document.close(); // Close the document to finalize the writing
  window.print();

  // Close the new window after printing
  // window.onafterprint = function () {
  //   window.close();
  // };

  // Reload after print (adjust the timing as needed)
  // setTimeout(() => {
  //   this.$store.commit("resetCart");
  //   this.$store.commit("resetCheckout");
  //   this.$router.push("/");
  // }, 1000); // Wait for 1 second before reloading
  // location.reload();
},