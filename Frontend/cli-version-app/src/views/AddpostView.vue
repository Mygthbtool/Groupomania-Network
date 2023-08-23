<template>
   <div class="container">
    <h2>Create Post</h2>
    <form @submit.prevent="publishContent">
      <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" name="content" required></textarea>
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

export default {
  name: 'AddpostView',

  data(){
  return {
        userFirstName: '',
        userLastName: '',
        userAvatar: '',
        postingDate: '',
        textContent: '',
        mltMediaContent: null,
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
      const formData = new FormData();
      formData.append('userFirstName', this.userFirstName);
      formData.append('userLastName', this.userLastName);
      formData.append('userAvatar', this.userAvatar);
      formData.append('postingDate', this.postingDate);
      formData.append('textContent', this.textContent);
      formData.append('likes', this.likes);
      formData.append('dislikes', this.dislikes);
      formData.append('comments', this.comments);
      formData.append('userId', this.userId);
      // ... (append other form fields)

      if (this.mltMediaContent) {
        formData.append('mltMediaContent', this.mltMediaContent);
      }

      // const data = {
      //   userFirstName: this.userFirstName,
      //   userLastName: this.userLastName,
      //   userAvatar: this.userAvatar,
      //   postingDate: this.postingDate,
      //   textContent: this.textContent,
      //   mltMediaContent: this.mltMediaContent,
      //   likes: 0,
      //   dislikes: 0,
      //   comments: [],
      //   userId: this.userId

      // }
       console.log({formData})
    
    axios.post("posts/", formData)
      .then((response) => {
        if (response.status === 201) {
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

