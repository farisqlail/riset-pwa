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
              <b-button
                @click="decreaseQuantity(index, item.name)"
                variant="info"
                >Kurangi</b-button
              >
              <b-button @click="increaseQuantity(index)" variant="success"
                >Tambah</b-button
              >
              <b-button
                @click="openModalAlertDelete(index, item.name)"
                variant="danger"
                >Hapus</b-button
              >
            </div>
          </div>
        </div>
      </div>

      <nuxt-link to="/" class="btn btn-success btn-block mb-3">
        Tambah Pesanan
      </nuxt-link>

      <b-card class="mb-3">
        <h5 class="mb-4">Total Harga: {{ formatPrice(totalPrice) }}</h5>

        <b-button
          @click="submitOrder"
          variant="danger"
          :disabled="customerName == ''"
          block
        >
          Bayar
        </b-button>
      </b-card>
    </b-form>

    <!-- delete item -->
    <b-modal
      v-model="alertDeleteModal"
      id="alertDeleteModal"
      title="Hapus item"
    >
      <p>
        Apakah anda yakin untuk menghapus
        <span class="fw-bolder">{{ nameItem }}</span> ini dalam cart ?
      </p>
      <template #modal-footer>
        <b-button variant="dark" @click="alertDeleteModal = false"
          >Batal</b-button
        >
        <b-button @click="removeFromCart(indexItem)" variant="danger"
          >Hapus</b-button
        >
      </template>
    </b-modal>
    <!-- end delete item -->
  </div>
</template>

<script>
import ToastComponent from "~/components/Toast.vue";

export default {
  data() {
    return {
      customerName: "",
      cart: [],
      totalPrice: 0,
      indexItem: 0,
      showToast: false,
      toastVariant: "success",
      toastMessage: "Item berhasil ditambahkan ke keranjang!",
      alertDeleteModal: false,
      nameItem: "",
    };
  },
  async created() {
    // Fetch cart data asynchronously when the component is created
    await this.fetchCartData();
    await this.beforeRouteEnter();
  },
  methods: {
    async beforeRouteEnter() {
      if (this.cart.length === 0) {
        this.$router.push("/");
      }
    },
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

    showToastMessage(variant, message) {
      this.toastVariant = variant;
      this.toastMessage = message;
      this.showToast = true;
    },

    saveCheckout() {
      if (process.client) {
        // Save checkout information to local storage
        localStorage.setItem(
          "checkoutData",
          JSON.stringify({
            customerName: this.customerName,
            items: this.cart,
          })
        );

        // You can also save to Vuex store if needed
        this.$store.commit("saveCheckoutToCache", {
          customerName: this.customerName,
          items: this.cart,
        });
      }
    },

    submitOrder() {
      this.saveCheckout();

      this.$router.push("/payments");
    },

    calculateTotalPrice() {
      if (this.cart.length !== 0) {
        this.totalPrice = this.cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      } else {
        this.totalPrice = 0;
      }
    },

    formatPrice(value) {
      const price = parseInt(value);
      return price.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },

    decreaseQuantity(index, name) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.calculateTotalPrice();

        localStorage.setItem("cart", JSON.stringify(this.cart));
      } else if (this.cart[index].quantity == 1) {
        this.openModalAlertDelete(index, name);
      }
    },

    increaseQuantity(index) {
      this.cart[index].quantity++;
      this.calculateTotalPrice();

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    openModalAlertDelete(index, name) {
      this.showCartModal = false;
      this.alertDeleteModal = true;
      this.indexItem = index;
      this.nameItem = name;
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(this.cart));

      this.calculateTotalPrice();
      this.alertDeleteModal = false;
      this.nameItem = "";
      this.beforeRouteEnter();
      this.showToastMessage("success", "Item berhasil dihapus dari keranjang!");
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