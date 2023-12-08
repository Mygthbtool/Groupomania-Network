
import { createStore } from 'vuex'
//import Cookies from 'js-cookie';
//import auth from './auth';

// Get user data from local storage (or any other persistent storage solution)

export default createStore({
  
  state: {
    userData: {}, // Initialize userData as null //localStorage.getItem('userData') ||
    posts:[] ,  // Initialize posts as null
   //token: '',
    //post: {}
  },
  // getters: {
  //   // Optional: You can define getters to access the user data if needed
  //   isAuthenticated: (state) => !!state.userData,
  // },
  mutations: { 
    // Define a mutation to set the user data when received from the server
    setUserData(state, userData) {
      state.userData = userData;
      localStorage.setItem('userData', JSON.stringify(userData) )

      //state.userData.token = token
       // Save the authentication token in a cookie
      // Cookies.set('authToken', userData.token, { expires: 1 }); // Token expires in 7 days (adjust as needed)
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('userToken', token)
     },
    // clearUserData(state) {
    //   state.userData = null;
    //   // Remove the authentication token cookie
    //   Cookies.remove('authToken');
    // },
    setPosts(state, posts){
      state.posts = posts;
    },

    refreshPost(state, post){
      const posts = state.posts;
      const postToReplace = posts.find(fPost => fPost.post_id === post.post_id);
      Object.assign(postToReplace, post);
      state.posts = posts;
    },

  },  
  actions: {
    // Optional: You can define actions if you need to perform async tasks
    // setToken({ commit }, token) {
    //   commit('setToken', token);
    // },
   
  },
  modules: {
    // Optional: You can define modules for organizing your store further
  
     // auth,
      // other modules...
    
  }
})
