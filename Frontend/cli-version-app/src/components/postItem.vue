<template>
  <div v-if="post" id="post" class="post" v-bind="posts">
    <div :class="{ 'unread-post': !isPostRead }">
      <div class="post-header">
        <img :src="post.userId.avatar" />
        <div class="post-info">
          <h3>{{ post.userId.firstName }} {{ post.userId.lastName }}</h3>
          <span class="post-date">{{ postingDate }}</span>
        </div>
      </div>
      <div class="post-content">
        <p>{{ textContent }}</p>
        
        <img v-if="mltMediaContent" :src="mltMediaContent" alt='multiMediaContent'/>

      </div>
      <div class="post-actions">
        <button class="like-button" @click="onLike">Like</button>{{ post.likes }}
        <button class="dislike-button" @click="onDislike">Dislike</button>{{ post.dislikes }}
        <button class="comment-button" @click="onComment">Comment</button>
      
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
    </div>
  </div>
  

</template>

<script>
import axios from "../libs/axios";
import FormData from 'form-data'
export default {
    name: 'postItem',
    
   data() {
    return {
      isEditing: false,
      editedContent: '', // Bind this to the edited content
      editedMultimediaContent: null, // For uploading new multimedia content
      postCopy: Object.assign({}, this.post), // Create a copy of the post prop
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
        type: String
      },
      currentUser: {
        type: String
      },
      postId:{
        type: String,     
      },
      readBy: {
        type: Array,
      }
      
   }, 
  
   computed: {

    isCurrentUserOwner() {
      // Check if the current user's ID matches the post owner's ID
      return this.currentUser === this.post.userId._id;
    },
    isPostRead() {
      // Check if the user's ID is in the 'readBy' array
      return this.post.readBy.includes(this.$store.state.userData.userId);
    
    },
    
   },
   methods: {

    onEdit() {
     // Toggle the edit mode flag when the "Edit" button is clicked
      this.isEditing = true;
      // Initialize the edited content with the current post content
      this.editedContent = this.textContent;
      this.editedMultimediaContent = this.mltMediaContent  ? this.mltMediaContent.name:''
    }, 
    onSave() {
    
      // Use this.postId to identify the post to be updated
      // Pass this.editedContent as the new content
    
      // After a successful save, toggle off the edit mode
      if (confirm("Are you sure you want to edit this post?")) {
     
     // Pass the post ID as a parameter in the request.
     const postId = this.postId;// Make sure to add a postId prop to your component
      //  textContent: this.editedContent,
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
     axios
       .put(`posts/${postId}`, formData, {headers: headers})
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
      // Send a request to the server to like/dislike the post
      try {
        const response = await axios.post(
          `posts/${this.post._id}/like`, // Adjust the URL as needed
          { like: likeStatus }, // Send like status
          {headers: { "Content-Type": "application/json",
              Authorization: "Bearer " + this.$store.state.userData.token }});
        console.log(response);
        this.$store.commit('refreshPost', response.data.post); // Store posts in Vuex

        // Update the post's likes and dislikes locally
        // if (likeStatus === 1) {
        //   this.postCopy.likes += 1;
        // } else if (likeStatus === -1) {
        //   this.postCopy.dislikes += 1;
        // }
        // else if (likeStatus === 0) {
        //   // Handle canceling like or dislike if needed
        // }
      } catch (error) {
        console.error("Error liking/disliking post:", error);
      }
    },

    onComment() {
      // Implement your comment functionality here
       this.$router.push(`/posts/${this.post._id}`)     
    },
      
    
    // Implement your delete functionality here
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
  
  },
  // mounted() {
  //   if (!this.post) {
  //     // Fetch the post data when the component is mounted, but only if 'post' is not provided as a prop
  //     axios.get(`posts/${this.postId}`, { headers: { 'Authorization': 'Bearer ' + this.$store.state.userData.token } })
  //       .then((response) => {
  //         this.fetchedPost = response.data; // Store the fetched data locally
  //       })

  //       .catch((error) => {
  //         console.error('Error fetching post:', error);
  //       });
  //   }
  // },
  
}
       
        
</script>        

<style lang="scss">
#post {
    /* Reset some default styles */
  body, h1, h2, h3, p, ul, li {
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333;
    }
    
    header {
      background-color: #333;
      color: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
    }
    
    header h1 {
      font-size: 24px;
    }
    header img {
      max-width: 100px;
      
    }
    nav ul {
      list-style: none;
    }
    
    nav ul li {
      display: inline-block;
      margin-right: 10px;
    }
    
    nav ul li a {
      color: #fff;
      text-decoration: none;
    }
    
    main {
      padding: 20px;
    }
    
    h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    .post {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
    }
    
    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .post-header img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .post-info h3 {
      font-size: 16px;
    }
    
    .post-date {
      font-size: 12px;
      color: #888;
    }
    
    .post-content img {
      width: 60%;
      height: 50%;
      margin-top: 10px;
    }
    
    .post-actions button {
    //  display: flexstart;
      background-color: #d91414;
      color: #fff;
      border: none;
      padding: 5px 10px;
      margin-right: 5px;
      cursor: pointer;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .user-info img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .user-details h3 {
      font-size: 18px;
      margin-bottom: 5px;
    }
    
    .user-actions button {
      background-color: #333;
      color: #fff;
      border: none;
      padding: 5px 10px;
      margin-right: 10px;
      cursor: pointer;
    }
    
    footer {
      background-color: #333;
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .unread-post {
      border: 3px solid red;
    }
    
  }

</style>
