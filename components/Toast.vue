<!-- components/Toast.vue -->

<template>
    <b-toast
      v-model="showToast"
      auto-hide-delay="2000"
      :variant="variant"
      @hidden="onToastHidden"
    >
      {{ message }}
    </b-toast>
  </template>
  
  <script>
  export default {
    props: {
      showToast: {
        type: Boolean,
        required: true,
      },
      variant: {
        type: String,
        default: "success",
      },
      message: {
        type: String,
        default: "Item berhasil ditambahkan ke keranjang!",
      },
    },
    methods: {
      onToastHidden() {
        this.$emit("toast-hidden");
      },
    },
  };
  </script>
  