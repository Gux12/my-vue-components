<template>
  <div v-if="!ready"
       v-loading.body="!ready"
       element-loading-text="拼命加载中"
       class="page-loading">

  </div>
  <div v-else class="common_body">
    <div class="common_panel">
      <div class="common_panel_head">
        <h1 class="common_panel_title">
          组件介绍
        </h1>
      </div>
      <div class="common_panel_body">
        <div class="common_example">
          <div class="common_example_head">
            <h2 class="common_example_title">MathField.vue、StaticMath.vue<span
              class="common_example_title_span">基于MathQuill的数学公式编辑器</span></h2>
          </div>
          <div class="common_example_body">
            <div class="common_example_intro">
              <p>
                StaticMath为静态渲染模式，MathField为公式编辑器模式
              </p>
              <p>
                StaticMath子组件为DOM渲染数据响应式。MathField的DOM渲染方式有两种，insert和replace，子组件DOM对象并没有绑定到value，当父组件绑定数据变化时，需要显式触发MarthEditor的insert()和replace()方法</p>
              <p>调用replace()和insert()或修改内容后，v-on:input会传递当前latex字符串和触发事件类型</p>
            </div>
            <div class="common_example_disp">
              <div class="common_example_disp_item">
                <label for="">静态StaticMath:</label>
                <StaticMath :value="MathEditor"></StaticMath>
              </div>
              <div class="common_example_disp_item">
                <div>
                  <label for="">可编辑MathField:{{editType}}</label>
                  <MathField :value="MathEditor" @input="onMathEditorInput" type="edit" ref="MathField"></MathField>
                </div>
                <el-button size='mini' type="primary"
                           @click="$refs.MathField.replace('1bm\\\\geqbm-1=3\\\\cdotn=3');$refs.MathField.focus()">
                  替换还原
                </el-button>
                <el-button size='mini' type="primary" @click="$refs.MathField.insert('\\div');$refs.MathField.focus()">
                  插入测试
                </el-button>
              </div>
            </div>
            <div class="common_example_attribute">
              <table>
                <thead>
                <th>属性</th>
                <th>介绍</th>
                <th>备注</th>
                </thead>
                <tbody>
                <tr>
                  <td>value</td>
                  <td>传入的latex字符串</td>
                  <td>StaticMath响应，MathField不响应</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="common_example">
          <div class="common_example_head">
            <h2 class="common_example_title">KaTex.vue<span class="common_example_title_span">基于Katex的数学公式显示</span></h2>
          </div>
          <div class="common_example_body">
            <div class="common_example_intro">
            </div>
            <div class="common_example_disp">
              <KaTex expr="\sum_{am}^{I}KaTex"></KaTex>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import KaTex from './KaTex.vue'
  import StaticMath from './MathEditor/StaticMath.vue'
  import MathField from './MathEditor/MathField.vue'

  export default {
    name: '',
    data () {
      return {
        ready: false,
        MathEditor: '\\sum_{am}^IMathEditor',
        editType: ''
      }
    },
    methods: {
      onMathEditorInput (e) {
        console.log(e.latex, e.event)
        this.MathEditor = e.latex
        this.editType = e.event.editType
      }
    },
    created () {
      this.ready = true
    },
    components: {
      MathField, KaTex, StaticMath
    }
  }
</script>
<style scoped lang="scss">
  @import 'src/scss/color.scss';

  .common_body {
    background: $color-bg;
    overflow-y: scroll;
    height: 100vh;
    width: 100%;
    .common_panel {
      box-sizing: border-box;
      width: 80%;
      margin-left: 10%;
      float: left;
      background: white;
      padding: 2em 2em 1em 2em;
      .common_panel_head {
        width: 100%;
        text-align: left;
        border-bottom: 1px solid $color-border;
        .common_panel_title {
          margin-bottom: 1em;
          font-size: 3em;
        }
      }
      .common_panel_body {
        .common_example {
          .common_example_head {
            width: 100%;
            text-align: left;
            border-bottom: 1px solid $color-border;
            .common_example_title {
              margin-bottom: 1em;
              font-size: 2em;
              .common_example_title_span {
                font-size: 0.5em;
                padding-left: 1em;
                color: $color-font;
              }
            }
          }
          .common_example_body {
            .common_example_intro {
            }
            .common_example_disp {
              border: 1px solid $color-border;
              margin: 1em 0 0 1em;
              padding: 2em;
              border-radius: 4px;
              box-shadow: none;
              transition: box-shadow 0.3s ease;
              display: flex;
              justify-content: space-around;
              align-items: center;
              &:hover {
                box-shadow: 0px 0px 10px #333333;
              }
              .common_example_disp_item {
                label {
                  color: $color-font;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
