
import { createStore } from 'vuex'

export default createStore({
  
  state: {
    userData: JSON.parse(localStorage.getItem('userData')) || {},
    posts:[] ,  
    post: {},
    token: ''
  },

  getters: {
    isAuthenticated: (state) => {
      const token = state.token || localStorage.getItem('userToken');
      return !!token;
    },
  },
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
      if(postToReplace){
        Object.assign(postToReplace, post);     
        state.posts = posts;
      }
    },

    setPost(state, post){
      console.log(post);
      Object.assign(state.post, post);      
    }

  },  
  actions: {
    
  },
  modules: {
    
  }
})
