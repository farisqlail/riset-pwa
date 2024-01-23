// store/plugins/cache.js
export default ({store}) => {
    store.subscribe((mutation, state) => {
      if (mutation.type === 'addToCart') {
        // Simpan state.cart ke cache setiap kali addToCart dipanggil
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    });
  };
  