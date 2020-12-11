<template>
  <div>
    <Modal
      v-model="modalShow"
      :title="title"
      :width="modalWidth"
      @on-ok="handleOK"
    >
      <div class="modal">
        <div class="modal-left">
          <select-tree @on-select="handleTreeSelect"></select-tree>
        </div>
        <div class="modal-right">
          <select-table
            :multiple="multiple"
            :tree-node="currTreeNode"
            :table-data="tableData"
            @on-select="handleSelect"
          ></select-table>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import SelectTable from './SelectTable'
import SelectTree from './SelectTree'
export default {
  components: {
    SelectTable,
    SelectTree,
  },

  computed: {
    modalShow: {
      get() {
        return this.visable
      },
      set(val) {
        if (val === true) {
          this.$emit('on-show')
        } else {
          this.$emit('on-close')
        }
      },
    },
  },

  props: {
    visable: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '基础数据选择',
    },
    modalWidth: {
      type: [Number, String],
      default: 900,
    },
    tableData: {
      type: Array,
      default: () => {},
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currTreeNode: null,
      selection: [],
    }
  },

  methods: {
    handleTreeSelect(nodes, node) {
      this.currTreeNode = node
      // this.tableData = nodes
      this.$emit('on-tree-click', nodes)
    },
    // 表格值选择
    handleSelect(selection) {
      this.selection = [...selection]
      this.$emit('on-select', selection)
    },
    handleOK() {
      this.$emit('on-ok', this.selection)
    },
  },
}
</script>

<style lang='less' scoped>
.modal {
  background: #f5f7f9;
  width: 100%;
  height: 407px;
  // height: 550px;
  overflow: hidden;
  &-left {
    float: left;
    top: 0;
    width: 220px;
    height: 100%;
    background: white;
  }
  &-right {
    float: left;
    top: 0;
    margin-left: 5px;
    width: calc(~'100% - 225px');
    height: 100%;
    background: white;
  }
}
</style>