<!-- pages/checkouts/index.vue -->
<template>
  <div class="container mt-5">
    <h2>Checkout</h2>
    <b-form @submit.prevent="submitOrder">
      <b-form-group label="Nama">
        <b-form-input v-model="customerName" required></b-form-input>
      </b-form-group>

      <!-- Tampilkan data keranjang -->
      <div v-if="cart.length > 0">
        <h3>Ringkasan Pesanan</h3>
        <div class="row-item">
          <div
            class="item-cart mb-3"
            v-for="(item, index) in cart"
            :key="index"
          >
            <div>
              <nuxt-img
                :src="getOptimizedImage(item.image)"
                width="100"
                :alt="item.name"
                loading="lazy"
              />
              {{ item.name }} - {{ formatPrice(item.price) }} ({{
                item.quantity
              }}
              pcs)
            </div>

            <div>
              <b-button @click="decreaseQuantity(index)" variant="info"
                >Kurangi</b-button
              >
              <b-button @click="increaseQuantity(index)" variant="success"
                >Tambah</b-button
              >
              <b-button @click="removeFromCart(index)" variant="danger"
                >Hapus</b-button
              >
            </div>
          </div>
        </div>
      </div>

      <b-button
        type="submit"
        @click="addMore"
        variant="success"
        class="mb-3"
        block
      >
        Tambah Pesanan
      </b-button>

      <b-card class="mb-3">
        <h5 class="mb-4">Total Harga: {{ formatPrice(totalPrice) }}</h5>
        <b-button type="submit" @click="submitOrder" variant="danger" block>
          Bayar
        </b-button>
      </b-card>
    </b-form>
  </div>
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
    // Fetch cart data asynchronously when the component is created
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

      this.cart = mergedCart;
      this.calculateTotalPrice();
    },

    addMore() {
      this.$router.push("/");
    },

    submitOrder() {
      this.$store.commit("saveCheckoutToCache", {
        customerName: this.customerName,
        items: this.cart,
      });

      this.$router.push("/payments");
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

    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.calculateTotalPrice();

        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    },

    increaseQuantity(index) {
      this.cart[index].quantity++;
      this.calculateTotalPrice();

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.calculateTotalPrice();

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    getOptimizedImage(imagePath) {
      const supportsWebP = this.browserSupportsWebP();
      let optimizedPath = imagePath;

      if (supportsWebP) {
        optimizedPath += "?format=webp";
      }

      return optimizedPath;
    },

    browserSupportsWebP() {
      // Check if running in a browser environment
      if (process.client) {
        const elem = document.createElement("canvas");

        if (!!(elem.getContext && elem.getContext("2d"))) {
          return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
        }
      }

      return false;
    },
  },
};
</script>


<style>
.row-item {
  display: flex;
  flex-direction: column;
}

.row-item .item-cart {
  display: flex;
  justify-content: space-between;
}
</style>