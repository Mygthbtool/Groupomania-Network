<template>
        <div id="post" class="post" v-bind="posts">
          <div class="post-header">
            <img :src="userAvatar" />
            <div class="post-info">
              <h3>{{ userFirstName }} {{ userLastName }}</h3>
              <span class="post-date">{{ postingDate }}</span>
            </div>
          </div>
          <div class="post-content">
            <p>{{ textContent }}</p>
            
            <img v-if="mltMediaContent" :src="mltMediaContent" alt='multiMediaContent'/>

          </div>
          <div class="post-actions">
            <button class="like-button" @click="onLike">Like {{ likes }} </button>
            <button class="dislike-button" @click="onDislike">Dislike {{ dislikes }}</button>
            <button class="comment-button" @click="onComment">Comment {{ comments }}</button>
          
            <button class="delete-post-button" @click="onDelete" v-if="isCurrentUserOwner">Delete</button>
            <button class="edit-post-button" @click="onEdit" v-if="isCurrentUserOwner">Edit</button>

          </div>  
        </div>

</template>

<script>
//import router from "@/router";
import axios from "../libs/axios";
export default {
    name: 'postItem',
  
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
   methods: {
    onLike() {
      // Implement your like functionality here
    },
    onDislike() {
      // Implement your dislike functionality here
    },
    onComment() {
      // Implement your comment functionality here
    },
   // onDelete() {
      // Implement your delete functionality here

    //  deletePost(){
        // this.post._id = postId
        // //({_id: this.post._id})
        //     axios.delete("posts/:id" + this.post._id, {headers: {Authorization: 'Bearer ' + this.$store.state.userData.token}})
        //         .then(response => {
        //             let resp = JSON.parse(response.data);
        //             console.log(resp.message);
        //            this.$router.push('/');
        //         })
        //         .catch(error => {
        //             console.log(error);    
        //         })
   // },
   onDelete() {
      if (confirm("Are you sure you want to delete this post?")) {
     
        // Pass the post ID as a parameter in the request.
        const postId = this.postId;// Make sure to add a postId prop to your component.
        
        // Send the delete request to your API
        // Example using Axios:
        axios
          .delete(`posts/${postId}`, {headers: {Authorization: 'Bearer ' + this.$store.state.userData.token}})
          .then(() => {
            // Handle success, maybe show a success message
            console.log('Post deleted successfully');
            // You can also emit an event to notify a parent component to remove this post from the list.
            this.$emit('post-deleted', postId);
            
          })
          .catch((error) => {
            // Handle error, show an error message
            console.error('Error deleting post', error);
          });
      }
    },
  },
};
       
        
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
      background-color: #333;
      color: #fff;
      border: none;
      padding: 5px 10px;
      margin-right: 10px;
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
    
  }

</style>
