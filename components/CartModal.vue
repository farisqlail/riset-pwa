<!-- components/CartModal.vue -->
<template>
  <b-modal v-model="showCartModal" size="lg" title="Shopping Cart">
    <b-list-group flush>
      <b-list-group-item
        v-for="(item, index) in cart"
        :key="index"
        class="d-flex justify-content-between align-items-center"
      >
        <div class="d-flex align-items-center">
          <nuxt-img
            :src="getOptimizedImage(item.image)"
            :alt="item.name"
            width="50"
            height="50"
            class="mr-2"
            loading="lazy"
          />
          <span
            >{{ item.name }} - {{ formatPrice(item.price) }} ({{
              item.quantity
            }}
            pcs)</span
          >
        </div>
        <div>
          <b-button @click="decreaseQuantity(index)" variant="info" class="mr-2"
            >Kurangi</b-button
          >
          <b-button
            @click="increaseQuantity(index)"
            variant="success"
            class="mr-2"
            >Tambah</b-button
          >
          <b-button @click="removeFromCart(index)" variant="danger"
            >Hapus</b-button
          >
        </div>
      </b-list-group-item>
    </b-list-group>

    <template #modal-footer>
      <nuxt-link to="/checkout" variant="primary">Checkout</nuxt-link>
    </template>
  </b-modal>
</template>
  
  <script>
export default {
  props: {
    showCartModal: {
      type: Boolean,
      required: true,
    },
    cart: {
      type: Array,
      default: () => [],
    },
    getOptimizedImage: {
      type: Function,
      required: true,
    },
    formatPrice: {
      type: Function,
      required: true,
    },
  },
};
</script>
  
  <style scoped>
/* (Gaya yang sama seperti pada index.vue) */
</style>
  