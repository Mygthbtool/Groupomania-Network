<template>
  <div class="container">
    <h2>Sign up</h2>
    <form @submit.prevent="signUp">
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
        <button type="submit">Register</button>
      </div>
    </form>
    <div class="form-group">
      Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </div>
</template>

<script>
import axios from "../libs/axios";
import FormData from 'form-data'

export default {
  name: 'SignupView',

  data() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: '',
    };
  },

 methods: {

  handleFileChange(event) {
    this.avatar = event.target.files[0];
  },
  signUp() {
    const data = new FormData();
      data.append('firstName', this.firstName);
      data.append('lastName', this.lastName);
      data.append('email', this.email);
      data.append('password', this.password);
      if (this.avatar) {
        data.append('image', this.avatar, this.avatar.name);
      }
      
      console.log({data}); 
      axios
        .post("auth/signup", data, {headers: { 'Content-Type': 'multipart/form-data' }})
        .then((response) => {
          if (response.status === 200) {
            // User created successfully
            window.alert('Account created successfully')
            this.$router.push('/login');
          } else {
            // Error creating user
            console.log(response);
          }
        })
        .catch((error) => {
          // Error creating user
          console.log(error);
        });
    }
  }

}
</script>

<style>
body {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 400px;
  margin: 30px auto;
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

.form-group a {
  color: #007bff;
  text-decoration: none;
}
@media screen and (max-width: 500px) {
  .container {
    max-width: 260px;
  }
}
</style>
