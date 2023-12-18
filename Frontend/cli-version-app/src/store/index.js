
import { createStore } from 'vuex'

export default createStore({
  
  state: {
    userData: JSON.parse(localStorage.getItem('userData')) || {}, // Initialize userData as null //localStorage.getItem('userData') ||
    posts:[] ,  // Initialize posts as null
   // token: '' ,
    post: {}
  },
  // getters: {
  //   // Optional: You can define getters to access the user data if needed
  //   isAuthenticated: (state) => !!state.userData,
  // },
  mutations: { 
    // Define a mutation to set the user data when received from the server
    setUserData(state, userData) {
      state.userData = userData;
      localStorage.setItem('userData', JSON.stringify(userData))

    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('userToken', token)
     },
    clearUserData(state) {
      state.userData = null,
      state.token= null,
      // Remove the token from local storage
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
    },
    setPosts(state, posts){
      state.posts = posts;
    },

    refreshPost(state, post){
      const posts = state.posts;
      const postToReplace = posts.find(fPost => fPost.post_id === post.post_id);
      Object.assign(postToReplace, post);
      state.posts = posts;
      
    },

    setPost(state, post){
      console.log(post);
      Object.assign(state.post, post);      
    }

  },  
  actions: {
    // Optional: You can define actions if you need to perform async tasks 
   
  },
  modules: {
    // Optional: You can define modules for organizing your store further
    
  }
})
