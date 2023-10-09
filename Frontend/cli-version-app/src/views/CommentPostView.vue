<template>
    <div>
        <div v-if="post" id="post" class="post">
            <div class="post-header">
                <!-- <img :src="post.userId.avatar" /> -->               
                <img v-if="post && post.userId" :src="post.userId.avatar" />
                <div v-if="post && post.userId" class="post-info">
                    <h3>{{ post.userId.firstName }} {{ post.userId.lastName }}</h3>
                    <span class="post-date">{{ post.postingDate }}</span>
                </div>
            </div>
            <div class="post-content">
            <p>{{ post.textContent }}</p>
            
            <img v-if="post.mltMediaContent" :src="post.mltMediaContent" alt='multiMediaContent'/>

            </div>
            <div class="post-actions">
                <button class="like-button" @click="onLike">Like {{ likes }} </button>
                <button class="dislike-button" @click="onDislike">Dislike {{ dislikes }}</button>
            </div>
        </div>
    </div>    
    <!-- <h2>Add a Comment</h2>
    <input type="text" v-model="commentText" />
    <button @click="addComment">Comment</button>
     -->

    <!-- <h2>Comments</h2>
    <ul>
        <li v-for="comment in comments" :key="comment.id">
        {{ comment.text }}
        </li>
    </ul> -->
    <div class="comments-container">
      <h2>Comments</h2>
      
      <!-- Individual comments -->
      <div v-for="comment in comments" :key="comment.id" class="comment">
        
        <div v-if="comment.userId" class="comment-user">
          {{ comment.userId.firstName }} {{ comment.userId.lastName }}
        </div>
        <div class="comment-text">{{ comment.text }}</div>
      </div>
      
      <!-- Comment input box -->
      <textarea v-model="commentText" class="comment-input" placeholder="Add a comment"></textarea>
      
      <!-- Comment submit button -->
      <button @click="addComment" class="comment-button">Comment</button>
    </div>
   
  </template>
    
 <script> 
 import axios from "../libs/axios";

  export default {
    name: 'CommentPostView',
    components :{
   
    },
    data() {
        return {
            commentText: '', // Add this if not already defined
            post: {}, // Initialize 'post' to null
            comments: [], // List of comments
            comment: {},
            firstName: '',
            lastName: ''           
        };
    },
    

computed: {

 
},
methods:{ 
    async fetchPost() {
        const postId = this.$route.params.id; // Use 'id' to get the post ID from route params
      try {
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        } 
        const response = await axios.get(`posts/${postId}`, { headers: headers });
        this.post = response.data;
        // Now that you have the post data, you can fetch the associated user data
        // Use the 'userId' from the post data to fetch the user
        // if (this.post.userId) {
        //   const userResponse = await axios.get(`users/${this.post.userId}`,
        //     { headers: headers }
        //   );
        //   this.post.userId = userResponse.data; // Update the user data in the post object
        // }
      } catch (error) {
        console.error("Error fetching post:", error);
      }    
    },
    
  async addComment() {
    if (!this.commentText) {
      // Don't add an empty comment
      return;
    }

    try {
      // Create a new comment object
      const newComment = {
        userId: this.$store.state.userData.userId, // Assuming you store user ID in Vuex
        text: this.commentText,
       postId: this.$route.params.id

      };
      // Send a request to you API to add the comment to the post
      const response = await axios.post(`comments/`, newComment, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        },
      });

      // Add the new comment to the list of comments
      this.comments.push(response.data);

      // Clear the comment input field
      this.commentText = '';

    }catch (error) {
      console.error('Error adding comment:', error);
    }
  },
},

mounted() {
    this.fetchPost()
    
}

// CommentPost.vue



}
</script>


<style>
/* Style for the comments section container */
.comments-container {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
}

/* Style for individual comments */
.comment {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.comment-user {
  font-weight: bold;
}

.comment-text {
  margin-top: 5px;
}

/* Style for the comment input box */
.comment-input {
  width: 100%;
  padding: 5px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Style for the comment submit button */
.comment-button {
  display: block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.comment-button:hover {
  background-color: #0056b3;
}


</style>