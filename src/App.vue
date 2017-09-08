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
      <el-menu class="nav-menu" @open="" @close="" theme="dark" :unique-opened="true" :router="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>数学标注相关</template>
          <el-menu-item index="/math">数学公式标注</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-submenu>
        <el-menu-item index="2"><i class="el-icon-menu"></i>导航二</el-menu-item>
        <el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>
      </el-menu>
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
