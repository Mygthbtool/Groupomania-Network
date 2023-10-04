<!-- CommentPost.vue -->
<template>
    <div>
      <postItem/>
        <button class="comment-button" @click="isCommenting">Comment</button>
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
            {{ post.comments }}
          </div>
        </div>
      
    </div>
  </template>
  
 <script> 
 import postItem from '@/components/postItem'
 import axios from "../libs/axios";

  export default {
    name: 'HomeView',
    components :{
     postItem
    },
    data() {
        // return {
        // userFirstName: this.$store.state.userData.firstName,
        // userlastName: this.$store.state.userData.lastName,
        // userAvatar: this.$store.state.userData.avatar,
        // }
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
  const postId = this.$route.params.post.id;
  // Make an API request to fetch the post data based on postId
  axios.get(`posts/${this.postId}`, postId, this.$store.state.userData.token)
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