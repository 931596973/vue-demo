
<template>
  <div class="div_dept">
    <Tree
      ref="_tree"
      :data="treeData"
      @on-select-change="onSelected"
    />
  </div>
</template>
<script>
export default {
  props: {
    api: {
      type: Object,
    },
    primaryKey: {
      type: String,
      require: true,
    },
    selectedId: {
      type: Array,
      default: () => [],
    },
    /**
     * 指定根节点id，可为空
     */
    rootId: {
      type: String,
    },
    /**
     * 指定根节点的数据类型， 可为空
     */
    rootType: {
      type: String,
    },
  },

  data() {
    return {
      innerValue: [],
      treeData: [
        {
          title: 'parent 1',
          id: 'caonima',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1',
                  id: '1-1-1',
                  expand: true,
                  children: [
                    {
                      title: '1-1-1-1',
                      id: '1-1-1-1',
                    },
                    {
                      title: '1-1-1-2',
                      id: '1-1-1-2',
                    },
                    {
                      title: '1-1-1-3',
                      id: '1-1-1-3',
                    },
                  ],
                },
                {
                  title: 'leaf 1-1-2',
                  id: '1-1-2',
                },
              ],
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1',
                },
                {
                  title: 'leaf 1-2-1',
                },
              ],
            },
          ],
        },
      ],
      allOrgTreeNode: [],
      allDeptNode: [],
      currSelectItem: null, // 记录当前选中项node信息
    }
  },

  watch: {
    selectedId: {
      handler: function (newVal) {
        this.initInnerValue(newVal)
      },
      deep: true,
    },
  },

  mounted() {
    // this.initTree()
  },

  methods: {
    // treeRender(h, { root, node, data }) {
    //   return h(
    //     'span',
    //     {
    //       style: {
    //         background: data.selected ? '#f8fafa' : null,
    //       },
    //     },
    //     [
    //       h('span', [
    //         h('i', {
    //           style: {
    //             marginRight: '8px',
    //           },
    //           attrs: {
    //             class: this.nodeIcon(data),
    //           },
    //         }),
    //       ]),
    //       h(
    //         'span',
    //         {
    //           style: {
    //             'font-style': data.enable ? null : 'italic',
    //             'font-size': '14px',
    //             color: data.selected
    //               ? '#369eff'
    //               : data.enable
    //               ? '#101317'
    //               : '#aaa',
    //             cursor: 'pointer',
    //           },
    //           on: {
    //             click: () => {
    //               this.onSelected(node, data)
    //             },
    //           },
    //         },
    //         data.title
    //       ),
    //     ]
    //   )
    // },
    initTree(orgId) {
      // this.api
      //   .initTree(this.rootId, this.rootType)
      //   .then((nodes) => {
      //     this.updateCurrSelectionSubNodes(nodes)
      //     this.treeData = Array.isArray(nodes) ? nodes : [nodes]
      //     this.initInnerValue(this.selectedId)
      //     this.setDefaultSelectStatus()
      //   })
      //   .catch((err) => {
      //     console.error(
      //       '复合选择组件左侧树数据初始化异常，cause by function initTree()' +
      //         JSON.stringify(err)
      //     )
      //   })

      function getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach((item) => {
            let obj = {}
            obj.title = item.text
            obj.expand = true
            obj.selected = false
            obj.id = item.id
            obj.children = getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      }

      let postData = {
        tableName: 'MD_DEPARTMENT',
      }
      let url = `/baseData/data/tree`
      GMS.$http
        .post(url, JSON.stringify(postData), {
          headers: {
            post: {
              'Content-Type': 'application/json',
            },
          },
        })
        .then((response) => {
          const { rows, rs, total } = response.data
          this.treeData = getTree(rows)
          console.log('treedata', this.treeData)
        })
        .catch(
          function (error) {
            console.log('获取配置文件错误')
          }.bind(this)
        )
    },
    initInnerValue(val) {
      // 这里是按多选逻辑处理的，但目前这里只会有单选，不会有多选
      let id = ''
      if (val) {
        this.innerValue = Array.isArray(val) ? val : [val]
        id = val
      } else {
        this.innerValue = []
      }
      if (!this.currSelectItem || this.currSelectItem[this.primaryKey] != id) {
        this.setInitSelectedSelectionState(id)
      }
      if (0 == this.innerValue.length) {
        this.currSelectItem = null
      }
    },
    setInitSelectedSelectionState(id) {
      let tree = this.$refs['_tree'] ? this.$refs['_tree'].stateTree : undefined
      if (!tree || tree.length == 0) {
        return
      }
      tree.map((node) => {
        let equal = this.isEqual(node, id)
        node.selected = equal
        if (equal) {
          this.updateNodeSelectionState(node)
        }
        if (node.children && node.children.length > 0) {
          this.updateTreeSelectionState(node.children, id)
        }
      })
    },
    isEqual(node, id) {
      return node[this.primaryKey] == id
    },
    setDefaultSelectStatus() {
      let node =
        this.treeData && this.treeData.length > 0 ? this.treeData[0] : null
      if (node && this.selectedId.length == 0) {
        this.updateNodeSelectionState(node)
        this.emitSelectEvent('on-select', node)
      }
    },
    loadData(item, callback) {
      item.children = []
      // this.api
      //   .loadTreeChildrenNode(item)
      //   .then((nodes) => {
      //     this.updateCurrSelectionSubNodes(nodes)
      //     callback(nodes)
      //   })
      //   .catch((err) => {
      //     console.error(
      //       '获取下级部门信息失败：' + JSON.stringify(XMLHttpRequest)
      //     )
      //     callback([])
      //   })
    },
    /**
     * 更新当前选中节点的下级节点
     */
    updateCurrSelectionSubNodes(nodes) {
      if (this.selectedId.length > 0) {
        nodes.map((value) => {
          let find = false
          this.selectedId.map((id) => {
            find = id == value[this.primaryKey]
          })
          if (find) {
            this.updateNodeSelectionState(value)
            return
          }
        })
      }
    },
    onSelected(nodes, node) {
      // if (this.api.treeNodeCanSelect && !this.api.treeNodeCanSelect(data)) {
      //   return
      // }
      // if (
      //   !this.currSelectItem ||
      //   this.currSelectItem[this.primaryKey] != data[this.primaryKey]
      // ) {
      //   this.updateNodeSelectionState(data)
      // this.emitSelectEvent('on-select', data)
      let children = node.children
      this.$emit('on-select', children, node)
    },
  },
  emitSelectEvent(eventName, node) {
    this.$emit(eventName, node[this.primaryKey], node)
  },
  updateNodeSelectionState(item) {
    if (this.currSelectItem) {
      this.$set(this.currSelectItem, 'selected', false)
    }
    this.currSelectItem = item
    if (item) {
      this.$set(this.currSelectItem, 'selected', true)
    }
  },
  nodeIcon(node) {
    // return this.api.getTreeNodeIcon ? this.api.getTreeNodeIcon(node) : ''
    return ''
  },
}
</script>

<style scoped>
.div_dept {
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  font-size: 13px;
}
</style>