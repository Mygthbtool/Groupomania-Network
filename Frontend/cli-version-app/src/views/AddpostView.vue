<template>
  <HeaderItem /> 
  <button class="back-button" @click="goBack">Back</button>
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
  <FooterItem />

</template>

<script>
import HeaderItem from "@/components/HeaderItem.vue";
import axios from "../libs/axios";
import FooterItem from '@/components/FooterItem'
import FormData from 'form-data'

export default {
  name: 'AddpostView',

  props: {
    postId: {
      type: String,
    },
  },

  data() {
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
      userId: ''
    };
  },

  components: { HeaderItem, FooterItem },

  computed: {
  },

  methods: {
    handleFileChange(event) {
      this.mltMediaContent = event.target.files[0];
    },
    publishContent() {
      // don't publish empty post
      if(!this.textContent && !this.mltMediaContent){
        return
      }
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
      postData.append('userId', this.$store.state.userData.userId);
      if (this.mltMediaContent) {
          postData.append('image', this.mltMediaContent, this.mltMediaContent.name);
      }
      console.log({ postData });
      const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token
      };
      axios.post('posts/', postData, { headers: headers })
      .then((response) => {
        if (response.status === 201) {
          // Post created/edited successfully
          this.$store.commit('setPosts', response.data.posts);
          //redirect client to home page
          this.$router.push("/");
        }
        else {
          // Error creating post
          console.log(response);
        }
      })
      .catch((error) => {
      // Error creating post
        console.log(error);
      });
    },
    goBack() {
      // Go back one step in the history
      this.$router.go(-1);
    },
  },  
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;
}
.back-button {
  display: block;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 15px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
}

.container {
  max-width: 600px;
  margin: 20px auto;
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

