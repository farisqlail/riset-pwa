// store/index.js

export const state = () => ({
  // Contoh state untuk PWA
  isOffline: false,
  isInstallPromptVisible: false,
  cart: [],
});

export const mutations = {
  setOffline(state, value) {
    state.isOffline = value;
  },

  // addToCart(state, product) {
  //   state.cart.push(product);

  //   if (process.client) {
  //     localStorage.setItem("cart", JSON.stringify(state.cart));
  //   }
  // },

  addToCart(state, product) {
    const existingItem = state.cart.find(item => item.name === product.name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cart.push({
        name: product.name,
        price: product.price,
        image: product.image,
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
        const cart = JSON.parse(cartData);
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

  nuxtServerInit({ commit }) {
    commit("loadCartFromLocalStorage");
  },
};