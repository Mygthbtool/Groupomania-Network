<template>
    <div id="user-info" class="user-info">
      
      <div class="user-details">
        <img  :src="avatar" alt="User Avatar">
        <h3>{{ firstName }} {{ lastName }}</h3>
        <p>{{ email }}</p>
      </div>
    </div>
</template>

<script>
export default {
    name: 'UserItem',
    
    props: {
            
      firstName : {
        type: String,
        required: true
      },
      lastName : {
        type: String,
        required: true
      },
      email : {
        type: String,
        required: true
      },
      avatar: {
        type : String,
        default: '/images/User-avatar.png', // Set a default value for the avatar prop if needed
      },
      userId:{
        type: Number
      }       
  },  

}
</script>

<style lang="scss">
.user-info {
    /* Reset some default styles */
          
      // display: flex;
      // flex-direction: column;
      align-items: left;
      margin-bottom: 0px;
    
    &.user-info img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    &.user-details h3 {
      font-size: 18px;
      margin-bottom: 5px;
    }     
    
  }
  @media screen and (max-width: 500px) {
  #user-info {
    &.user-info {
      flex-direction: row;
      align-items: center;
    }

    &.user-info img {
      margin-bottom: 0;
      margin-right: 10px;
      width: 30px;
      height: 30px;
    }

    &.user-details h3 {
      font-size: 12px;
      margin-bottom: 0;
    }
  }
}
</style>
