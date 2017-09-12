<template>
  <div id="app"
       class="clearfix">
    <div class="nav-menu-wrap">
      <router-view name="header"></router-view>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }
</script>

<style scoped lang="scss">
  #app {
    width: 100%;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    .nav-menu-wrap {
      z-index: 1;
      display: inline-block;
      height: 100vh;
      width: 200px;
      background: white;
      float: left;
      &:focus {
        outline: none
      }
      .nav-menu {
        height: 100%;
        border-radius: 0;
        border: 0;
      }
    }
    .panel {
      overflow: hidden;
      min-height: 100vh;
    }
  }
</style>
