<template>
  <div :class="['block', formulas.status]">
    <img :src="formulas.img" alt="" class="resized-img">
    <p>
      <katex class="formulas-display" v-if="formulas.status === 'selected'" :expr="newlabel"></katex>
      <katex class="formulas-display" v-else :expr="formulas.result"></katex>
    </p>
    <p>
      <span class="origin-text" v-if="formulas.status === 'selected'">{{newlabel}}</span>
      <span class="origin-text" v-else>{{formulas.result}}</span>
    </p>
  </div>
</template>
<script>
  import katex from '../common/KaTex.vue'

  export default {
    name: 'FormulasBlock',
    data () {
      return {
        display: 'none'
      }
    },
    methods: {},
    mounted () {
    },
    props: [ 'formulas', 'newlabel' ],
    components: {
      katex
    },
    computed: {}
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
    transition: background, border 0.3s, 1s;
    background: #555555;
    padding: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    .formulas-display {
      font-size: 1.2em;
      color: #eeeeee;
    }
    .origin-text {
      font-size: 0.8em;
      color: #a4a4a4;
    }
    .resized-img {
      height: 40px;
      display: block;
      margin: auto;
    }
    .preview-img {
      position: absolute;
      z-index: 1000;
      cursor: none;
      top: 200px;
      box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      left: 50%;
      margin-left: 0px;
      max-width: 100vw;
      max-height: 100vh;
    }
    p {
      margin: 0;
    }
    &.selected {
      border: 2px solid $color-success;
      background: #333333;
    }
    &:hover {
      background: #333333;

    }
  }
</style>
