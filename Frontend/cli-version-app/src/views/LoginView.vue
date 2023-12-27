<template>
    <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin" ref="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required v-model="email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required v-model="password">
      </div>
      <div class="form-group">
        <button type="submit">Login</button>
      </div>
    </form>
    <div class="signup-link">
      Don't have an account? <router-link to="/signup">Sign up</router-link>
    </div>
  </div>
</template>

<script>
import axios from "../libs/axios";
import { mapMutations } from 'vuex';

export default {
  name : 'LoginView',
  
  data (){
    return {
      email: '',
      password:'',   
    };
  },
  computed:{

  },
  methods: {

    ...mapMutations(['setUserData', 'setToken']),

    handleLogin(e) {
      e.preventDefault();

    const user = {
      email: this.email,
      password: this.password
    }
    
    // Send a POST request to the login endpoint   
       axios.post("auth/login", user)         
        .then((response) => {            
          if (response.status === 200) {

             // After successful login, retrieve the user data from the response
             const userData = response.data.user;   
             console.log(userData);

             // Save user data in Vuex store           
             this.$store.commit('setUserData', userData);

             // Store the token in the Vuex store
             this.$store.commit('setToken', response.data.user.token);

             // Redirect to home page   
              this.$router.push('/');     
                              
          }else {
          // Handle login error (e.g., invalid credentials)
          console.log('Invalid credentials. Please try again.');          
          }        
        })
        //console.log(user); 
        .catch((error) => {
         // Handle any error that occurred during login
            console.error(error);
        });
    }
  }
} 

</script>

<style>
 body {
  font-family: Arial, sans-serif;
  min-height: 100vh;
}  
.container {
  margin-top: 60px;
  /* margin-bottom: auto; */
  max-width: 400px;
  margin-right: auto;
  margin-left: auto;
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

.form-group input[type="email"],
.form-group input[type="password"] {
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

.signup-link {
  text-align: center;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}
 
@media screen and (max-width: 500px) {
  .container {
    max-width: 260px;
  }

}
</style>
