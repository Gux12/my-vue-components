<template>
  <span v-html="_expr"></span>
</template>
<script>
  import '../../../bower_components/katex/dist/katex.min.css'
  let katex = require('../../../bower_components/katex/dist/katex.min.js')
  export default {
    name: 'katex',
    replace: true,
    props: {
      expr: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {}
    },
    computed: {
      _expr: function () {
        try {
          return katex.renderToString(this.expr, { throwOnError: false })
        } catch (err) {
          return ''
        }
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
