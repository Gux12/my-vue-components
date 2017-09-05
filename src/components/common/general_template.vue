<template>
  <div v-if="!ready"
       v-loading.body="!ready"
       element-loading-text="拼命加载中"
       class="page-loading">

  </div>
  <div v-else>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        ready: false
      }
    },
    methods: {},
    created () {
      this.ready = true
    }
  }
</script>
<style scoped lang="scss">

</style>
