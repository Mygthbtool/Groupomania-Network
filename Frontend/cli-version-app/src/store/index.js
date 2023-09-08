import { createStore } from 'vuex'

export default createStore({
  state: {
    userData: {}, // Initialize userData as null
    posts:[]   // Initialize posts as null
  },
  getters: {
    // Optional: You can define getters to access the user data if needed
  },
  mutations: { 
    // Define a mutation to set the user data when received from the server
      setUserData(state, userData) {
      state.userData = userData;
    },
    setPosts(state, posts){
      state.posts = posts;
    }
  },
  actions: {
    // Optional: You can define actions if you need to perform async tasks
  },
  modules: {
    // Optional: You can define modules for organizing your store further
  }
})
