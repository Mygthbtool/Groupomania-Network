<template>
   <div class="container">
    <h2>Create Post</h2>
    <form @submit.prevent="publishContent" enctype="multipart/form-data">
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
import FormData from 'form-data'


export default {
  name: 'AddpostView',

  props: {
    postId: {
      type: String,
     // required: false,
    },
  },
  data(){
  return {
        userFirstName: '',
        userLastName: '',
        userAvatar: '',
        postingDate: new Date(),
        textContent: '',
        mltMediaContent: '',
        likes: 0,
        dislikes: 0,
        comments: [],
        userId: '',
        
    };
  },
  
  methods: {
    handleFileChange(event) {
    this.mltMediaContent = event.target.files[0];
    },

    publishContent(){
      // If a postId prop is passed, then we are editing an existing post.
      // Otherwise, we are creating a new post.
      const postData = new FormData();
      postData.append('userFirstName', this.$store.state.userData.firstName);
      postData.append('userLastName', this.$store.state.userData.lastName);
      postData.append('userAvatar', this.$store.state.userData.avatar);
      postData.append('postingDate', this.postingDate);
      postData.append('textContent', this.textContent);
      postData.append('likes', 0);
      postData.append('dislikes', 0);
      postData.append('comments', []);
      // postData.append('readBy', []);
      // postData.append('usersLiked', []);
      // postData.append('usersDisliked', []);
      postData.append('userId', this.$store.state.userData.userId);
      // ... (append other form fields)

      if (this.mltMediaContent) {
        postData.append('image', this.mltMediaContent, this.mltMediaContent.name);
      }
  
       console.log({postData})
        const headers = {          
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token
        
         };
          
      axios.post('posts/', postData, {headers: headers})
    
      .then((response) => {
        
        if (response.status === 201) {
          // Post created/edited successfully
          this.$store.commit('setPosts', response.data.posts);
           //redirect client to home page
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
   
  },
  // mounted() {
  //   // If a postId prop is passed, then we are editing an existing post.
  //   // In that case, we need to fetch the post data from the server.
  //   if (this.postId) {
  //     axios.get(`posts/${this.postId}`).then((response) => {
  //       // The post data is now available in the `response.data` object
  //       // You can use this data to populate the form fields
  //       this.textContent = response.data.textContent;
  //       this.mltMediaContent = response.data.mltMediaContent;
  //     });
  //   }
  // },

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

