<template>
  <div>
    <tag-input
      :text="text"
      :multiple="multiple"
      :selection="selection"
      :clearable="clearable"
      :disabled="disabled"
      :placeholder="placeholder"
      :max-tag-count="maxTagCount"
      @on-tag-close="handleTagClose"
      @on-clear="handleClear"
      @on-select-click="handleClick"
    ></tag-input>
    <edit-modal
      :visable="modalShow"
      :title="title"
      :multiple="multiple"
      :table-name="tableName"
      :table-data="tableData"
      @on-show="modalShow = true"
      @on-close="modalShow = false"
      @on-tree-click="handleTreeClick"
      @on-select="handleSelect"
      @on-ok="handleOK"
    ></edit-modal>
  </div>
</template>

<script>
import TagInput from './TagInput'
import EditModal from './EditModal'
import util from './util'

export default {
  // computed: {
  //   tagValue: {
  //     get: function () {
  //       if (this.multiple) {
  //         return this.selection
  //       } else {
  //         return 0 == this.selection.length ? null : this.selection[0]
  //       }
  //     },
  //   },
  // },
  components: {
    TagInput,
    EditModal,
  },

  props: {
    value: {
      type: [String, Array],
      required: false,
    },
    tableName: {
      type: String,
      required: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    maxTagCount: {
      type: Number,
    },
    title: {
      type: String,
      require: true,
    },
    tableColumns: {
      type: Array,
      require: true,
    },
    tableKey: {
      type: String,
      default: () => 'id',
    },
    treeKey: {
      type: String,
      default: () => 'id',
    },
    fuzzySearchPlaceholder: {
      type: String,
      default: '',
    },
  },

  model: {
    prop: 'value',
    event: 'data-change',
  },

  data() {
    return {
      api: util,
      modalShow: false,
      selection: [],
      tableData: [],
      text: '',
    }
  },

  watch: {
    value: {
      handler(val) {
        if (Array.isArray(val)) {
        } else {
          // this.text = val.code + ' ' + val.tableName
          // this.text = 'gou'
        }
      },
      immediate: true,
    },
  },
  mounted(){
    console.log(this.multiple)
  },

  methods: {
    handleClick() {
      this.modalShow = true
    },
    handleTagClose() {},
    handleClear() {},
    handleTreeClick(nodes) {
      this.tableData = nodes
    },
    handleSelect(selection){
      console.log('select-selection', selection)

    },
    handleOK(selection) {
      this.selection = selection
      console.log('on-selection', selection)
      if (this.multiple) {
        this.$emit('data-change')
      } else {
        let obj = this.selection[0]
        let value = obj.id + ' ' + obj.title
        this.text = value
        this.$emit('data-change', value)
      }
    },
  },
}
</script>

<style lang='less' scoped>
</style>