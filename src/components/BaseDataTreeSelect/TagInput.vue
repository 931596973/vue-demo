
<template>
  <div>
    <div
      v-if="!multiple"
      class="tag-input-single"
      :id="singleInputId"
      @click="openModal"
      @mouseenter="hasMouseHover = true"
      @mouseleave="hasMouseHover = false"
    >
      <Input
        :value="text"
        style="width:100%; height:100%;"
        readonly
        :disabled="disabled"
        :placeholder="placeholder"
      />
      <i
        class="ivu-icon ivu-icon-ios-close-circle tag-input-arrow"
        v-if="resetSelect"
        @click.stop="onClear"
      />
      <i
        class="ivu-icon ivu-icon-ios-more tag-input-arrow"
        style="font-size: 15px;"
        v-if="!resetSelect"
        @click="openModal"
      />
    </div>
    <div v-else>
      <select-multiple
        :selection="selection"
        formate="title"
        @on-select-click="handleSelectClick"
        @on-close-tag="handleCloseTag"
      ></select-multiple>
    </div>
  </div>
</template>
<script>
import Emitter from 'iview/src/mixins/emitter'
import Locale from 'iview/src/mixins/locale'
import SelectMultiple from './SelectMultiple'
export default {

  mixins: [Emitter, Locale],
  components: {
    SelectMultiple
  },

  props: {
    text: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Array,
      default: () => [],
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    maxTagCount: {
      type: Number,
    },
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      singleInputId: '',
      hasMouseHover: false, // 是否可以显示close图标
    }
  },
  computed: {
    resetSelect: {
      get: function () {
        if (this.multiple) {
          return false
        }
        return this.selection && this.clearable && this.hasMouseHover
      },
    },
  },
  mounted() {
    this.$nextTick(() => this.listernSingleDiv())
  },
  methods: {
    listernSingleDiv() {
      let elm = document.getElementById(this.singleInputId)
      if (!elm) {
        return
      }
      elm.onmouseover = () => (this.hasMouseHover = true)
      elm.onmouseout = () => (this.hasMouseHover = false)
    },
    openModal() {
      if (this.disabled) return
      this.$emit('on-button-click')
    },
    onClear() {
      this.$emit('on-clear', event, name)
    },
    handleSelectClick(){
      this.$emit('on-select-click')
    },
    handleCloseTag(index, item) {

    }

  
  },
}
</script>

<style lang="less" scoped>
.tag-input-single {
  min-height: 32px;
  width: 100%;
  position: relative;

  .ivu-input-default {
    padding-right: 25px;
  }
}

.tag-input-multiple {
  min-height: 32px;
  width: 100%;
  background: white;
  border: 1px solid rgb(215, 221, 228);
  border-radius: 6px;
  position: relative;
}

.tag-input-multiple-disabled {
  background-color: #f3f3f3;
  opacity: 1;
  cursor: not-allowed;
  color: #ccc;
}

.tag-input-multiple-disabled:hover {
  border: 1px solid rgb(215, 221, 228);
}

.tag-input-shade {
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  height: 100%;
  position: absolute;
  background: #ccc;
  opacity: 0.2;
  z-index: 1;
  cursor: not-allowed;
}

.tag-input-container {
  float: left;
  overflow: hidden;
  padding-left: 5px;
  cursor: text;
}

.tag-input-arrow {
  position: absolute;
  top: 50%;
  right: 8px;
  line-height: 1;
  transform: translateY(-50%);
  font-size: 14px;
  color: #808695;
  transition: all 0.2s ease-in-out;
}

.tag-input-button-container {
  overflow: hidden;
  background-color: #eee;
  height: 100%;
  width: 35px;
  border-left: 1px solid rgb(215, 221, 228);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  position: absolute;
  right: 0px;
  padding-left: 10px;
  button {
    border-color: rgba(0, 0, 0, 0);
    background-color: #eee;
    font-size: 13px;
  }
}
</style>