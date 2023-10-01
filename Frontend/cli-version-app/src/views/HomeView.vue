
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
      <section id="post-list">
        <h2>Latest Posts</h2>
        <!-- Check if the user is authenticated before rendering the posts -->
        <div v-if="isAuthenticated">
          <postItem v-for="post in posts" 
          :key="post.id"
          :postId="post._id" 
          :post="post"
          :userFirstName='post.userFirstName'
          :userLastName='post.userLastName'
          :userAvatar="post.userAvatar"
          :postingDate="post.postingDate"
          :textContent="post.textContent"
          :mltMediaContent="post.mltMediaContent"
          :likes="post.likes"
          :dislikes="post.dislikes"
          :comments="post.comments"
          :userId="post.userId"
          :currentUser= "userData.userId"
          @post-deleted="handlePostDeleted"
          
          />
        </div>
        <!-- If not authenticated, show a message or redirect to login -->
        <div v-else>
          <p>Please log in to view posts.</p>
          <router-link to="/login">Login</router-link>
        </div>  
        
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
          <!-- <button class="add-post-button">Add post</button> -->
          <router-link to="/addpost">Add Post</router-link>
        </div>
      </section>
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
//import { mapGetters } from 'vuex';
import axios from "../libs/axios";
//import Cookies from 'js-cookie';

export default {
  name: 'HomeView',
  components :{
    postItem, UserItem
  },
  
  // data() {
  //   return {
  //     posts: [], // Your array of posts
  //   };
  // },
  
  // user: null // Initialize user data to null
  // user: {
  //   firstName: '',
  //   lastName: '',
  //   avatar: '',
  //   email: ''
  // },
// };
  methods: {
    async fetchPosts() {
      try {
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        } 
        const response = await axios.get('posts/', { headers: headers });
        this.$store.commit('setPosts', response.data); // Store posts in Vuex
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
}, 
  computed: {
    ...mapState(['userData', 'posts']),
     // Map the userData and posts from the Vuex store
    isAuthenticated() {
      return !!this.$store.state.userData.token;
    },
  },
  mounted() {
    // Check if the user is authenticated
    if (this.isAuthenticated) {
    // Fetch user-specific data (e.g., posts) from the server
    this.fetchPosts();
    }  
  },
  // data() {
  //   return {
  //     isAuthenticated: false, // Track user authentication status
  //   };
 
  
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

