<template>
  <el-menu class="nav-menu" theme="dark" :unique-opened="true" :router="true" >
    <el-menu-item index="/home"><i class="el-icon-menu"></i>首页</el-menu-item>
    <el-submenu index="1">
      <template slot="title"><i class="el-icon-message"></i>组件列表</template>
      <el-menu-item index="/common"><i class="el-icon-star-off"></i>一般</el-menu-item>
    </el-submenu>
    <el-menu-item index="/math"><i class="el-icon-star-off"></i>数学公式标注</el-menu-item>
    <el-menu-item index="/threejs"><i class="el-icon-star-off"></i>Three.js</el-menu-item>
    <el-menu-item index="/icons"><i class="el-icon-star-off"></i>Guxicons.css</el-menu-item>
  </el-menu>
</template>
<script>
  export default {
    name: 'Header',
    data () {
      return {
      }
    },
    methods: {},
    created () {
    }
  }
</script>
<style scoped lang="scss">

</style>
