
<template>
  <div id="app" class="app">
    <header>
      <h1>Groupomania Social Network</h1>
      <img src="/images/icon.png">
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Add post</a></li>
          <li><a href="#">Log in</a></li>
          <li><a href="#">Sign up</a></li>
        </ul>
      </nav>
    </header>

    <main>
        
        <!-- Check if the user is authenticated before rendering the posts -->
        <div v-if="isAuthenticated">
          <h2>Latest Posts</h2>
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
          <section id="user-profile">
            <h2>My Profile</h2>
            <userItem 
              :firstName="userData.firstName" 
              :lastName="userData.lastName" 
              :email="userData.email" 
              :avatar="userData.avatar"
              :userId="userData.userId"
            />

            <div class="user-actions">
              <router-link to="/editprofile">Edit Profile</router-link>
              <button class="delete-account-button" @click="onDeleteAccount">Delete Account</button>
              <router-link to="/addpost">Add Post</router-link>
              <button @click="goBack">Back</button>
              <button @click="onLogOut">Log out</button>
            </div>
          </section>
        </div>
        <!-- If not authenticated, show a message or redirect to login -->
        <div v-else>
          <p>Please log in to view posts.</p>
          <router-link to="/login"><button>Login</button></router-link>
        </div>  
             
    </main>

    <footer>
      <p>&copy; 2023 Groupomania. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import postItem from '@/components/postItem'
import UserItem from '@/components/UserItem'
import { mapState } from 'vuex';
// import { mapGetters } from 'vuex';
 import { mapMutations } from 'vuex';
//  import { mapActions } from 'vuex';

import axios from "../libs/axios";
//import Cookies from 'js-cookie';

export default {
  name: 'HomeView',
  components :{
    postItem, UserItem
  },

  methods: {

    ...mapMutations(['clearUserData']),

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
      this.posts = this.posts.filter((post) => post.id !== deletedPostId);    
    },
    onDeleteAccount() {
      if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
        // Send a DELETE request to your API to delete the user account
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        }
        axios.delete(`auth/${this.userData.userId}`, {headers: headers})     
          .then(() => {
            // Handle success, maybe show a success message
            console.log('Account deleted successfully');
            // Redirect the user to the login page or perform any other desired action
            this.$router.push('/login');
          })
          .catch((error) => {
            // Handle error, show an error message
            console.error('Error deleting account', error);
          });
      }
    },
    goBack() {
      // Go back one step in the history
      this.$router.go(-1);
    },
    onLogOut(){
      this.clearUserData();
      this.$router.push('/login');

    }   
  }, 
  
  computed: {
    // Map the userData and posts from the Vuex store
    ...mapState(['posts', 'userData']),
    // ...mapMutations(['']),
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
#app {
    /* Reset some default styles */
  body, h1, h2, h3, p, ul, li {
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333;
    }
    
    header {
      background-color: #333;
      color: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
    }
    
    header h1 {
      font-size: 24px;
    }
    header img {
      max-width: 100px;
      
    }
    nav ul {
      list-style: none;
    }
    
    nav ul li {
      display: inline-block;
      margin-right: 10px;
    }
    
    nav ul li a {
      color: #fff;
      text-decoration: none;
    }
    
    main {
      padding: 20px;
    }
    
    h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    .post {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
    }
    
    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .post-header img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .post-info h3 {
      font-size: 16px;
    }
    
    .post-date {
      font-size: 12px;
      color: #888;
    }
    
    .post-content img {
      max-width: 100%;
      margin-top: 10px;
    }
    
    .post-actions button {
      background-color: #333;
      color: #fff;
      border: none;
      padding: 5px 10px;
      margin-right: 10px;
      cursor: pointer;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .user-info img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .user-details h3 {
      font-size: 18px;
      margin-bottom: 5px;
    }
    
    .user-actions button {
      background-color: #333;
      color: #fff;
      border: none;
      padding: 5px 10px;
      margin-right: 10px;
      cursor: pointer;
    }
    
    footer {
      background-color: #333;
      color: #fff;
      padding: 20px;
      text-align: center;
    }        
  }
</style>

