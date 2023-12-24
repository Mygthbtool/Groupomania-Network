
<template>
    <div id="header">
      <img src="/images/icon-left-font-monochrome-white.png">
      <div class="nav-container">
        <div v-if="isAuthenticated" class="user-details" :class="{ show: isNavOpen }">
          <UserItem 
            :firstName="this.$store.state.userData.firstName" 
            :lastName="this.$store.state.userData.lastName" 
            :email="this.$store.state.userData.email" 
            :avatar="this.$store.state.userData.avatar"
            :userId="this.$store.state.userData.userId"
          />
        </div>  
        <div v-if="isAuthenticated" class="nav-links" :class="{ show: isNavOpen }">
          <router-link to="/">Home</router-link>
          <router-link to="/addpost">Add post</router-link>
          <router-link to="/editprofile">Edit Profile</router-link>
          <router-link @click="onLogOut" to="/">Log out</router-link>

        </div>
        <div v-else class="nav-links" :class="{ show: isNavOpen }">
          <router-link to="/login">Log in</router-link>
          <router-link to="/signup">Sign up</router-link>
        </div>
      </div>
      <div class="toggle-icon" @click="toggleNav">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';
  import UserItem from '@/components/UserItem'

  export default {
    name: 'HeaderItem',
    components: {
      UserItem
    },

    data() {
      return {
        isNavOpen: false,
      };
    },
  
    computed: {
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
    },
  
    methods: {
      ...mapMutations(['clearUserData']),
  
      onLogOut() {
        this.clearUserData();
        this.$router.push('/');
      },
  
      toggleNav() {
        this.isNavOpen = !this.isNavOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  #header {
    
    background-color: #333;
    color: #fff;
    padding-left: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center; /* Center items vertically */
  }
  
  #header img {
    width: auto;
    height: 180px;
  }
  
  .nav-container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  #header .nav-container .user-details {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    font-size: smaller;
    align-items: flex-end;
    margin-left: auto;
    margin-right: 15px;


  }
  #header .nav-container .user-details img{
      display: inline-block;
      width: 40px;
      height: 40px;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    margin-right: 10px;
    padding-top: 20px;
    /* align-items: center; */
  }
  
  .nav-links a {
    color: #fff;
    font-size: 14px;
    padding: 5px;
    text-decoration: none;
  }
  .nav-links a:hover{
    text-decoration: underline;

  }
  
  .toggle-icon {
    display: none; /* Initially hide the toggle icon */
    cursor: pointer;
  }
  .bar {
  width: 25px;
  height: 3px;
  background-color: #fff;
  margin: 5px 0;
}
  
  /* Media query for smaller screens */
  @media only screen and (max-width: 500px) {
    #header{
        flex-flow: column-wrap;
    }
    #header img {
    width: auto;
    height: 140px;
  }
    #header .nav-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    
    }
    #header .nav-container .user-details {
      display: inline-block;
      flex-direction: column; /* Stack links vertically */
      position: absolute;
      font-size: 12px;
      top: 10px; /* Adjust the top position as needed */
      right: 10px;
      background-color: #333;
      /* align-items: end; */

    }
   

    .nav-links {
      display: none; /* Hide the nav links */
      flex-direction: column; /* Stack links vertically */
      position: absolute;
      top: 60px; /* Adjust the top position as needed */
      right: 0;
      background-color: #333;
      /* width: 100%; */
      padding: 10px 0 10px 10px;
    }
  
    .nav-links.show {
      display: flex; /* Show links when .show class is added */
      flex-direction: column;
      font-size: 13px;
      padding: 3px;
      z-index: +1;
    }
  
    .toggle-icon {
      display: inline; /* Show the toggle icon */
      margin-right: 28%;
      margin-top: auto;
      margin-bottom: 15px;
    }
  }
  </style>
  