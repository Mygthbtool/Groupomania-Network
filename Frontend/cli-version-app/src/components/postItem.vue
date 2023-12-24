<template>
  <div v-if="post" id="post" class="post">
      <div @click="getPost">
        <div class="post-header">
          <img :src="post.user.avatar" />
          <div class="post-info">
            <h3>{{ post.user.first_name }} {{ post.user.last_name }}</h3>
            <span class="post-date">{{ postingDate }}</span>
          </div>
        </div>
        <div class="post-content">
          <p>{{ textContent }}</p>
          
          <img v-if="mltMediaContent" :src="mltMediaContent" alt='multiMediaContent'/>

        </div>
      </div>  
      <div class="post-actions">
        <i @click="onLike" class="fa fa-thumbs-up"></i><span class="likes-count">{{ likes }}</span>
        <i @click="onDislike" class="fa fa-thumbs-down"></i><span class="dislikes-count">{{ dislikes }}</span>
        <button class="comnt-btn" @click="onComment" v-if="isHomePage">add/see Comment(s)</button>
        <button class="mark-read-button" @click="markAsRead" v-if="!isCurrentUserOwner && isNewPost">Mark as read</button>
        <button class="delete-post-button" @click="onDelete" v-if="isCurrentUserOwner">Delete</button>
        <button class="edit-post-button" @click="onEdit" v-if="isCurrentUserOwner">Edit</button>
          <!-- Display an edit form when in edit mode -->
        <div v-if="isEditing">
          <textarea v-model="editedContent"></textarea>
          <div class="form-group">
              <label for="media">Media (optional)</label>
              <input type="file" id="media" ref="multimediaInput" name="media" @change="handleFileChange">
          </div>
          <button @click="onSave">Save</button>
          <button @click="onCancel">Cancel</button>
        </div>
      </div>  
      <span class="new-badge" v-if="!isCurrentUserOwner && isNewPost">New</span>    
  </div>
  
</template>

<script>
import axios from "../libs/axios";
import FormData from 'form-data'
import { mapState } from 'vuex';

export default {
    name: 'postItem',
    
  data() {
    return {
      isEditing: false,
      editedContent: '', // Bind this to the edited content
      editedMultimediaContent: null, // For uploading new multimedia content
      postReaders: [],      
  
    };
  },
  props :{

      post: {
        type: Object, // Ensure post is an object
        required: true,
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
        type: Number
      },
      currentUser: {
        type: Number
      },
      postId:{
        type: Number,     
      },
      isHomePage:{
        type: Boolean,
        default: true
      }
   }, 
  
  computed: {

    isCurrentUserOwner() {
      // Check if the current user's ID matches the post owner's ID
      return this.currentUser === this.post.user_id;          
    },

    isNewPost() {
    const userId = this.$store.state.userData.userId;
    // Check if the user has read the post
    const hasRead = this.postReaders.some(postReader=> postReader.user_id === userId);
    // If the post is not owned by the current user and the user hasn't read it, consider it new
    return !this.isCurrentUserOwner && !hasRead;
    },

    ...mapState(['userData', 'posts']),

  },
  mounted() {
  // Fetch the list of users who have read the post
  this.fetchPostReaders();
  }, 

  methods: {

    onEdit() {
     // Toggle the edit mode flag when the "Edit" button is clicked
      this.isEditing = true;
      // Initialize the edited content with the current post content
      this.editedContent = this.textContent;
      this.editedMultimediaContent = this.mltMediaContent  ? this.mltMediaContent.name:'';
      console.log(this.post); // Add this line
     // console.log(this.$store.state.userData); // Add this line
    }, 
    onSave() {    
    
      // After a successful save, toggle off the edit mode
      if (confirm("Are you sure you want to edit this post?")) {
     
     // Pass the post ID as a parameter in the request.
     const postId = this.postId;// Make sure to add a postId prop to your component
      // Create FormData object
      const formData = new FormData();

      // Append the edited text content
      formData.append('textContent', this.editedContent);

      // Append the edited multimedia content (if changed)
      if (this.editedMultimediaContent) {
        formData.append('image', this.editedMultimediaContent);
      }
            
      const headers = {          
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + this.$store.state.userData.token
      };
     // Send the put request to your API
     axios.put(`posts/${postId}`, formData, {headers: headers})
       .then(() => {
        this.editedContent = this.textContent;
        this.editedMultimediaContent = this.mltMediaContent
         // Handle success, maybe show a success message
         console.log('Post edited successfully');
        
           // Use Vue Router to refresh the current route (reload the home page)
         this.$router.go();      
         this.isEditing = false;
       })
       .catch((error) => {
         // Handle error, show an error message
         console.error('Error editing post', error);
       });
      }
   },
  
    onCancel() {
      // Handle canceling the edit mode, reset the edited content if needed
      this.isEditing = false;
      this.editedTextContent = this.textContent;
      this.editedMltimediaContent = this.mltMediaContent;
      },
      handleFileChange(event) {
      // Handle the change event when the user uploads a new multimedia file
      this.editedMultimediaContent = event.target.files[0];
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
        const postId = this.postId;
        const response = await axios.post(
          `posts/${postId}/like`,
          { userId: this.$store.state.userData.userId, like: likeStatus },
          {headers: { "Content-Type": "application/json",
                      "Authorization": "Bearer " + this.$store.state.userData.token }});

            // console.log(response.data.postReaction);          
      
         this.$store.commit('refreshPost', response.data.updatedPost); // Store posts in Vuex
         this.$store.commit('setPost', response.data.updatedPost);

      // console.log(response.data);
      } catch (error) {
        console.error("Error liking/disliking post:", error);
      }
    },

    getPost(){
      // get one post page
      this.$router.push(`/posts/${this.postId}`)  
    },
    onComment() {
      // get one post page and its comments
      if(this.isHomePage) {
       this.$router.push(`/posts/${this.postId}`)  
      }   
    },
         
    // delete post function
   onDelete() {
      if (confirm("Are you sure you want to delete this post?")) {
     
        // Pass the post ID as a parameter in the request.
        const postId = this.postId;// Make sure to add a postId prop to your component.      
        // Send the delete request to your API
        axios
          .delete(`posts/${postId}`, {headers: {Authorization: 'Bearer ' + this.$store.state.userData.token}})
          .then(() => {
            // Handle success, maybe show a success message
            console.log('Post deleted successfully');
            // You can also emit an event to notify a parent component to remove this post from the list.
            this.$emit('post-deleted', postId);
              // Use Vue Router to refresh the current route (reload the home page)
            this.$router.go();
            
          })
          .catch((error) => {
            // Handle error, show an error message
            console.error('Error deleting post', error);
          });
      }
    },

    async markAsRead() {
        const postId = this.postId; // Use 'id' to get the post ID from route params
          // Send a request to update the postReaders array in the database
          try {
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.$store.state.userData.token,
            };
            const userId = this.$store.state.userData.userId;

           const response = await axios.post(`posts/${postId}/markAsRead`, { userId }, { headers: headers });
            console.log(response.data.message);
           await this.fetchPostReaders();
         
          } catch (error) {
            console.error('Error marking post as read on the server:', error);
          }
        
    },
    async fetchPostReaders() {
    const postId = this.postId;

    try {
      const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.$store.state.userData.token,
            };

      const response = await axios.get(`posts/${postId}/readers`, { headers: headers });
      this.postReaders = response.data || [];
    } catch (error) {
      console.error('Error fetching post readers:', error);
    }
  },
  
  },

}              
</script>        

