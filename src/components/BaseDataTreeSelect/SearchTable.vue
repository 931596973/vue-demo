<template>
  <div>
    <Input
      style="margin-bottom: 10px"
      v-model="text"
      search
      :placeholder="placeholder"
      @on-search="handleSearch"
    />
    <Table
      ref="table"
      :columns="tableColumns"
      :data="tableData"
      size="small"
      height="320"
      highlight-row
      @on-current-change="handleCurrentChange"
      @on-select="handleSelect"
      @on-selection-change="handleSelectionChange"
      @on-row-click="handleRowClick"
    ></Table>
    <Page
      class-name="page-class"
      :total="page.total"
      :current="page.current"
      :page-size="page.pageSize"
      show-elevator
      show-sizer
      show-total
      @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入要查询的内容',
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
      text: '',
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '代码',
          key: 'id',
        },
        {
          title: '名称',
          key: 'title',
        },
      ],
      page: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    }
  },
  methods: {
    handleSearch() {
      console.log('wokanzhujunjieshabiliaozhujunjianwoyingrushi')
    },
    handleCurrentChange() {},
    handleSelectionChange() {},
    handleSelect(selection, row) {
      // let _selection = []
      // if (this.multiple) {
      //   _selection = SEDU.Util.deepCopy(this.selection)
      //   if (!this.isSelected(row)) {
      //     _selection.push(SEDU.Util.deepCopy(row))
      //   }
      // } else {
      //   _selection.push(SEDU.Util.deepCopy(row))
      // }
      // this.updateCheckedStatus(_selection, true)

      if (this.multiple) {
        let tmp = selection.map((item) => {
          item._checked = true
          return item
        })
        this.$emit('on-select', tmp)
      } else {
        let obj = { ...row }
        obj._checked = true
        this.$emit('on-select', [obj], row)
      }
    },
    handleRowClick() {},
    handlePageChange() {},
    handlePageSizeChange() {},
  },
}
</script>

<style lang='less' scoped>
.page-class {
  text-align: right;
  margin-top: 10px;
}
</style>