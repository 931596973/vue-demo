<template>
  <div>
    <div class="left-select">
      <div style="margin-bottom: 20px; width: 100%;">
        <Checkbox
          :value="selection.length > 0"
          :disabled="selection.length == 0"
          @on-change="allCancel"
        />
        {{"已选（" + selection.length + ")条"}}
      </div>
      <div class="selected-view-content">
        <option-group :data="selection"></option-group>
      </div>
    </div>
    <div class="right-table">
      <search-table
        :multiple="multiple"
        :table-data="tableData"
        @on-select="handleSelect"
      ></search-table>
    </div>

  </div>
</template>

<script>
import SearchTable from './SearchTable'
import OptionGroup from './OptionGroup'
export default {
  components: {
    SearchTable,
    OptionGroup,
  },

  props: {
    treeNode: {
      type: Object,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selection: [], // 已选项
    }
  },
  methods: {
    allCancel() {
      this.selection.map((item) => {
        item._checked = false
      })
      this.selection = []
    },
    handleSelect(selection, row) {
      this.selection = [...selection]
      console.log('gggggg', selection)

      this.$emit('on-select', selection)
    },
  },
}
</script>

<style lang='less' scoped>
.left-select {
  width: 150px;
  height: 100%;
  float: left;
}
.right-table {
  width: calc(~'100% - 160px');
  margin-left: 10px;
  height: 100%;
  float: left;
}
</style>