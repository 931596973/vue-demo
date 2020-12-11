<template>
  <div class="basedata-select">
    <div
      class="ivu-select ivu-select-multiple ivu-select-default"
      v-if="multiple"
      @click="modalShow = true"
    >
      <div
        class="ivu-select-selection"
        style="min-height:32px"
      >
        <Icon
          class="select-icon"
          type="ios-more"
          @click="modalShow = true"
        />
        <span
          v-if="!selecteds.length"
          class="ivu-select-placeholder"
        >{{placeholder}}</span>
        <div class="select-tags">
          <div
            class="ivu-tag ivu-tag-checked"
            v-for="(item, index) in selecteds"
            :key="item.code"
          >
            <span class="ivu-tag-text">{{item.code}}</span>
            <i
              class="ivu-icon ivu-icon-ios-close"
              @click.stop="closeTag(index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <Input
      v-if="!multiple"
      :value="value"
       icon="ios-more"
      :placeholder="placeholder"
      :clearable="clearable"
      @on-click="setModalShow"
      @on-focus="setModalShow"
    />
    <Modal
      v-model="modalShow"
      title="基础数据选择"
      width="750"
      @on-ok="handleModalOK"
    >
      <Input
        style="margin-bottom: 10px"
        v-model="searchText"
        icon="ios-search"
        :placeholder="searchPlaceholder"
        @on-click="handleSearchClick"
      />
      <Table
        ref="table"
        :columns="tableColumns"
        :data="tableData"
        size="small"
        height="320"
        highlight-row
        @on-current-change="handleCurrentChange"
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
      />
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Array],
      required: true,
    },
    showCode: {
      type: [Boolean, String],
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    searchPlaceholder: {
      type: String,
      default: '请输入要查询的内容',
    },
    filterCode: {
      type: Array,
      default: () => []
    },
  },

  model: {
    prop: 'value',
    event: 'multiple-selected',
  },

  data() {
    return {
      modalShow: false,
      text: '',
      searchText: '',
      tableColumns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
        },
        {
          title: '代码',
          key: 'code',
        },
        {
          title: '名称',
          key: 'name',
        },
      ],
      tableData: [
        { code: '1', name: '狗' },
        { code: '2', name: '狗' },
        { code: '3', name: '狗' },
        { code: '4', name: '狗' },
        { code: '5', name: '狗' },
        { code: '6', name: '狗' },
        { code: '7', name: '狗' },
        { code: '8', name: '狗' },
        { code: '9', name: '狗' },
        { code: '10', name: '狗' },
        { code: '11', name: '狗' },
        { code: '12', name: '狗' },
        { code: '13', name: '狗' },
        { code: '14', name: '狗' },
        { code: '15', name: '狗' },
        { code: '16', name: '狗' },
        { code: '17', name: '狗' },
        { code: '18', name: '狗' },
        { code: '19', name: '狗' },
        { code: '20', name: '狗' },
      ],
      page: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      selection: [],
      selecteds: [],
      currentRow: {},
      currentRowId: '',
    }
  },

  created() {
    this.page.total = this.tableData.length
    this.getMultiple()
    this.filterData()
  },

  watch: {
    value: {
      handler(val) {
        if (Array.isArray(val)) {
          this.selection = this.tableData.filter((item) =>
            val.includes(item.code)
          )
        }
      },
      immediate: true,
    },
  },

  methods: {
    setModalShow() {
      this.modalShow = true
    },
    handleModalOK() {
      if (this.multiple) {
        this.selecteds = [...this.selection]
        let arr = this.selection.map((item) => item.code)
        this.$emit('multiple-selected', arr)
      } else {
        this.$emit('multiple-selected', this.currentRow.code)
      }
      this.modalShow = false
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleRowClick(row, index) {
      this.$refs.table.toggleSelect(index)
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow
      this.currentRowId = currentRow.code
    },
    closeTag(index) {
      this.selecteds.splice(index, 1)
      this.$refs.table.toggleSelect(index + 1)
    },
    handleSearchClick() {
      console.log('sss')
    },
    filterData() {
      if (this.filterCode) {
        this.tableData = this.tableData.filter((item) => {
          return !this.filterCode.includes(item.code)
        })
      }
    },
    getMultiple() {
      if (this.multiple) {
        this.tableColumns.unshift({
          type: 'selection',
          width: 50,
        })
      } else {
        this.tableColumns.unshift({
          title: ' ',
          width: 50,
          align: 'center',
          render: (h, params) => {
            let code = params.row.code
            let flag = false
            if (this.currentRowId === code) {
              flag = true
            } else {
              flag = false
            }
            let self = this
            return h('div', [
              h('Radio', {
                props: {
                  value: flag,
                },
                on: {
                  'on-change': () => {
                    self.currentRowId = code
                  },
                },
              }),
            ])
          },
        })
      }
    },
  },
}
</script>

<style  scoped>
.basedata-select {
}
.page-class {
  text-align: right;
  margin-top: 10px;
}
.select-icon {
  line-height: 32px;
  float: right;
}
.ivu-tag {
  height: 26px;
  line-height: 26px;
}
</style>