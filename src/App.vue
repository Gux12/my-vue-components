<template>
  <div id="app"
       class="clearfix">
    <div class="nav-menu-wrap"
         @keydown.ctrl.65.prevent
         @keydown.meta.65.prevent
         @keydown.alt.65.prevent
         @keydown.ctrl.68.prevent
         @keydown.meta.68.prevent
         @keydown.ctrl.90.prevent
         @keydown.meta.90.prevent
         tabindex="0">
      <router-view name="header"></router-view>
    </div>
    <el-col class="panel">
      <router-view></router-view>
    </el-col>
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
      position: relative;
      width: calc(100% - 200px);
    }
  }
</style>
