<template>
  <div v-if="showToast" class="toast toast-top toast-end">
    <div class="alert alert-info">
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showToast: Boolean,
    toastVariant: String,
    toastMessage: String
  }
};
</script>
