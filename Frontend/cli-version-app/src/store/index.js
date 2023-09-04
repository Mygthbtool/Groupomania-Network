import { createStore } from 'vuex'

export default createStore({
  state: {
    userData: {}, // Initialize userData as null
    posts:[]
  },
  getters: {
    // Optional: You can define getters to access the user data if needed
  },
  mutations: { 
    // Define a mutation to set the user data when received from the server
      setUserData(state, userData) {
      state.userData = userData;
    },
    setPostData(state, postData){
      state.posts = postData;
    }
  },
  actions: {
    // Optional: You can define actions if you need to perform async tasks
  },
  modules: {
    // Optional: You can define modules for organizing your store further
  }
})
