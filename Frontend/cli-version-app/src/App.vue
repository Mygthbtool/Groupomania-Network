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

<style>
nav {
  display: none;
}   

</style>
