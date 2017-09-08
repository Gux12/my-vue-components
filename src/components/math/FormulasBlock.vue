<template>
  <div :class="['block', formulas.status]">
    <img :src="formulas.img" alt="" class="resized-img">
    <p>
      <katex v-if="formulas.status === 'selected'" style="font-size: 2em;color: #eeeeee;" :expr="newlabel"></katex>
      <katex v-else style="font-size: 2em;color: #eeeeee;" :expr="formulas.result"></katex>
    </p>
    <p contenteditable="true">
      <span v-if="formulas.status === 'selected'" style="font-size: 1em;color: #a4a4a4;">{{newlabel}}</span>
      <span v-else style="font-size: 1em;color: #a4a4a4;">{{formulas.result}}</span>
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
    methods: {
    },
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
    transition: background, border 0.3s, 0.1s;
    background: #333333;
    padding: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    .resized-img {
      height: 60px;
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
      background: #444444;
    }
    &:hover {
      background: #555555;

    }
  }
</style>
