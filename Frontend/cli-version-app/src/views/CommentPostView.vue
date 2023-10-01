<!-- CommentPost.vue -->
<template>
    <div>
      <div class="post-header">
        <img :src="userAvatar" />
        <div class="post-info">
          <h3>{{ userFirstName }} {{ userLastName }}</h3>
          <span class="post-date">{{ postingDate }}</span>
        </div>
      </div>
      <div class="post-content">
        <p>{{ textContent }}</p>
        <img v-if="mltMediaContent" :src="mltMediaContent" alt="multiMediaContent" />
      </div>
      <div class="post-actions">
        <button class="like-button" @click="onLike">Like {{ likes }} </button>
        <button class="dislike-button" @click="onDislike">Dislike {{ dislikes }}</button>
        <button class="comment-button" @click="isCommenting">Comment {{ comments }}</button>
        <button class="delete-post-button" @click="onDelete" v-if="isCurrentUserOwner">Delete</button>
        <button class="edit-post-button" @click="onEdit" v-if="isCurrentUserOwner">Edit</button>
        <!-- Display comment section -->
        <div v-if="isCommenting">
          <h2>Comments</h2>
          <!-- Add a form for adding comments -->
          <form @submit.prevent="addComment">
            <input type="text" v-model="commentText" placeholder="Add your comment" />
            <button type="submit">Comment</button>
          </form>
          <!-- Display existing comments -->
          <div v-for="comment in post.comments" :key="comment.id">
            {{ comment.text }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
 <script> 
//  import postItem from '@/components/postItem'
 import axios from "../libs/axios";

  export default {
    name: 'HomeView',
    components :{
     // postItem
    },
    props :{
      userFirstName:{
        type: String
      },
      userLastName: {
        type: String
      },
      userAvatar: {
        type: String,
        default: '/images/User-avatar.png', // Set a default value for the avatar prop if needed
      
      },
      postingDate: {
        type: String
      },
      textContent: {
        type: String
      },
      mltMediaContent:{
        type: String
      },
      likes: {
        type: Number
      },
      dislikes: {
        type: Number
      },
      comments: {
        type: Array
      },
      userId:{
        type: String
      },
      currentUser: {
        type: String
      },
      postId:{
        type: String,     
      }
      
   }, 
  
   computed: {

    isCurrentUserOwner() {
      // Check if the current user's ID matches the post owner's ID
      return this.currentUser === this.userId;
    },
},
methods:{ 
  // CommentPost.vue
mounted() {
  const postId = this.$route.params.postId;
  // Make an API request to fetch the post data based on postId
  axios.get(`posts/${postId}`, postId, this.$store.state.userData.token)
    .then((response) => {
      this.post = response.data;
    })
    .catch((error) => {
      console.error('Error fetching post:', error);
    });
},
}  

}
</script>


<style>

</style>