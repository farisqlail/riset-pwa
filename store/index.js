import axios from "axios";

const CART_CACHE_NAME = "my-cart-cache";
const GUIDES_CACHE_NAME = "my-guides-cache";

export const state = () => ({
  isOffline: false,
  isInstallPromptVisible: false,
  cart: [],
  guides: [],
});

const saveToCache = (cacheName, key, data) => {
  if (process.client) {
    try {
      localStorage.setItem(`${cacheName}:${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to ${cacheName} cache:`, error);
    }
  }
};


const loadFromCache = (cacheName, key, commit) => {
  if (process.client) {
    try {
      const cachedData = localStorage.getItem(`${cacheName}:${key}`);

      if (cachedData) {
        const data = JSON.parse(cachedData);
        commit(`set${key.charAt(0).toUpperCase() + key.slice(1)}`, data);
        return data;
      }
    } catch (error) {
      console.error(`Error loading ${key} from ${cacheName} cache:`, error);
    }
  }
};


export const mutations = {
  setOffline(state, value) {
    state.isOffline = value;
  },

  setGuides(state, guides) {
    state.guides = guides;
  },

  addToCart(state, product) {
    const existingItem = state.cart.find((item) => item.name === product.product_name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cart.push({
        name: product.product_name,
        price: product.product_pricenow,
        image: product.product_images,
        quantity: 1,
      });
    }

    this.commit("saveCartToCache");
  },

  removeFromCart(state, index) {
    state.cart.splice(index, 1);
    this.commit("saveCartToCache");
  },

  clearCart(state) {
    state.cart = [];
    this.commit("clearCartCache");
  },

  saveCartToCache(state) {
    const filteredCart = state.cart.filter((item) => item.quantity !== null && item.quantity !== undefined);
    saveToCache(CART_CACHE_NAME, "cart", filteredCart);
  },

  loadCartFromCache(state) {
    loadFromCache(CART_CACHE_NAME, "cart", this.commit);
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      state.cart = JSON.parse(cartData);
    }
  },

  setCart(state, cart) {
    state.cart = cart;
  },

  clearCartCache() {
    if (process.client) {
      caches.open(CART_CACHE_NAME).then((cache) => {
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

  resetCheckout(state) {
    state.cart = [];
    if (process.client) {
      localStorage.removeItem("checkoutData");
    }
  },

  resetGuides(state) {
    state.guides = [];
    if (process.client) {
      localStorage.removeItem("guides");
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
    try {
      if (process.client) {
        localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      }
      // Lakukan sesuatu dengan data yang sudah diambil
    } catch (error) {
      console.error("Error parsing or retrieving data from localStorage:", error);
    }
  },

  setCartData(state, cartData) {
    state.cart = cartData;
  },
};

export const actions = {
  async addToCart({ commit }, product) {
    commit("addToCart", product);
    commit("saveCartToCache");
    commit("calculateTotalPrice");
  },


  async loadGuides({ commit, state }) {
    try {
      const cachedGuides = await loadFromCache(GUIDES_CACHE_NAME, "guides", commit);

      if (cachedGuides && Array.isArray(cachedGuides) && cachedGuides.length > 0) {
        // Guides loaded from cache, commit to state
        commit("setGuides", cachedGuides);
      } else {
        // Guides not found in cache, load from local storage
        const localGuides = localStorage.getItem("guides");

        if (localGuides) {
          const parsedGuides = JSON.parse(localGuides);
          commit("setGuides", parsedGuides);
        }
      }

      // Fetch data from the server and commit to the store
      const response = await fetchDataFromApi(); // Replace with your actual API call
      const guidesData = response.data;

      // Save guides to cache
      saveToCache(GUIDES_CACHE_NAME, "guides", guidesData);

      // Commit guides data to the store
      commit("setGuides", guidesData);

      return guidesData;
    } catch (error) {
      console.error("Error loading guides data:", error);
      return [];
    }
  },


  async fetchCartData({ commit, state }) {
    try {
      if (process.client) {
        // If running on the client side, use local storage
        const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
        commit("setCartData", cartData);
        return cartData;

      } else {
        // If running on the server side, check if cart data is already in state
        if (state.cart && state.cart.length > 0) {
          return state.cart;
        }
        // else {
        //   // Fetch data from the server and commit to the store
        //   const response = await fetchDataFromApi(); // Replace with your actual API call
        //   const cartData = response.data;
        //   commit("setCartData", cartData);
        //   return cartData;
        // }
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return [];
    }
  },

  async loadCartFromCache({ commit }) {
    loadFromCache(CART_CACHE_NAME, "cart", commit);
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      commit("setCart", JSON.parse(cartData));
    }
  },

  async saveCartToCache({ state }) {
    saveToCache(CART_CACHE_NAME, "cart", state.cart);
  },

  async clearCartCache() {
    if (process.client) {
      try {
        const cache = await caches.open(CART_CACHE_NAME);
        await cache.delete("cart");
      } catch (error) {
        console.error("Error clearing cart cache:", error);
      }
    }
  },

  async setDataCart({ commit }, cartData) {
    commit("setCartData", cartData);
  },

  handleOffline({ commit }, isOffline) {
    commit('setOffline', isOffline);
  },

  handleInstallPrompt({ commit }, isVisible) {
    commit('setInstallPromptVisibility', isVisible);
  },
};
