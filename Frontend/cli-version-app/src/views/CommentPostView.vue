<template>
    <HeaderItem />
    <button class="back-button" @click="goBack">Back</button>
    <div>

      <postItem v-if="post && post.user" class="post"
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
          @post-deleted="handlePostDeleted"
       />
      
    </div>    
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
      <!-- Comment input box -->
    <textarea v-model="commentText" class="comment-input" placeholder="Add a comment"></textarea>
      
      <!-- Comment submit button -->
    <button @click="addComment" class="comment-button">Comment</button>
    
    <FooterItem />
</template>
    
<script> 
import postItem from '@/components/postItem';
import HeaderItem from "@/components/HeaderItem.vue";
import FooterItem from '@/components/FooterItem'

import axios from "../libs/axios";
import { mapState } from 'vuex';  
//import { mapMutations } from 'vuex';
 //import { mapActions } from 'vuex';
 
  export default {
    name: 'CommentPostView',

    components :{
      postItem, HeaderItem, FooterItem
    },

    data() {
      return {
        commentText: '', // Add this if not already defined
        post: {}, // Initialize 'post' to null
        comments: [],
        userData: this.$store.state.userData
    //   updatedPost: Object.assign({}, this.post),    
      };
    },
    
  computed: {
    ...mapState(['userData', 'posts']),
    
    isCurrentUserOwner() {
      // Check if the current user's ID matches the post owner's ID
      return this.currentUser === this.post.user_id;  
        
    },

  },

methods:{ 
  ...mapState(['userData', 'posts']),
  //...mapMutations(['refreshPost']),

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
              
         console.log(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }    
    },

    // handlePostDeleted(deletedPostId) {
    //   // Remove the deleted post from the posts array
    //   this.posts = this.posts.filter((post) => post.postId !== deletedPostId);   
    // },

    // onDelete() {
    //   if (confirm("Are you sure you want to delete this post?")) {
     
    //     // Pass the post ID as a parameter in the request.
    //     const postId = this.postId;// Make sure to add a postId prop to your component.      
    //     // Send the delete request to your API
    //     axios
    //       .delete(`posts/${postId}`, {headers: {Authorization: 'Bearer ' + this.$store.state.userData.token}})
    //       .then(() => {
    //         // Handle success, maybe show a success message
    //         console.log('Post deleted successfully');
    //         // You can also emit an event to notify a parent component to remove this post from the list.
    //         this.$emit('post-deleted', postId);
    //           // Use Vue Router to refresh the current route (reload the home page)
    //         this.$router.go();
            
    //       })
    //       .catch((error) => {
    //         // Handle error, show an error message
    //         console.error('Error deleting post', error);
    //       });
    //   }
    // },

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
  // onLike() {
  //   // Implement your like functionality here
  //   this.toggleLikeDislike(1); // 1 represents "like"
  // },
  // onDislike() {
  //   // Implement your dislike functionality here
  //   this.toggleLikeDislike(-1); // -1 represents "dislike"
  // },

  // async toggleLikeDislike(likeStatus) {
  //     // send request to the server according to likeStatus
  //   try {
  //     const postId = this.$route.params.id;
  //     const response = await axios.post(
  //       `posts/${postId}/like`,
  //       { userId: this.$store.state.userData.userId, like: likeStatus },
  //       {headers: { "Content-Type": "application/json",
  //                   "Authorization": "Bearer " + this.$store.state.userData.token }});

  //         // console.log(response.data);              
  //       this.$store.commit('refreshPost', response.data.updatedPost); // Store posts in Vuex
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error liking/disliking post:", error);
  //   }
  // },

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
html, body{
  padding: 0;
  margin: 0;
}

.back-button {
  display: block;
   /* margin-top: 10px; */
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
/* .post-actions i {   
      cursor: pointer;
      margin-top: 20px;
      font-size: larger;
      &.fa-thumbs-down {
        margin-left: 15px;
      }
    } */
    h2{
      background-color: inherit;
    }
    /* .post{
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin: 10px;
     
    } */
/* Style for the comments section container */
.comments-container {
  margin-top: 20px;
  margin-right: 10px;
  padding: 10px;
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
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Style for the comment submit button */
.comment-button {
  display: block;
  margin: 10px;
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