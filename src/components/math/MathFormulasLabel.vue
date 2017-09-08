<template>
  <div v-if="!ready"
       v-loading.body="!ready"
       element-loading-text="拼命加载中"
       class="page-loading">
  </div>
  <div class="workspace" v-else>
    <el-row class="utils"
            :gutter="40"
            @keydown.ctrl.65.prevent="onSelectBlockAll"
            @keydown.meta.65.prevent="onSelectBlockAll"
            @keydown.alt.65.prevent="onSelectBlockNone"
            @keydown.meta.68.native.prevent="onDelete"
            @keydown.ctrl.68.native.prevent="onDelete"
            @keydown.meta.90.native.prevent="onRevoke"
            @keydown.ctrl.90.native.prevent="onRevoke"
            @click.native="focusInput($event,function() {})"
            tabindex="0">
      <el-col :span="6">
        <el-row class="signbar">
          <el-button
            size="small"
            type="normal"
            v-for="item in this.shortcuts"
            @click.native.prevent.stop="onShortCutSelect($event, item)"
            :key="item.value">
            <katex :expr="item.display"></katex>
          </el-button>
        </el-row>
        <el-input
          class="my-autocomplete"
          type="textarea"
          autosize
          :value="formulasInput.value"
          @input="formulasInput = {value: arguments[0],eventName: 'keydown',selectionStart: arguments[0].length, selectionEnd: arguments[0].length}"
          placeholder="请输入内容"
          icon="search"
          @keyup.native="saveCursorPos($event.target)"
          @mouseup.native="saveCursorPos($event.target)"
          @keydown.ctrl.65.native.prevnet="onSelectBlockAll"
          @keydown.meta.65.native.prevent="onSelectBlockAll"
          @keydown.alt.65.native.prevent="onSelectBlockNone"
          @keydown.enter.native.prevent="onSubmit"
          @click.native.stop
          autofocus
          tabindex="0">
        </el-input>
        <div class="formulas-preview" click.native.prevent.stop>
          预览：
          <katex :expr="formulasInput.value" click.native.prevent.stop></katex>
        </div>
        <el-tag>{{username}}</el-tag>
        <el-button type="primary" icon="view" @click.stop="zoom = zoom < 1.5 ? zoom+0.1 : zoom"></el-button>
        <el-button type="danger" icon="minus" @click.stop="zoom = zoom > 0.5 ? zoom-0.1 : zoom"></el-button>
      </el-col>
      <el-col :span="18" class="simstring-wrap">
        <el-radio-group v-model="radio" class="simstring-kind" @change="onSimStringChange">
          <table>
            <tr v-for="(value, key) in {short:'短公式',middle:'中公式',long:'长公式'}" :key="key">
              <td><strong style="font-size: 1rem;text-align: right">{{value}}</strong></td>
              <td>
                <el-radio-button v-for="(item, index) in simStrings[key]" :key="index" :label="item">
                  <template>
                    <div class="el-button el-button--mini">
                      <katex :expr="item"></katex>
                    </div>
                  </template>
                </el-radio-button>
              </td>
            </tr>
          </table>
        </el-radio-group>
      </el-col>
    </el-row>
    <div class="complement"
         @keydown.ctrl.65.prevent="onSelectBlockAll"
         @keydown.meta.65.prevent="onSelectBlockAll"
         @keydown.alt.65.prevent="onSelectBlockNone"
         @selectstart.prevent="onSelectStart"
         @select.prevent="onSelect"
         @mousemove.prevent="onMouseMove"
         tabindex="-1"
         @mousedown="onSelectBlockNone">
      <div class="cost">{{ (costCalc.cost / 1000.0).toFixed(1) + 's' }}</div>
      <div class="formulas-block-wrap" :style="{zoom: zoom}">
        <FormulasBlock
          class="formulas-block"
          v-for="(formulas, index) in formulasList"
          :formulas="formulas"
          :newlabel="formulasInput.value"
          @mousedown.native.stop="onSelectBlock($event,formulas,index)"
          @mousedown.native.shift.stop="onSelectBlockShift($event,formulas,index)"
          @mousedown.native.meta.stop="onSelectBlockMetaCtrl($event,formulas,index)"
          :key="formulas.id">
        </FormulasBlock>
      </div>
      <div class="selector"></div>
    </div>
  </div>
