<template>
   <div class="container">
    <h2>Create Post</h2>
    <form @submit.prevent="publishContent">
      <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" name="content" type="text" v-model="textContent"></textarea>
      </div>
      <div class="form-group">
        <label for="media">Media (optional)</label>
        <input type="file" id="media" name="media" @change="handleFileChange">
      </div>
      <div class="form-group">
        <button type="submit">Publish</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "../libs/axios";
// import VueJwtDecode from '../../node_modules/vue-jwt-decode'


export default {
  name: 'AddpostView',

  data(){
  return {
        userFirstName: '',
        userLastName: '',
        userAvatar: '',
        postingDate: '',
        textContent: '',
        mltMediaContent: '',
        likes: 0,
        dislikes: 0,
        comments: [],
        userId: ''
    
    };
  },
  methods: {
    handleFileChange(event) {
    this.mltMediaContent = event.target.files[0];
    },
    publishContent(){
      // const postData = new FormData();
      // postData.append('userFirstName', this.userFirstName);
      // postData.append('userLastName', this.userLastName);
      // postData.append('userAvatar', this.userAvatar);
      // postData.append('postingDate', this.postingDate);
      // postData.append('textContent', this.textContent);
      // postData.append('likes', 0);
      // postData.append('dislikes', 0);
      // postData.append('comments', []);
      // postData.append('userId', this.userId);
      // // ... (append other form fields)

      // if (this.mltMediaContent) {
      //   postData.append('mltMediaContent', this.mltMediaContent);
      // }
  

      const post = {
        userFirstName: this.$store.state.userData.firstName,
        userLastName: this.$store.state.userData.lastName,
        userAvatar: '',
        postingDate: '',
        textContent: this.textContent,
         mltMediaContent: this.mltMediaContent,
        likes: 0,
        dislikes: 0,
        comments: [],
        userId: this.$store.state.userData.userId,
          
       }
       
       console.log({post})
       
    
      this.post = JSON.stringify(post);
        const headers = {          
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token
        
         };
          
    axios.post("posts/", {post: JSON.stringify(post)}, {headers: headers})
    
      .then((response) => {
        
        if (response.status === 201) {
          this.$store.commit('setPostData', response.postData);
          // Post created successfully
          this.$router.push("/");
        } else {
          // Error creating post
          console.log(response);
        }
      })
      .catch((error) => {
        // Error creating post
        console.log(error);
      });
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
  max-width: 600px;
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

.form-group textarea {
  width: 100%;
  height: 100px;
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
</style>

