<template>
  <div v-if="!ready"
       v-loading.body="!ready"
       element-loading-text="拼命加载中"
       class="page-loading">
  </div>
  <div class="workspace" v-else>
    <el-row class="utils"
            @keydown.ctrl.65.prevent="onSelectBlockAll"
            @keydown.meta.65.prevent="onSelectBlockAll"
            @keydown.alt.65.prevent="onSelectBlockNone"
            @keydown.meta.68.native.prevent="onDelete"
            @keydown.ctrl.68.native.prevent="onDelete"
            @keydown.meta.90.native.prevent="onRevoke"
            @keydown.ctrl.90.native.prevent="onRevoke"
            @mousedown.native="focusInput"
            tabindex="0">
      <el-row class="signbar">
        <el-col>
          <el-button
            size="small"
            type="normal"
            v-for="item in this.shortcuts"
            @click.native.prevent.stop="onShortCutSelect($event, item)"
            :key="item.value">
            <MathEditor :value="item.value">
            </MathEditor>
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <MathEditor
            ref="MathEditor"
            type="edit"
            :value="formulasInput.value"
            class="MathEditor"
            @input="formulasInput = {value: arguments[0],eventName: 'keydown'}"
            placeholder="请输入内容"
            icon="search"
            @keydown.ctrl.65.native.stop.prevnet="onSelectBlockAll"
            @keydown.meta.65.native.stop.prevent="onSelectBlockAll"
            @keydown.alt.65.native.stop.prevent="onSelectBlockNone"
            @keydown.enter.native.stop.prevent="onSubmit"
            tabindex="0">
          </MathEditor>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-radio-group v-model="radio" style="width: 100%" @change="onSimStringChange">
            <el-table
              :data="[{type: '短公式',items: 'short'}, {type: '中公式',items: 'middle'}, {type: '长公式',items: 'long'}]"
              style="width: 100%"
              :show-header="false">
              <el-table-column
                prop="type"
                label="种类"
                width="100">
              </el-table-column>
              <el-table-column
                prop="items"
                label="公式">
                <template scope="scope">
                  <el-radio v-for="(item, index) in simStrings[scope.row.items]" :key="index" :label="item">
                    <template>
                      <KaTex :expr="item"></KaTex>
                    </template>
                  </el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-tag>{{username}} {{ (costCalc.cost / 1000.0).toFixed(1) + 's' }}</el-tag>
          <el-button type="primary" icon="view"
                     @click.stop="zoom = zoom < 1.5 ? zoom+0.1 : zoom;focusInput()"></el-button>
          <el-button type="danger" icon="minus"
                     @click.stop="zoom = zoom > 0.5 ? zoom-0.1 : zoom;focusInput()"></el-button>
        </el-col>
      </el-row>
    </el-row>
    <div class="complement"
         @keydown.ctrl.65.prevent="onSelectBlockAll"
         @keydown.meta.65.prevent="onSelectBlockAll"
         @keydown.alt.65.prevent="onSelectBlockNone"
         @selectstart.prevent="onSelectStart"
         @select.prevent="onSelect"
         @mousemove.prevent="onMouseMove"
         @mousedown.prevent.stop="focusInput">
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
    </div>
  </div>
</template>
<script>
  import {formulasList, simString, own, formulasSubmit, formulasDelete} from 'src/api/math.js'

  import FormulasBlock from './FormulasBlock.vue'
  import KaTex from 'src/components/common/KaTex.vue'
  import GuxInput from 'src/components/common/GuxInput.vue'
  import MathEditor from 'src/components/common/MathEditor.vue'

  import * as REdetector from 'src/utils/REdetector.js'
  import {start, end} from 'src/utils/execution.js'

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
          eventName: 'keydown'
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
        }, {
          value: '\\ge',
          display: '\\ge',
          pos: 3
        }, {
          value: '\\neq',
          display: '\\neq',
          pos: 4
        }, {
          value: '\\le',
          display: '\\le',
          pos: 3
        }, {
          value: '\\sim',
          display: '\\sim',
          pos: 4
        }, {
          value: '\\pi',
          display: '\\pi',
          pos: 3
        } ],
        historyStack: [],
        costCalc: {
          cost: 0,
          startTime: new Date().getTime()
        }
      }
    },
    methods: {
      // keydownDetector: 检测按键，用debounce减少按键触发simstring的post请求
      keydownDetector: debounce(async function () {
        this.keydown = false
        this.simStrings = await simString(this.formulasInput.value)
      }, 500),
      // onSimStringChange: 当选择simstring时不触发simstring的post更新
      onSimStringChange (e) {
        this.focusInput()
        this.changeInput('radioselect')
      },
      // onShortCutSelect: 按住快捷键时，在光标位置处插入转义公式，并且光标移到相应的位置
      onShortCutSelect (e, item) {
        this.focusInput()
        this.$refs.MathEditor.insert(item.value)
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
        this.blocks.block_before_shift = 0
        this.blocks.block_current = 0
        this.focusInput()
      },
      onSelectBlockNone (e) {
        for (let item of this.formulasList) item.status = ''
        this.blocks.block_current = -1
        this.blocks.block_before_shift = -1
        this.blocks.choices_num = 0
        this.focusInput()
        this.onSelectBlockFirst()
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
      },
      onSelectBlockMetaCtrl (e, formulas, index) {
        if ((REdetector.os.isMac && e.metaKey) || (!REdetector.os.isMac && e.ctrlKey)) {
          this.blocks.block_current = index
          if (formulas.status === '') {
            formulas.status = 'selected'
            this.blocks.choices_num++
          } else {
            formulas.status = ''
            this.blocks.choices_num--
          }
        }
        this.focusInput()
      },
      onSelectBlockFirst () {
        this.formulasList[ 0 ].status = 'selected'
        this.focusInput()
        this.formulasInput = {
          value: this.formulasList[ 0 ].result,
          eventName: 'blockselect'
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
              await formulasSubmit(data)
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
                await formulasDelete(data)
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
        setTimeout(() => this.$refs[ 'MathEditor' ].focus(), 0)
      },
      changeInput (eventName) {
        if (eventName === 'blockselect') {
          let value = this.blocks.block_before_shift <= -1 ? '' : this.formulasList[ this.blocks.block_before_shift ].result
          this.$refs.MathEditor.replace(value)
        } else if (eventName === 'radioselect') {
          this.$refs.MathEditor.replace(this.radio)
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
      this.$nextTick(function () {
        this.$refs.MathEditor.focus()
      })
    },
    components: {
      FormulasBlock, KaTex, GuxInput, MathEditor
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
<style lang="scss" scoped>
  @import "src/scss/color.scss";

  .el-row {
    margin-bottom: 10px;
  }

  .el-col {
    padding: 0 10px 0 10px;
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
      margin-bottom: 0;
      padding-top: 10px;
      box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
      .MathEditor {
      }
    }
    .complement {
      flex: auto;
      &:focus {
        outline: none
      }
      overflow-y: scroll;
      padding: 10px;
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
