<template>
  <span ref="answer" class="MQ" v-html="textContent"></span>
</template>
<script>
  import 'mathquill/build/mathquill.css'

  window.jQuery = require('mathquill/formula/jquery.min.js')
  require('mathquill/build/mathquill.min.js')
  let MQ = window.MathQuill.getInterface(2)

  export default {
    name: '',
    data () {
      return {
        staticMath: null
      }
    },
    mounted () {
      this.staticMath = MQ.StaticMath(this.$refs.answer)
    },
    computed: {
      textContent () {
//        console.log('sm', this.value)
        return this.staticMath ? this.staticMath.latex(this.value).html() : ''
      }
    },
    props: [ 'value' ]
  }
</script>
<style lang="scss" scoped="">
  .MQ.mq-math-mode {
    cursor: inherit;
  }
</style>