</template>
<script>
  import {formulasList, simString, own, formulasSubmit, formulasDelete} from '@/api/math.js'
  import FormulasBlock from './FormulasBlock.vue'
  import katex from '../common/KaTex.vue'
  import GuxInput from '../common/GuxInput.vue'
  import * as REdetector from '@/utils/REdetector.js'
  import {start, end} from '@/utils/execution.js'
  import debounce from 'lodash/debounce'
  import remove from 'lodash/remove'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    name: 'MathFormulasLabel',
    data () {
      return {
        formulasList: null,
        formulasInput: {
          value: '',
          eventName: 'keydown',
          selectionStart: 0,
          selectionEnd: 0
        },
        simStrings: {},
        radio: '',
        ready: false,
        zoom: 1,
        blocks: {
          choices_num: 0,
          block_before_shift: -1,
          block_current: -1
        },
        selector: false,
        username: '',
        shortcuts: [ {
          value: '\\div',
          display: '\\div',
          pos: 4
        }, {
          value: '\\times',
          display: '\\times',
          pos: 6
        }, {
          value: '\\sum',
          display: '\\sum',
          pos: 4
        }, {
          value: '\\frac{}{}',
          display: '\\frac{x}{y}',
          pos: 6
        }, {
          value: '^{\\circ}',
          display: '^{\\circ}',
          pos: 8
        }, {
          value: '\\sqrt{}',
          display: '\\sqrt{1}',
          pos: 6
        }, {
          value: '\\cdot',
          display: '\\cdot',
          pos: 5
        }, {
          value: '\\quad',
          display: '\\quad',
          pos: 5
        }, {
          value: '\\because',
          display: '\\because',
          pos: 8
        }, {
          value: '\\therefore',
          display: '\\therefore',
          pos: 10
        } ],
        historyStack: [],
        costCalc: {
          cost: 0,
          startTime: new Date().getTime()
        },
        input: document.getElementsByClassName('el-textarea__inner')[ 0 ]
      }
    },
    methods: {
      // keydownDetector: 检测按键，用debounce减少按键触发simstring的post请求
      keydownDetector: debounce(async function () {
        this.keydown = false
        this.simStrings = await simString(this.formulasInput.value)
      }, 500),
      // saveCursorPos: 记录input的光标位置，存在formulasInput的selectionStart和selectionEnd中
      saveCursorPos (input) {
        this.formulasInput = {
          value: this.formulasInput.value,
          eventName: 'savepos',
          selectionStart: input.selectionStart,
          selectionEnd: input.selectionEnd
        }
      },
      // onSimStringChange: 当选择simstring时不触发simstring的post更新
      onSimStringChange (e) {
        this.focusInput()
        this.changeInput('radioselect')
      },
      // onShortCutSelect: 按住快捷键时，在光标位置处插入转义公式，并且光标移到相应的位置
      onShortCutSelect (e, item) {
        this.focusInput()
        let input = document.getElementsByClassName('el-textarea__inner')[ 0 ]
        let res = this.formulasInput.value.slice(0, input.selectionStart) + item.value + this.formulasInput.value.slice(input.selectionEnd, this.formulasInput.length)
        this.formulasInput.value.slice(input.selectionStart) + item.value
        this.formulasInput = {
          value: res,
          eventName: 'shortcutselect',
          selectionStart: this.formulasInput.selectionStart + item.pos,
          selectionEnd: this.formulasInput.selectionEnd + item.pos
        }
      },
      onSelectBlock (e, formulas, index) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        this.blocks.block_before_shift = index
        this.blocks.block_current = index
        for (let item of this.formulasList) {
          if (item !== formulas) {
            item.status = ''
          } else {
            item.status = 'selected'
          }
        }
        this.blocks.choices_num = 1
        this.focusInput()
        this.changeInput('blockselect')
      },
      onSelectBlockAll (e) {
        if ((REdetector.os.isMac && e.metaKey) || (!REdetector.os.isMac && e.ctrlKey)) {
          for (let item of this.formulasList) {
            item.status = 'selected'
          }
        }
        this.blocks.choices_num = this.formulasList.length
        this.blocks.block_before_shift = -1
        this.blocks.block_current = 0
        this.focusInput()
        this.changeInput('blockselect')
      },
      onSelectBlockNone (e) {
        for (let item of this.formulasList) item.status = ''
        this.blocks.block_current = -1
        this.blocks.block_before_shift = -1
        this.blocks.choices_num = 0
        this.focusInput()
        this.changeInput('blockselect')
      },
      onSelectBlockShift (e, formulas, index) {
        this.blocks.block_current = index
        let min, max
        if (this.blocks.block_before_shift !== -1) {
          min = this.blocks.block_current > this.blocks.block_before_shift ? this.blocks.block_before_shift : this.blocks.block_current
          max = this.blocks.block_current < this.blocks.block_before_shift ? this.blocks.block_before_shift : this.blocks.block_current
        } else {
          min = 0
          max = this.blocks.block_current
        }
        for (let item in this.formulasList) {
          if (item >= min && item <= max) {
            this.formulasList[ item ].status = 'selected'
          } else {
            this.formulasList[ item ].status = ''
          }
        }
        this.blocks.choices_num = max - min + 1
        this.focusInput()
        this.changeInput('blockselect')
      },
      onSelectBlockMetaCtrl (e, formulas, index) {
        if ((REdetector.os.isMac && e.metaKey) || (!REdetector.os.isMac && e.ctrlKey)) {
          this.blocks.block_current = index
          this.blocks.block_before_shift = index
          if (formulas.status === '') {
            formulas.status = 'selected'
            this.blocks.choices_num++
          } else {
            formulas.status = ''
            this.blocks.choices_num--
          }
        }
        this.focusInput()
        this.changeInput('blockselect')
      },
      onSelectBlockFirst () {
        this.formulasList[ 0 ].status = 'selected'
        this.focusInput()
        this.formulasInput = {
          value: this.formulasList[ 0 ].result,
          eventName: 'blockselect',
          selectionStart: this.formulasList[ 0 ].result.length,
          selectionEnd: this.formulasList[ 0 ].result.length
        }
        this.blocks = {
          choices_num: 1,
          block_before_shift: 0,
          block_current: 0
        }
      },
      async onSubmit (e) {
        let data
        let deleteItem = []
        for (let item of this.formulasList) {
          if (item.status === 'selected') {
            data = {
              cost: new Date().getTime() - this.costCalc.startTime,
              data: {
                text: item.result,
                label_text: this.formulasInput.value
              },
              dataset_id: 4,
              id: item.id,
              time: item.time + 1
            }
            try {
              if (!data) await formulasSubmit(data)
              deleteItem.push(item)
              this.$message.success('提交成功！')
            } catch (e) {
              console.error(e)
            }
          }
        }
        this.historyStack.push({ formulasList: cloneDeep(this.formulasList), type: '提交', count: deleteItem.length })
        remove(this.formulasList, function (n) {
          return deleteItem.indexOf(n) !== -1
        })
        if (this.formulasList.length === 0) {
          let S = start()
          this.formulasList = await formulasList()
          end(S, 'let list = await formulasList()')
          this.costCalc.cost = 0
          this.costCalc.startTime = new Date().getTime()
        }
        this.onSelectBlockFirst()
      },
      async onDelete (e) {
        if ((REdetector.os.isMac && e.metaKey) || (!REdetector.os.isMac && e.ctrlKey)) {
          let data
          let deleteItem = []
          for (let item of this.formulasList) {
            if (item.status === 'selected') {
              data = {
                cost: new Date().getTime() - this.costCalc.startTime,
                id: item.id,
                time: item.time + 1
              }
              try {
                if (!data) await formulasDelete(data)
                deleteItem.push(item)
                this.$message.success('已删除数据')
              } catch (e) {
                console.error(e)
              }
            }
          }
          this.historyStack.push({ formulasList: cloneDeep(this.formulasList), type: '删除', count: deleteItem.length })
          remove(this.formulasList, function (n) {
            return deleteItem.indexOf(n) !== -1
          })
          if (this.formulasList.length === 0) {
            let S = start()
            this.formulasList = await formulasList()
            end(S, 'let list = await formulasList()')
            this.costCalc.cost = 0
            this.costCalc.startTime = new Date().getTime()
          }
          this.onSelectBlockFirst()
        }
      },
      onRevoke (e) {
        if (this.historyStack.length !== 0) {
          let pop = this.historyStack.pop()
          console.log(pop)
          this.formulasList = pop.formulasList
          this.$message.warning('已撤销' + pop.type + pop.count + '项')
        } else {
          this.$message.warning('无法撤销')
        }
      },
      onSelect (e) {
      },
      onSelectStart (e) {
        this.selector = true
      },
      onMouseMove (e) {
        if (this.selector) {

        }
      },
      focusInput (e) {
        setTimeout(() => {
          let input = document.getElementsByClassName('el-textarea__inner')[ 0 ]
          input.focus()
          input.selectionStart = this.formulasInput.selectionStart
          input.selectionEnd = this.formulasInput.selectionEnd
        }, 0)
      },
      changeInput (eventName) {
        if (eventName === 'blockselect') {
          let value = this.blocks.block_current <= -1 ? '' : this.formulasList[ this.blocks.block_current ].result
          this.formulasInput = {
            value: value,
            eventName: eventName,
            selectionStart: value.length,
            selectionEnd: value.length
          }
        } else if (eventName === 'radioselect') {
          this.formulasInput = {
            value: this.radio,
            eventName: 'radioselect',
            selectionStart: this.radio.length,
            selectionEnd: this.radio.length
          }
        }
      }
    },
    async mounted () {
      let S = start()
      this.formulasList = await formulasList().then(async (val) => {
        S = start()
        this.simStrings = await simString(val[ 0 ].result)
        end(S, 'this.simStrings = await simString(\'\')')
        return val
      })
      end(S, 'let list = await formulasList()')
      this.username = (await own()).name
      this.onSelectBlockFirst()
      this.ready = true
      setInterval(() => {
        this.costCalc.cost = this.costCalc.cost + 100
      }, 100)
    },
    components: {
      FormulasBlock, katex, GuxInput
    },
    computed: {},
    watch: {
      formulasInput: function (val) {
        if (val.eventName === 'radioselect') return
        else if (val.eventName === 'keydown') this.keydownDetector()
        else if (val.eventName === 'blockselect') this.keydownDetector()
        else if (val.eventName === 'shortcutselect') this.keydownDetector()
        else if (val.eventName === 'savepos') return
        else return
      }
    }
  }
