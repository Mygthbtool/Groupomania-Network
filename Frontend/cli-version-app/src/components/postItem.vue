<template>
        <div id="post" class="post">
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
            <button class="like-button">Like {{ likes }} </button>
            <button class="dislike-button">Dislike {{ dislikes }}</button>
            <button class="comment-button">Comment {{ comments }}</button>
            <button class="delete-post-button">Delete</button>
            <button class="edit-post-button">Edit</button>

          </div>  
        </div>

</template>

<script>
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
    
   }, 
    // data() {
    //   return {
    //     posts: [
    //        {
            
    //         userFirstName: '',
    //         userLastName: '',
    //         userAvatar: '',
    //         postingDate: '',
    //         textContent: this.textcontent,
    //         //mltMediaContent: this.mltMediaContent,
    //         likes: 0,
    //         dislikes: 0,
    //         comments: '',
    //         userId:''

          
    //       },
    //       // Add more posts...
    //     ]
        
    //     }
      
    // }
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
