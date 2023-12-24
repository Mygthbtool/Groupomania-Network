
<template>
  <div id="app" class="app">
    <HeaderItem />   
    <main>     
        <!-- Check if the user is authenticated before rendering the posts -->
        <div v-if="isAuthenticated" class="flex-container">
          <a id="top"></a>
          <div id="top-page">
            <h2>Latest Posts</h2>
            <button @click="scrollToBottom" class="scrollToBottom">Go to Bottom</button>
          </div>  
          <section id="post-list">
            <postItem v-for="post in posts"
              
              :key="post.post_id"
              :postId="post.post_id" 
              :post="post"            
              :postingDate="post.posting_date"
              :textContent="post.text_content"
              :mltMediaContent="post.mlt_media_content"
              :likes="post.likes"
              :dislikes="post.dislikes"
              :comments="post.comment_id"
              :userId="post.user_id"
              :currentUser= "userData.userId"
              @post-deleted="handlePostDeleted"
          
            />
          </section>  
          <section class="user-section">
            <div class="user-profile">
              <h2>My Profile</h2>
              <userItem 
                :firstName="userData.firstName" 
                :lastName="userData.lastName" 
                :email="userData.email" 
                :avatar="userData.avatar"
                :userId="userData.userId"
              />
            </div>    
            <UserActions id="user-actions"/>
            <a id="bottom"></a>
          </section>
        </div>
        <!-- If not authenticated, show a message or redirect to login -->
        <div v-else class="flex-container login-container">
          <div class="login-content">
            <p>Please log in to view posts.</p>
            <router-link class="login-btn" to="/login">Login</router-link>
          </div>  
        </div>  
             
    </main>
    <FooterItem />
    
  </div>
</template>

<script>
import HeaderItem from'@/components/HeaderItem'
import postItem from '@/components/postItem'
import UserItem from '@/components/UserItem'
import UserActions from '@/components/UserActions'
import FooterItem from '@/components/FooterItem'

import { mapState } from 'vuex';
import axios from "../libs/axios";

export default {
  name: 'HomeView',
  components :{
    postItem, UserItem, HeaderItem, FooterItem, UserActions
  },

  methods: {

    async fetchPosts() {
      try {       
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        } 
        const response = await axios.get('posts/', { headers: headers });
        this.$store.commit('setPosts', response.data); // Store posts in Vuex

        console.log(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },

    handlePostDeleted(deletedPostId) {
      // Remove the deleted post from the posts array
      this.posts = this.posts.filter((post) => post.postId !== deletedPostId);    
    },
    scrollToBottom() {
    const element = document.getElementById('bottom');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  },
   
  }, 
  
  computed: {
    // Map the userData and posts from the Vuex store
    ...mapState(['posts', 'userData']),
    // ...mapGetters(['isAuthenticated']),
    isAuthenticated() {
      const token = this.$store.state.token;
      if(token) {
        return true;
      }  

      const savedToken = localStorage.getItem('userToken');
      if(savedToken) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      this.$store.commit('setUserData', userData);
        return true
      }
      return false
    },

    posts() {
    return this.$store.state.posts; // state has a 'posts' array
    }
  },

  mounted() {
    // Check if the user is authenticated
   if (this.isAuthenticated) {
    // Fetch posts from the server
    this.fetchPosts();
   }
     
  },
}
</script>

<style lang="scss">
// html, body{
//   padding: 0;
//   margin: 0;

 body {
    /* Reset some default styles */
  margin: 0;
  padding: 0;
  //  width: 100%;
  // height: 100%;
  font-family: Arial, sans-serif;
// background-color: #f2f2f2;
  background-image: linear-gradient(
    to bottom,
    rgb(185, 185, 174),
    rgba(210, 54, 54, 0.791)), url('../../src/assets/icon.png');
      color: #333;
  
}     


    a.login-btn {
      // display: block;
      // width: 8%;
      // font-size: 2vw;
      position: absolute;
      top: 15%;
      text-decoration: none;
      margin-right: auto;
      padding: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    
    }
  

    #top-page {
      display: flex;
      justify-content: space-between;
      align-items: center;
      button.scrollToBottom {
        background-color: #007bff;
        color: #fff;
        font-size: 12px;
        padding: 5px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        &:hover {
            background-color: #0056b3;
        }

    }  
  }   

    main {
     display: flex;
     flex-direction: column;
    //  align-items: center;
     min-height: 100vh;
      padding: 20px;
      // padding-bottom: auto;
      // padding-bottom: 200px;
     // margin: 0;
     position: relative,
     
    
    }
    .flex-container {
       flex-grow: 1; /* Allow main to grow and take up available space */
    }
    .user-section {
      display: flex;
      justify-content: space-between;
     
    }
    
    .user-profile h2{
      margin-top: 10px;
      margin-bottom: 5px;
    }

   
 
@media screen and (max-width: 500px) {
  #app {
  .user-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: smaller;
  }
   p{
    font-size: smaller;
    margin-top: 5px;
  }
  h2 {
    font-size: 1em;
  }
  #top-page {
   & button.scrollToBottom {
      font-size: 11px;
      padding: 3px;
    }  
  }
  a.login-btn {
    font-size: smaller;
  }
}   
}
</style>