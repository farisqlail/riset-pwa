// store/index.js
import axios from "axios";

export const state = () => ({
  // Contoh state untuk PWA
  isOffline: false,
  isInstallPromptVisible: false,
  cart: [],
  guides: [],
});

export const mutations = {
  setOffline(state, value) {
    state.isOffline = value;
  },

  setGuides(state, guides) {
    state.guides = guides;
  },

  // addToCart(state, product) {
  //   state.cart.push(product);

  //   if (process.client) {
  //     localStorage.setItem("cart", JSON.stringify(state.cart));
  //   }
  // },

  addToCart(state, product) {
    console.log("store", state);
    const existingItem = state.cart.find(item => item.name === product.strMeal);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cart.push({
        name: product.strMeal,
        price: 10000,
        image: product.strMealThumb,
        quantity: 1,
      });
    }

    // Update state first, then save to cache
    this.commit("saveCartToCache");
  },

  removeFromCart(state, index) {
    state.cart.splice(index, 1);
    // Simpan data keranjang ke cache setelah diupdate
    this.commit("saveCartToCache");
  },

  clearCart(state) {
    state.cart = [];
    // Hapus data keranjang dari cache setelah diupdate
    this.commit("clearCartCache");
  },

  saveCartToCache(state) {
    // Simpan data ke cache jika berada di sisi klien
    // if (process.client) {
    //   caches.open("my-cache-name").then(cache => {
    //     cache.put("cart", new Response(JSON.stringify(state.cart)));
    //   });
    // }
    const filteredCart = state.cart.filter(item => item.quantity !== null && item.quantity !== undefined);

    localStorage.setItem("cart", JSON.stringify(filteredCart));
  },

  loadCartFromCache(state) {
    // Ambil data dari cache jika berada di sisi klien
    if (process.client) {
      caches.open("my-cache-name").then(cache => {
        cache.match("cart").then(response => {
          if (response) {
            response.json().then(data => {
              state.cart = data;
            });
          }
        });
      });

      const cartData = localStorage.getItem("cart");
      if (cartData) {
        state.cart = JSON.parse(cartData);
      }
    }
  },

  setCart(state, cart) {
    state.cart = cart;
  },

  clearCartCache() {
    // Hapus data dari cache jika berada di sisi klien
    if (process.client) {
      caches.open("my-cache-name").then(cache => {
        cache.delete("cart");
      });
    }
  },

  resetCart(state) {
    state.cart = [];

    if (process.client) {
      localStorage.removeItem("cart");
    }
  },

  setInstallPromptVisibility(state, value) {
    state.isInstallPromptVisible = value;
  },

  loadCartFromLocalStorage(state) {
    if (process.client) {
      const cartData = localStorage.getItem("cart");

      if (cartData) {
        state.cart = JSON.parse(cartData);
      }
    }
  },

  saveCheckoutToCache(state, checkoutData) {
    // Simpan data ke cache jika berada di sisi klien
    if (process.client) {
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }
  },
};

export const actions = {
  async fetchCartData({ commit }) {
    if (process.client) {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const cart = cartData ? JSON.parse(cartData) : [];
        commit("setCart", cart);
      }
    }
  },

  async fetchData({ commit }) {
    // Lakukan operasi asinkron di sini dan panggil mutasi setelahnya
    const data = await fetchDataFromApi();
    commit('updateData', data);
  },

  // Contoh action untuk menangani logika ketika offline
  handleOffline({ commit }, isOffline) {
    commit('setOffline', isOffline);
  },

  // Contoh action untuk menangani logika prompt instalasi
  handleInstallPrompt({ commit }, isVisible) {
    commit('setInstallPromptVisibility', isVisible);
  },

  // nuxtServerInit({ commit }) {
  //   if (process.client) {
  //     const guidesData = localStorage.getItem("guides");
  //     if (guidesData) {
  //       const guides = JSON.parse(guidesData);
  //       commit("setGuides", guides);
  //     }
  //   }
  // },
  async nuxtServerInit({ commit }, { req }) {
    try {
      // Import axios specifically for server-side rendering
      const axios = require("axios").default;
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
      );
      const guides = response.data.meals;
      commit("setGuides", guides);
    } catch (error) {
      console.error("Error fetching guides during SSR:", error);
    }
  },
};