<template>
  <div v-if="!ready"
       v-loading.body="!ready"
       element-loading-text="拼命加载中"
       class="page-loading">

  </div>
  <div v-else class="icons">
    <IconFindIphone></IconFindIphone>
  </div>
</template>
<script>
  import IconFindIphone from './IconFindIphone.vue'

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
    },
    components: {
      IconFindIphone
    }
  }
</script>
<style scoped lang="scss">
  .icons {
    background: black;
  }
</style>
