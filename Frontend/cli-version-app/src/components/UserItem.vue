<template>
    <div id="user-info" class="user-info">
      <img  :src="avatar" alt="User Avatar">
      <div class="user-details">
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
#user-info {
    /* Reset some default styles */
        
    &.user-info {
      display: flex;
      flex-direction: column;
      align-items: left;
      margin-bottom: 10px;
    }
    
    &.user-info img {
      width: 60px;
      height: 60px;
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
    }

    &.user-details h3 {
      font-size: 16px;
      margin-bottom: 0;
    }
  }
}
</style>
