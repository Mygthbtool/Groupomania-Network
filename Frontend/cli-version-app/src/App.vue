<template>
  
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/addpost">Add post</router-link> |
      <router-link to="/login">Log in</router-link> |
      <router-link to="/signup">Sign up</router-link> |

    </nav>
    <router-view/>
</template>

<script>

</script>

<style lang="scss">
 body{
  padding: 0;
  margin: 0;
  height: 100%;
}

#app {
  
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  padding: 0;
  margin: 0;


nav {
  padding: 30px;
  display: none;
   

  // a {
  //   font-weight: bold;
  //   color: #2c3e50;

  //   &.router-link-exact-active {
  //     color: #42b983;
  //   }
  // }
}
}
</style>
