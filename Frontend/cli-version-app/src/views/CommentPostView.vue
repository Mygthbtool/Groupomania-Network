<template>
    <button @click="goBack">Back</button>
    <div>
        <div v-if="post" id="post" class="post">
            <div class="post-header">
                <img v-if="post && post.user" :src="post.user.avatar" />
                <div v-if="post && post.user" class="post-info">
                    <h3>{{ post.user.first_name }} {{ post.user.last_name }}</h3>
                    <span class="post-date">{{ post.posting_date }}</span>
                </div>
            </div>
            <div class="post-content">
            <p>{{ post.text_content }}</p>
            
            <img v-if="post.mlt_media_content" :src="post.mlt_media_content" alt='multiMediaContent'/>

            </div>
            <div class="post-actions">
                <button class="like-button" @click="onLike">like</button> {{ post.likes }}
                <button class="dislike-button" @click="onDislike">Dislike</button> {{ post.dislikes }}
            </div>
        </div>
    </div>    
    <div class="comments-container">
      <h2>Comments</h2>
      <div v-if="post.comments">   
        <div v-for="comment in post.comments" :key="comment.comment_id" class="comment">   
          <div v-if="comment.user" class="comment-user">
            {{ comment.user.first_name }} {{ comment.user.last_name }}
          </div>  
          <div class="comment-text">{{ comment.text }}</div>
        </div>
      </div>  
    </div>
      <!-- Comment input box -->
    <textarea v-model="commentText" class="comment-input" placeholder="Add a comment"></textarea>
      
      <!-- Comment submit button -->
    <button @click="addComment" class="comment-button">Comment</button>
    
   
</template>
    
<script> 
 import axios from "../libs/axios";
 import { mapState } from 'vuex';
//  import { mapMutations } from 'vuex';

  export default {
    name: 'CommentPostView',
    components :{
   
    },
    data() {
      return {
        commentText: '', // Add this if not already defined
        post: {}, // Initialize 'post' to null
        comments: [],
    //   updatedPost: Object.assign({}, this.post),    
      };
    },
    
  computed: {
    ...mapState(['userData', 'posts']),
  // ...mapMutations(['refreshOnePost'])
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
        this.comments = this.post.comments;

          // Send a request to update the 'readBy' array in the database
          try {
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.$store.state.userData.token,
            };
            const userId = this.$store.state.userData.userId;

             await axios.post(`posts/${postId}/markAsRead`, { userId }, { headers: headers });

          } catch (error) {
            console.error('Error marking post as read on the server:', error);
          }
        
      
         //console.log(response.data);
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
      console.log(response.data);
      // Add the new comment to the list of comments
      this.comments.push(response.data);

      // Clear the comment input field
      this.commentText = '';

    }catch (error) {
      console.error('Error adding comment:', error);
    }
  },
  onLike() {
      // Implement your like functionality here
      this.toggleLikeDislike(1); // 1 represents "like"
    },
    onDislike() {
      // Implement your dislike functionality here
      this.toggleLikeDislike(-1); // -1 represents "dislike"
    },

    async toggleLikeDislike(likeStatus) {
        // send request to the server according to likeStatus
      try {
        // const userId = this.$store.state.userData.userId
        const postId = this.$route.params.id;
        const response = await axios.post(
          `posts/${postId}/like`,
          { userId: this.$store.state.userData.userId, like: likeStatus },
          {headers: { "Content-Type": "application/json",
                      "Authorization": "Bearer " + this.$store.state.userData.token }});

            // console.log(response.data);          
      
         this.$store.commit('refreshPost', response.data.updatedPost); // Store posts in Vuex
       console.log(response.data);
      } catch (error) {
        console.error("Error liking/disliking post:", error);
      }
    },

  goBack() {
      // Go back one step in the history
      this.$router.go(-1);
    },
},

mounted() {
    this.fetchPost()     
}

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