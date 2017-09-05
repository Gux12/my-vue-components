<template>
  <div :class="['block', formulas.status]">
    <img :src="formulas.img" alt="">
    <!--<p><katex :expr="formulas.answer" ></katex></p>-->
    <!--<p><span>{{formulas.answer}}</span></p>-->
    <p>
      <katex :expr="formulas.result"></katex>
    </p>
    <p><span style="font-size: 0.6em;color: #a4a4a4;">{{formulas.result}}</span></p>
  </div>
</template>
<script>
  import katex from '../common/KaTex.vue'

  export default {
    name: 'FormulasBlock',
    data () {
      return {}
    },
    methods: {
    },
    props: [ 'formulas' ],
    components: {
      katex
    }
  }
</script>
<style scoped lang='scss'>
  @import "src/scss/color.scss";

  .block {
    display: block;
    float: left;
    box-sizing: border-box;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    text-align: center;
    transition: background,border 0.3s,0.1s;
    background: #ffffff;
    font-size: 1em;
    padding: 5px;
    cursor: pointer;
    img {
      width: 100%;
    }
    p {
      margin: 0;
    }
    &.selected {
      border: 5px solid $color-success;
    }
    &.deleted {
      border: 5px solid $color-danger;
    }
    &:hover {
      background: #eeeeee;
      font-size: 1.5em;
    }
  }
</style>