<style lang="scss">
#post {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
  position: relative;
  & > div{
    cursor: pointer;
  }
    /* Reset some default styles */

  // body, h1, h2, h3, p, ul, li {
  //     margin: 0;
  //     padding: 0;
  //   }
    
    // body {
    //   font-family: Arial, sans-serif;
    //   background-color: #f2f2f2;
    //   //color: #333;
    // }
    
    // main {
    //   padding: 20px;
    // }
    
    // h2 {
    //   font-size: 20px;
    //   margin-bottom: 10px;
    // }
    
    .new-badge {
      position: absolute;
      top: 10px; 
      right: 10px; 
      background-color: red; 
      color: white; 
      padding: 7px;
      border-radius: 5px; 
      font-size: 12px;
    }   
    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: 50px;
    }   
    .post-header img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }   
    .post-info h3 {
      font-size: 14px;
      margin-bottom: 5px;
    }   
    .post-date {
      font-size: 12px;
      color: #888;
    }   
    .post-content img {
      width: 70%;
      height: 40%;
      margin: 10px 0 5px 0;
    }
    .post-content p {
      margin-bottom: 6px;
    }   
    .post-actions .comnt-btn, .mark-read-button,
    .delete-post-button, .edit-post-button {
     display: inline-block;
      background-color: #333;
      color: #fff;
      border: none;
      padding: 5px 10px;
      margin-right: 5px;
      margin-top: 20px;
      border-radius: 25px;
      cursor: pointer;
      &:hover{
        background-color: #fff;
        color: #333;
        border: solid 1px #333;
      }
    }
    .post-actions i {   
      cursor: pointer;
      font-size: larger;
      &:active{
        color: rgb(239, 223, 45)
      }
      &.fa-thumbs-down {
        margin-left: 15px;
      }
    }    
    .likes-count {
      color: rgb(20, 202, 20);
    }
    .dislikes-count {
      color: rgb(233, 30, 30);
    }
    .post-actions span {
      margin-left: 5px;
      margin-right: 10px;
    }
  }   
@media screen and (max-width: 600px) {
  #post{
    .post-actions .comnt-btn, .mark-read-button,
    .delete-post-button, .edit-post-button {
      display: inline;
      font-size: 11px;
      width: auto;
      padding: 2px 5px;
      margin-right: 3px;
      margin-top: 20px;
      border-radius: 20px;
    }
    .new-badge {
      padding: 5px;
      border-radius: 6px; 
      font-size: 11px;
    }
    .post-actions span {
      margin-left: 3px;
      margin-right: 5px;
    }
    .post-actions i {   
      cursor: pointer;
      font-size: medium;
      &.fa-thumbs-down {
        margin-left: 5px;
      }
    } 
  }
}
</style>