<template>
    <HeaderItem />
    <button class="back-button" @click="goBack">Back</button>
      <postItem v-if="post && post.user" class="post" id="post"
        :key="post.post_id"
        :postId="post.post_id" 
        :post="post"            
        :postingDate="post.posting_date"
        :textContent="post.text_content"
        :mltMediaContent="post.mlt_media_content"
        :likes="post.likes"
        :dislikes="post.dislikes"
        :comments="post.comment_id"
        :userId="post.user_id"
        :currentUser= "userData.userId"
        :isHomePage="false"
        @post-deleted="handlePostDeleted"
      />
      
      <!-- Comment input box -->
    <textarea v-model="commentText" class="comment-input" placeholder="Add a comment"></textarea>   
      <!-- Comment submit button -->
    <button @click="addComment" class="comment-button">Comment</button>
 
    <div v-if="post && post.comments" class="comments-container">
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
    
    <FooterItem />
</template>
    
<script> 
import postItem from '@/components/postItem';
import HeaderItem from "@/components/HeaderItem.vue";
import FooterItem from '@/components/FooterItem';
import axios from "../libs/axios";
import { mapState } from 'vuex';  
 
export default {
  name: 'CommentPostView',

  components :{
    postItem, HeaderItem, FooterItem
  },

  data() {
    return {
      commentText: '', 
      comments: [],
    };
  },
    
  computed: {
    ...mapState(['userData', 'posts', 'post']),
    
  },

  methods:{ 
    // Get and fetch one post data
    async fetchPost() {
      const postId = this.$route.params.id; // Use 'id' to get the post ID from route params
      try {
        const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token,
        } 
        const response = await axios.get(`posts/${postId}`, { headers: headers });
        console.log(response.data);
        this.$store.commit('setPost', response.data);
        // Send a request to update the post as read in the database
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
              
          console.log(this.userData);
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
        // Send a request to API to add the comment to the post
        const response = await axios.post(`comments/`, newComment, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.$store.state.userData.token,
          },
        });
        console.log(response.data);
        // Add the new comment to the list of comments
        this.comments.push(response.data);
        window.alert('Your comment has been sent successfully, refresh the page to see your comment')

        // Clear the comment input field
        this.commentText = '';

      }catch (error) {
        console.error('Error adding comment:', error);
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

<style scoped>
html, body{
  padding: 0;
  margin: 0;
}
.back-button {
  display: block;
  margin: 20px;
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
h2{
  background-color: inherit;
}
/* Style for the comments section container */
.comments-container {
  margin-top: 0px;
  margin-right: 10px;
  margin-left: 20px;
  padding: 10px 10px 10px 0px;
  /* border: 1px solid #e0e0e0; */
  border-radius: 5px;
  background-color: inherit;
 
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
  width: 90%;
  padding: 5px;
  margin:  30px 5px 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Style for the comment submit button */
.comment-button {
  display: block;
  margin: 10px 10px 10px 20px;
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
@media screen and (max-width: 600px) {
  #post {
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>