<template>
  <span ref="answer" class="MQ"></span>
</template>
<script>
  import KaTex from './KaTex'
  import 'mathquill/build/mathquill.css'

  window.jQuery = require('mathquill/formula/jquery.min.js')
  require('mathquill/build/mathquill.min.js')
  let MQ = window.MathQuill.getInterface(2)

  export default {
    name: '',
    data () {
      return {
        formulas: '\\frac{1}{2}',
        mathField: null,
        staticMath: null
      }
    },
    methods: {
      insert (val) {
        this.mathField ? this.mathField.write(val) : ''
      },
      focus () {
        this.mathField ? this.mathField.focus() : ''
      },
      replace (val) {
        if (this.mathField) {
          this.mathField.latex(val)
        } else if (this.staticMath) {
          this.staticMath.latex(val)
          this.$emit('input', this.staticMath.latex())
        }
      }
    },
    mounted () {
      let htmlElement = this.$refs[ 'answer' ]
      if (this.type === 'static') {
        this.staticMath = MQ.StaticMath(htmlElement)
        this.staticMath.latex(this.value)
      } else if (this.type === 'edit') {
        let config = {
          handlers: {
            edit: () => {
              this.$emit('input', this.mathField.latex())
            }
          },
          restrictMismatchedBrackets: true
        }
        this.mathField = MQ.MathField(htmlElement, config)
        this.mathField.latex(this.value)
      } else return
    },
    components: {
      KaTex
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'static'
      }
    }
  }
</script>
<style lang="scss" scoped="">
  .MQ.mq-math-mode {
    cursor: inherit;
    pointer-events: none;
  }
  .MQ.mq-editable-field.mq-math-mode {
    cursor: text;
    pointer-events: auto;
    padding: 10px 0 10px 0;
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;
    box-shadow: none;
    background-color: #fff;
    border-radius: 4px;
    border: 2px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }
  .MQ.mq-editable-field.mq-math-mode.mq-focused {
    border-color: #20a0ff;
  }
</style>
