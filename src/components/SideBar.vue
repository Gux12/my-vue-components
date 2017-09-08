<template>
  <el-menu class="nav-menu" theme="dark" :unique-opened="true" :router="true" >
    <el-menu-item index="/home"><i class="el-icon-menu"></i>首页</el-menu-item>
    <el-submenu index="1">
      <template slot="title"><i class="el-icon-message"></i>数学标注相关</template>
      <el-menu-item index="/math">数学公式标注</el-menu-item>
    </el-submenu>
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
