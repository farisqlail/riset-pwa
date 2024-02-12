<template>
  <div
    class="toast toast-top toast-end"
    auto-hide-delay="2000"
    @hidden="onToastHidden"
  >
    <div class="alert alert-info">
      {{ message }}
    </div>
  </div>
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
  