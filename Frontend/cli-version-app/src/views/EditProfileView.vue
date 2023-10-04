<template>
    <div class="container">
      <h2>Edit Profile</h2>
      <form @submit.prevent="editProfile" enctype="multipart/form-data">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required v-model="firstName">
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required v-model="lastName">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required v-model="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required v-model="password">
        </div>
        <div class="form-group">
          <label for="avatar">Profile Picture</label>
          <input type="file" id="avatar" name="avatar" @change="handleFileChange">
        </div>
        <div class="form-group">
          <button type="submit">Save</button>
        </div>
      </form>
      <button class="cancel-button" @click="onCancel">Cancel</button>
      
    </div>
  </template>

<script>
import axios from "../libs/axios";
import FormData from 'form-data'


export default {
  name: 'EditProfileView',

  data() {
  return {
    firstName: this.$store.state.userData.firstName,
    lastName: this.$store.state.userData.lastName,
    email: this.$store.state.userData.email,
    password: this.$store.state.userData.password,
    avatar: this.$store.state.userData.avatar,
    userId: this.$store.state.userData.userId,
    
    };
    
  },

 methods: {

    handleFileChange(event) {
    this.avatar = event.target.files[0];
    },
    
    editProfile() {
      if (confirm("Are you sure you want to edit your profile?")) {
        
        const formData = new FormData();
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('email', this.email);
        formData.append('password', this.password);
        if(this.avatar) {
          formData.append('image', this.avatar);
        }
      
        console.log({formData}); 
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        } 
        //const userId= this.userId
        axios
          .put(`auth/${this.userId}`, formData, {headers: headers})
          .then((response) => {
            
            if (response.status === 201) {
              // User updated successfully
              this.$router.push("/");
            } else {
              // Error updating user
              console.log(response);
            }
          })
          .catch((error) => {
            // Error creating user
            console.log(error);
          });
      }
    },
    onCancel(){
      this.$router.push('/')
    }
 }
 
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-group a {
  color: #007bff;
  text-decoration: none;
}
</style>
