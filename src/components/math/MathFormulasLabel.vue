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
            @click.native="focusInput"
            tabindex="0">
      <el-col :span="6">
        <el-row class="signbar">
          <el-button v-for="item in this.shortcuts"
                     @click.native.prevent.stop="formulasInput = {value: formulasInput.value + item, eventName: 'shortcutClick'};"
                     :key="item">
            <katex :expr="item"></katex>
          </el-button>
        </el-row>
        <el-input
          class="my-autocomplete"
          type="textarea"
          autosize
          :value="formulasInput.value"
          @input="formulasInput = {value: arguments[0],eventName: 'keydown'}"
          placeholder="请输入内容"
          icon="search"
          @keydown.ctrl.65.native.prevnet="onSelectBlockAll"
          @keydown.meta.65.native.prevent="onSelectBlockAll"
          @keydown.alt.65.native.prevent="onSelectBlockNone"
          autofocus
          tabindex="0">
        </el-input>
        <div class="formulas-preview">
          预览：
          <katex :expr="formulasInput.value"></katex>
        </div>
        <el-tag>{{username}}</el-tag>
        <el-button type="primary" icon="plus" @click.stop="zoom = zoom < 1.5 ? zoom+0.1 : zoom"></el-button>
        <el-button type="danger" icon="minus" @click.stop="zoom = zoom > 0.5 ? zoom-0.1 : zoom"></el-button>
      </el-col>
      <el-col :span="18" class="simstring-wrap">
        <el-radio-group v-model="radio" class="simstring-kind">
          <el-radio-button v-for="(item, index) in simStrings.short" :key="index" :label="item">
            <template>
              <div class="el-button el-button--mini">
                <katex :expr="item"></katex>
              </div>
            </template>
          </el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="radio" class="simstring-kind">
          <el-radio-button v-for="(item, index) in simStrings.middle" :key="index" :label="item">
            <template>
              <div class="el-button el-button--mini">
                <katex :expr="item"></katex>
              </div>
            </template>
          </el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="radio" class="simstring-kind">
          <el-radio-button v-for="(item, index) in simStrings.long" :key="index" :label="item">
            <template>
              <div class="el-button el-button--mini">
                <katex :expr="item"></katex>
              </div>
            </template>
          </el-radio-button>
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
      <div class="formulas-block-wrap" :style="{zoom: zoom}">
        <FormulasBlock
          class="formulas-block"
          v-for="(formulas, index) in formulasList"
          :formulas="formulas"
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
  import {formulasList, simString, own} from '@/api/math.js'
  import FormulasBlock from './FormulasBlock.vue'
  import katex from '../common/KaTex.vue'
  import * as REdetector from '@/utils/REdetector.js'
  import { start, end } from '@/utils/execution.js'
  import debounce from 'lodash/debounce'

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
        shortcuts: [ '\\div', '\\times', '\\sum', '\\frac{x}{y}', '^{\\circ}' ],
        historyStack: []
      }
    },
    methods: {
      keydownDetector: debounce(async function () {
        this.keydown = false
        this.simStrings = await simString(this.formulasInput.value)
        if (this.simStrings.long.length !== 0 || this.simStrings.middle.length !== 0 || this.simStrings.short.length !== 0) this.historyStack.push(this.formulasInput)
      }, 500),
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
      },
      onSelectBlockAll (e) {
        if ((REdetector.os.isMac && e.metaKey) || (!REdetector.os.isMac && e.ctrlKey)) {
          for (let item of this.formulasList) {
            item.status = 'selected'
          }
        }
        this.blocks.choices_num = this.formulasList.length
        this.focusInput()
      },
      onSelectBlockNone (e) {
        for (let item of this.formulasList) item.status = ''
        this.blocks.block_current = -1
        this.blocks.block_before_shift = -1
        this.blocks.choices_num = 0
        this.focusInput()
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
      },
      onRevoke (e) {
        this.focusInput = this.historyStack.pop()
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
      focusInput () {
        setTimeout(function () {
          document.getElementsByClassName('el-textarea__inner')[ 0 ].focus()
        }, 0)
      }
    },
    async mounted () {
      let S = start()
      let list = await formulasList()
      end(S, 'let list = await formulasList()')
      this.username = (await own()).name
      for (let item of list) {
        item.status = ''
      }
      this.formulasList = list
      S = start()
      this.simStrings = await simString('')
      end(S, 'this.simStrings = await simString(\'\')')
      this.ready = true
    },
    components: {
      FormulasBlock, katex
    },
    computed: {},
    watch: {
      formulasInput: function (val) {
        if (val.eventName === 'radioselect') return
        else this.keydownDetector()
      },
      radio: function () {
        this.formulasInput = { value: this.radio, eventName: 'radioselect' }
      }
    }
  }
</script>
<style lang="scss">
  @import "src/scss/color.scss";

  .el-radio-button__inner {
    font-size: 0.5em;
    border: none;
    padding: 2px;
    margin: 0 5px 5px 0;
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
        padding: 20px;
        border: 4px solid $color-danger;
        border-radius: 4px;
        text-align: center;
      }
      .simstring-wrap {
        .simstring-kind {
          margin-top: 15px;
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
        align-items: flex-start;
        align-content: flex-start;
        .formulas-block {
          width: 200px;
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
