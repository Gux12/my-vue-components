<!--TODO 目前mathquill使用存在问题Uncaught Error: prayer failed: no half-empty fragments-->

<template>
  <span ref="answer" class="MQ">{{this.value}}</span>
</template>
<script>
  import 'mathquill/build/mathquill.css'
  import debounce from 'lodash/debounce'

  let katex = require('bower_components/katex/dist/katex.min.js')

  window.jQuery = require('mathquill/formula/jquery.min.js')
  require('mathquill/build/mathquill.min.js')
  let MQ = window.MathQuill.getInterface(2)

  export default {
    name: '',
    data () {
      return {
        mathField: null,
        editType: 'keydown',
        params: null
      }
    },
    methods: {
      insert () {
        let val, params
        if (arguments[ 0 ]) val = arguments[ 0 ]
        if (arguments[ 1 ]) params = arguments[ 1 ]
        this.editType = 'insert'
        this.params = params
        if (this.mathField) this.mathField.write(val)
      },
      focus () {
        if (this.mathField) this.mathField.focus()
      },
      LatexSyntax (LatexString) {
        try {
          katex.renderToString(LatexString, { throwOnError: true })
          if (this.mathField) this.mathField.latex(LatexString)
          return this.mathField.latex()
        } catch (err) {
          LatexString = LatexString.split('')
          LatexString.splice(err.position, 1, ' ')
          LatexString = LatexString.join('')
          return this.LatexSyntax(LatexString)
        }
      },
      replace () {
        let val, params
        if (arguments[ 0 ]) val = arguments[ 0 ]
        if (arguments[ 1 ]) params = arguments[ 1 ]
        this.editType = 'replace'
        this.params = params
        this.LatexSyntax(val)
      }
    },
    mounted () {
      let htmlElement = this.$refs[ 'answer' ]
      let config = {
        restrictMismatchedBrackets: true,
        sumStartsWithNEquals: true,
        supSubsRequireOperand: true,
        handlers: {
          // TODO Mathquill的edit_handler在使用.latex(val)方法时会触发两次（issue#601 https://github.com/mathquill/mathquill/issues/601）
          // 目前用debounce减少input事件的触发频率，还有没有更好的解决方案？
          edit: debounce((e) => {
            // 返回不同edit的触发类型和当前latex串
            this.$emit('input', {
              latex: this.mathField.latex(),
              editType: this.editType,
              params: this.params
            })
            this.editType = 'keydown'
            this.params = null
          }, 10)
        }
      }
      this.mathField = MQ.MathField(htmlElement, config)
      this.mathField.focus()
    },
    props: [ 'value' ]
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
