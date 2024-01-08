// store/index.js

export const state = () => ({
    // Contoh state untuk PWA
    isOffline: false,
    isInstallPromptVisible: false,
  });
  
  export const mutations = {
    // Contoh mutation untuk mengubah nilai state isOffline
    setOffline(state, value) {
      state.isOffline = value;
    },
  
    // Contoh mutation untuk menampilkan atau menyembunyikan prompt instalasi
    setInstallPromptVisibility(state, value) {
      state.isInstallPromptVisible = value;
    },
  };
  
  export const actions = {
    // Contoh action untuk menangani logika ketika offline
    handleOffline({ commit }, isOffline) {
      commit('setOffline', isOffline);
    },
  
    // Contoh action untuk menangani logika prompt instalasi
    handleInstallPrompt({ commit }, isVisible) {
      commit('setInstallPromptVisibility', isVisible);
    },
  };
  