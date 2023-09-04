
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
        <postItem v-for="post in posts" 
        :key="post.id"
        :userFirstName='post.userFirstName'
        :userLastName='post.userLastName'
        :userAvatar="post.userAvatar"
        :postingDate="post.postingDate"
        :textContent="post.textContent"
        
        :likes="post.likes"
        :dislikes="post.dislikes"
        :comments="post.comments"
        
        />
        
      </section>

      <section id="user-profile">
        <h2>My Profile</h2>
        <user-item 
        :first-name="userData.firstName" 
        :last-name="userData.lastName" 
        :email="userData.email" 
        :avatar="userData.avatar"
        />

        <div class="user-actions">
          <button class="edit-profile-button">Edit Profile</button>
          <button class="delete-account-button">Delete Account</button>
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

export default {
  name: 'HomeView',
  components :{
    postItem, UserItem
  },
  data() {
    console.log(this.$store.state);   
    return {
      posts: [
          {
          userFirstName: '',
          userLastName: '',
          userAvatar: '',
          postingDate: '',
          textContent: '',
          mltMediaContent: '',
          likes: 0,
          dislikes: 0,
          comments: [],
          userId:''
          
        },
        // Add more posts...
      ],
      // user: null // Initialize user data to null
      // user: {
      //   firstName: '',
      //   lastName: '',
      //   avatar: '',
      //   email: ''
      // },
    };
    
  },

 
  computed: {
    ...mapState(['userData']), // Map the userData from the Vuex store
    ...mapState(['posts'])
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

