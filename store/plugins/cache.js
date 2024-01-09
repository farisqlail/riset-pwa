// store/plugins/cache.js
export default ({store}) => {
    // Lakukan setup untuk caching di sini
  
    // Contoh setup untuk menyimpan dan mengambil data dari cache
    store.subscribe((mutation, state) => {
      if (mutation.type === 'addToCart') {
        // Simpan state.cart ke cache setiap kali addToCart dipanggil
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    });
  };
  