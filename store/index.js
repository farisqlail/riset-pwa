export const state = () => ({
    checkoutData: null
  })
  
  export const mutations = {
    saveCheckoutData(state, data) {
      state.checkoutData = data
    }
  }
  