</script>
<style lang="scss">
  @import "src/scss/color.scss";

  .el-radio-button__inner {
    font-size: 0.5em;
    border: 2px solid transparent;
    padding: 2px;
    margin: 0 5px 5px 0;
    transition: none;
  }

  .el-radio-button {
    &:first-child .el-radio-button__inner {
      border-left: none
    }
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    background-color: transparent;
    border: 2px solid $color-success;
    -webkit-border-radius: 4px;
  }

  .el-textarea__inner {
    font-size: 2em;
  }

  .workspace {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;
    flex-direction: column;
    display: flex;
    flex: auto;
    .utils {
      &:focus {
        outline: none
      }
      padding: 20px;
      flex: none;
      box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
      .signbar {
        margin: 0 0 10px 0;
      }
      .formulas-preview {
        margin: 10px 0 10px 0;
        padding: 10px;
        border: 4px solid $color-danger;
        border-radius: 4px;
        text-align: center;
        font-size: 2em;
      }
      .simstring-wrap {
        .simstring-kind {
          display: block;
        }
      }
    }
    .complement {
      flex: auto;
      &:focus {
        outline: none
      }
      padding: 20px;
      .formulas-block-wrap {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: stretch;
        .formulas-block {
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
      .selector {
        display: none;
        position: absolute;
        background: rgba(255, 0, 0, 0.2);
        border: solid 2px rgb(255, 0, 0);
      }
    }
  }
</style>

<!--toggleItems(items, selected) {-->
<!--items.forEach(item => item.selected = selected === undefined ? !item.selected: selected )-->

<!--}-->

<!--toggleItems([item])-->
