<template>
    <div class="user-actions">
        <router-link to="/editprofile">Edit Profile</router-link>
        <button class="delete-account-button" @click="onDeleteAccount">Delete Account</button>
        <router-link to="/addpost">Add Post</router-link>
        <button @click="scrollToTop">Go to top</button>
        <button @click="onLogOut">Log out</button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapMutations } from 'vuex';
import axios from "../libs/axios";
export default {
  name: 'UserActions',

 computed: {
    ...mapState(['posts', 'userData']),
 },

  methods: {
    ...mapMutations(['clearUserData']),

    onDeleteAccount() {
      if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
        // Send a DELETE request to your API to delete the user account
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        }
        axios.delete(`auth/${this.userData.userId}`, {headers: headers})     
          .then(() => {
            // Handle success by showing a success message
            console.log('Account deleted successfully');
            // Redirect the user to the login page or perform any other desired action
            this.$router.push('/login');
          })
          .catch((error) => {
            // Handle error by show an error message
            console.error('Error deleting account', error);
          });
      }
    },  

    scrollToTop() {
      const element = document.getElementById('top');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },

    onLogOut(){
      this.clearUserData();
      this.$router.push('/');
    }   
  } 
}
</script>

<style lang="scss">
  .user-actions {
    display: flex;
    align-items: flex-end;
  }
  .user-actions button, .user-actions a {
    background-color: #333;
    color: #fff;
    border: none;
    font-size: 13px;
    text-decoration: none;
    border-radius: 20px;
    padding: 5px 10px;
    margin-right: 10px;
    cursor: pointer;
    &:hover{
      background-color: #fff;
      color: #333;
      border: solid 1px #333;
    }
  }

@media screen and (max-width: 500px) {
  
  #app  .user-actions {
    align-items: flex-start;
    flex-direction: column;
    font-size: smaller;
      button, a {
        display: block;
        flex-direction: column;
        margin-top: 10px;
      }
  }
}
</style>