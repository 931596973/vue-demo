<template>
  <div style="height:100%;overflow:hidden">
    <el-container>
      <el-aside class="left">
        <!-- <el-tree :props="props" :load="loadNode" lazy ref="tree" node-key="id" highlight-current
          :default-expanded-keys="defaultExpandedKeys" @node-click="handleNodeClick">
        </el-tree> -->
      </el-aside>
      <el-main>
        <h3>车辆管理</h3>
        <div>
          <el-button type="primary" size="small" @click="handleAddCarType">新增车辆类型</el-button>
          <el-button type="primary" size="small" :disabled="editCarTypeDisable" @click="handleUpdateCarType">修改车辆类型
          </el-button>
          <el-button type="primary" size="small" :disabled="delCarTypeDisable" @click="handleDeleteCarType">删除车辆类型
          </el-button>
          <el-button type="primary" size="small" @click="handleAddCar">新增车辆</el-button>
          <el-button type="primary" size="small" :disabled="editCarDisable" @click="handleUpdateCar">修改车辆</el-button>
          <el-button type="primary" size="small" :disabled="delCarDisable" @click="handleDelCar">删除车辆</el-button>
        </div>
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%"  @select="selectRow"
          @select-all="selectAll">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column  label="车辆编码">
            <template v-slot="scope">
              <template>{{scope.row.carCode}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="carName" label="名称">
          </el-table-column>
          <el-table-column prop="carNumber" label="车牌号">
          </el-table-column>
          <el-table-column prop="carBuyTime" label="购买日期">
          </el-table-column>
          <el-table-column prop="carBuyMonery" label="购买价格">
          </el-table-column>
          <el-table-column prop="rentState" label="租赁状态">
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button @click="handleRowEdit(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="handleRowDel(scope.row)" type="text" size="small"
                :disabled="getDelRowDisabled(scope.row.rentState)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pageShow" class="pagination" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
    </el-container>

    <el-dialog custom-class="abow_dialog" :title="dialogTitle" destroy-on-close :visible.sync="dialogVisible"
      width="600px" @close="cancleDialog">
      <div class="el-dialog-div">
        <el-form :model="form" :rules="rules" ref="form" v-if="formType === 0">
          <el-form-item label="类型编码" :label-width="formLabelWidth" prop="carTypeCode">
            <el-input v-model="form.carTypeCode" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
          </el-form-item>
          <el-form-item label="类型名称" :label-width="formLabelWidth" prop="carTypeName">
            <el-input v-model="form.carTypeName" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
          </el-form-item>
          <el-form-item label="上级类型" :label-width="formLabelWidth" prop="carTypeParent">
            <treeselect v-model="form.carTypeParent" ref="treeSelect" :options="options" valueFormat="node"
              :appendToBody="true" :load-options="loadOptions" @select="handleTreeSelected" />
          </el-form-item>
        </el-form>
        <el-form :model="carForm" :rules="carRules" ref="carForm" v-if="formType === 1">
          <el-form-item label="车辆编码" :label-width="formLabelWidth" prop="carCode">
            <el-input v-model="carForm.carCode" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
          </el-form-item>
          <el-form-item label="车辆名称" :label-width="formLabelWidth" prop="carName">
            <el-input v-model="carForm.carName" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNumber">
            <el-input v-model="carForm.carNumber" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
          </el-form-item>
          <el-form-item label="购买日期" :label-width="formLabelWidth" prop="carBuyTime">
            <el-date-picker v-model="carForm.carBuyTime" type="date" placeholder="请选择购买日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="购买价格" :label-width="formLabelWidth" prop="carBuyMonery">
            <el-input v-model.number="carForm.carBuyMonery" autocomplete="off" placeholder="请输入车辆价格"></el-input>
          </el-form-item>
          <el-form-item label="租赁状态" :label-width="formLabelWidth">
            <el-radio-group v-model="carForm.rentState">
              <el-radio label="已租赁" disabled>已租赁</el-radio>
              <el-radio label="未租赁" disabled>未租赁</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="careType">
            <treeselect style="z-index:9999 !important" v-model="carForm.careType" :options="options" valueFormat="node"
              :load-options="loadOptions" :appendToBody="true" @select="handleTreeSelected" />
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import {
  getParentCarType,
  getCarType,
  updateCarType,
  addCarType,
  deleteCaarType,
  addCar,
  getCar,
  updateCar,
  deleteCar,
} from '../api.js'
import { getFamateDate, getSingleDelPage, getMultipleDelPage } from '../utils'

export default {
  components: {
    Treeselect,
  },
  watch: {
    selection(selection) {
      this.isDelCarDisable(selection)
      this.isEditCarDisable(selection)
    },
    nodeObj: {
      // handler(node) {
      //   Promise.all([this.getCarByType(node.id), getCarType(node)]).then(
      //     (res) => {
      //       let childrenNum = res[1].data.data.length
      //       if (
      //         node.id === '00000000-0000-0000-0000-000000000000' ||
      //         node.id === undefined
      //       ) {
      //         this.editCarTypeDisable = true
      //         this.delCarTypeDisable = true
      //       } else {
      //         if (childrenNum === 0) {
      //           this.editCarTypeDisable = false
      //           this.delCarTypeDisable = this.isRended(this.tableData)
      //         } else {
      //           this.delCarTypeDisable = true
      //           this.editCarTypeDisable = false
      //         }
      //       }
      //     }
      //   )
      // },
      // deep: true,
    },
  },
  created() {
    // this.getTableHeight()
    // this.getCar()
  },
  data() {
    return {
      pageShow: true,
      defaultExpandedKeys: ['00000000-0000-0000-0000-000000000000'],
      tableHeight: '',
      pageSize: 10,
      pageNum: 1,
      total: 0,
      props: {
        label: 'carTypeName',
        children: 'zones',
        isLeaf: 'isleaf',
      },
      radio: '未租赁',
      editCarDisable: true,
      editCarTypeDisable: true,
      delCarTypeDisable: true,
      delCarDisable: true,
      formType: 0,
      rules: {
        carTypeCode: [
          { required: true, message: '请输入车辆类型编码', trigger: 'blur' },
        ],
        carTypeName: [
          { required: true, message: '请输入车辆类型名称', trigger: 'blur' },
        ],
        carTypeParent: [
          { required: true, message: '请选择上级类型', trigger: 'blur' },
        ],
      },
      carRules: {
        carCode: [
          { required: true, message: '请输入车辆编码', trigger: 'blur' },
        ],
        carName: [
          { required: true, message: '请输入车辆名称', trigger: 'blur' },
        ],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
        ],
        carBuyTime: [
          { required: true, message: '请选择购买日期', trigger: 'blur' },
        ],
        carBuyMonery: [
          { required: true, message: '请输入车辆价格', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'change' },
        ],
        careType: [
          { required: true, message: '请选择车辆类型', trigger: 'blur' },
        ],
      },
      options: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
          children: null,
        },
      ],
      formLabelWidth: '120px',
      form: {
        carTypeCode: '',
        carTypeName: '',
        carTypeParent: {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
          children: null,
        },
      },
      carForm: {
        rentState: '未租赁',
        careType: {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
        },
        carBuyMonery: '',
        carBuyTime: '',
        carCode: '',
        carName: '',
        carNumber: '',
      },
      tableData: [{
        carCode:'lkasjdflkjsdlfjsldkfjskldfjslakdfjlsdaaadddddddddddddddddadddddddddddddddadadadadadadadadadadadadadadadaddsadjflkasdfjlkasdfj哈萨克倒海翻江阿萨德阿斯顿发生懒得发斯蒂芬垃圾'
      }],
      dialogTitle: '新增车辆类型',
      dialogVisible: false,
      nodeObj: {},
      updateCarObj: {},
      isAdd: true,
      delParam: {
        carBeans: [],
        cartypeIds: [],
      },
      selectTreeId: '',
      superCartypeId: '',
      updateTypeParentId: '',
      selection: [],
      treeParentId: '',
      carTypeObj: {},
      carFormTmp: {},
    }
  },
  methods: {
    getTableHeight() {
      this.tableHeight = window.innerHeight - 237 + 'px'
      window.onresize = (event) => {
        this.tableHeight = event.currentTarget.innerHeight - 237 + 'px'
        if (this.dialogVisible) {
          // document.querySelector('.el-dialog-div').style.maxHeight = '50vh'
          document.querySelector('.el-dialog').style.maxHeight = (window.innerHeight - 150) + 'px'

        }
      }
    },
    getCar(
      { cartypeId, pageNum, pageSize, searchText } = {
        cartypeId: '00000000-0000-0000-0000-000000000000',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchText: '',
      }
    ) {
      let param = {
        cartypeId,
        pageNum,
        pageSize,
        searchText,
      }
      getCar(param).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.list.map((item) => {
            item.carBuyTime = getFamateDate(item.carBuyTime)
            return item
          })
          this.total = res.data.total
          this.selection = []
        }
      })
    },
    handleRowDel(value) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delParam.carBeans = [value]
          deleteCar(this.delParam).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.pageNum = getSingleDelPage(
                this.pageNum,
                this.pageSize,
                this.total
              )
              this.getCar({
                cartypeId:
                  this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                searchText: '',
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    handleDelCar() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteCar(this.delParam).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.pageNum = getMultipleDelPage(
                this.pageNum,
                this.pageSize,
                this.total,
                this.delParam.carBeans.length
              )
              this.getCar({
                cartypeId:
                  this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                searchText: '',
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    handleSizeChange(sizi) {
      this.pageSize = sizi
      this.getCar({
        cartypeId: this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchText: '',
      })
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.getCar({
        cartypeId: this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchText: '',
      })
    },
    handleAddCarType() {
      this.dialogVisible = true
      this.dialogTitle = '新增车辆类型'
      this.formType = 0
      this.isAdd = true

      this.focusCarType()
    },
    focusNode(id) {
      setTimeout(() => {
        let tree = this.$refs.tree
        tree.setCurrentKey(id)
        this.nodeObj = { ...tree.getCurrentNode() }
      }, 500)
    },
    addFocusNode(id, parentId, node) {
      let tree = this.$refs.tree
      // tree.getNode(parentId).loaded = false
      // tree.getNode(parentId).expand()
      // tree.append(node, parentId)
      // this.focusNode(id)
      getParentCarType({
        id,
        carTypeName: '',
        carTypeCode: '',
        carTypeParent: parentId,
      }).then((res) => {
        if (res.status === 200) {
          console.log('res', res)
          let data = res.data.data
          tree.append(node, parentId)
          this.focusNode(id)
          this.defaultExpandedKeys = data
          // console.log('ttttt', this.$refs.tree)
          // data.forEach((item) => {
          // tree.getNode(item).expanded = true
          //   tree.getNode(parentId).loaded = false
          // })
        }
      })
    },
    addCarType() {
      let param = {
        carTypeCode: this.form.carTypeCode,
        carTypeName: this.form.carTypeName,
        id: '',
        carTypeParent: this.form.carTypeParent.id,
      }
      addCarType(param).then((res) => {
        if (res.data.status === 200) {
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          this.dialogVisible = false
          this.editCarTypeDisable = true
          this.$refs.form.resetFields()
          let id = res.data.data.id
          let parentId = res.data.data.carTypeParent
          let node = res.data.data
          this.addFocusNode(id, parentId, node)
        } else {
          this.$message({
            type: 'error',
            message: '添加失败',
          })
        }
      })
    },
    handleUpdateCarType() {
      this.dialogTitle = '修改车辆类型'
      this.formType = 0
      this.isAdd = false
      this.dialogVisible = true

      this.focusCarType()

      this.form.carTypeCode = this.nodeObj.carTypeCode
      this.form.carTypeName = this.nodeObj.carTypeName
    },
    updateCarType() {
      let param = {
        carTypeCode: this.form.carTypeCode,
        carTypeName: this.form.carTypeName,
        carTypeParent: this.updateTypeParentId,
        // id: this.superCartypeId,
        id: this.nodeObj.id,
      }
      updateCarType(param).then((res) => {
        if (res.data.status === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          // this.updateFocus(param)
          this.updateFocus(param.id, param.carTypeParent)
          this.dialogVisible = false

          // this.$refs.form.resetFields()
        } else {
          this.$message({
            type: 'error',
            message: '修改失败',
          })
        }
      })
    },
    handleAddCar() {
      this.dialogVisible = true
      this.dialogTitle = '新增车辆信息'
      this.formType = 1
      this.isAdd = true

      // let obj = {
      //   id: this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
      //   label: this.nodeObj.carTypeName || '00 车辆品牌'
      // }

      // this.carForm = {
      //   rentState: '未租赁',
      //   carBuyMonery: '',
      //   carBuyTime: '',
      //   carCode: '',
      //   carName: '',
      //   carNumber: '',
      // }
      // this.carForm.careType = obj

      // this.$nextTick(() => this.$refs.carForm.resetFields())

      this.focusCarType()
    },
    addCar() {
      let param = {
        id: '',
        carCode: this.carForm.carCode,
        carName: this.carForm.carName,
        carNumber: this.carForm.carNumber,
        carBuyTime: this.carForm.carBuyTime,
        carBuyMonery: this.carForm.carBuyMonery,
        rentState: this.carForm.rentState,
        careTypeId: this.carForm.careType.id,
        careTypeName: this.nodeObj.carTypeName,
        careTypeCode: this.nodeObj.carTypeCode,
      }
      addCar(param).then((res) => {
        if (res.data.status === 200) {
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          this.dialogVisible = false
          this.$refs.carForm.resetFields()

          this.pageNum = this.getLastPage()
          this.pageShow = false

          getCar({
            cartypeId:
              this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchText: '',
          }).then((res) => {
            if (res.status === 200) {
              this.$nextTick(() => {
                this.pageShow = true
              })

              this.tableData = res.data.list.map((item) => {
                item.carBuyTime = getFamateDate(item.carBuyTime)
                return item
              })
              this.total++
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '添加失败',
          })
        }
      })
    },
    beforeUpdateCar(row) {
      this.carTypeObj = { ...row }
      let obj = {
        id: row.id,
        carCode: row.carCode,
        carName: row.carName,
        carBuyTime: row.carBuyTime,
        carBuyMonery: row.carBuyMonery,
        rentState: row.rentState,
        carNumber: row.carNumber,
        careType: {
          id: row.careTypeId,
          label: row.careTypeName,
        },
      }
      this.carForm = obj
    },
    handleRowEdit(row) {
      console.log('row', row)
      this.dialogVisible = true
      this.dialogTitle = '修改车辆信息'
      this.formType = 1
      this.isAdd = false

      this.beforeUpdateCar(row)
      // this.updateCarObj = { ...row }
    },
    handleUpdateCar() {
      this.dialogTitle = '修改车辆信息'
      this.formType = 1
      this.isAdd = false
      this.dialogVisible = true

      this.beforeUpdateCar(this.carFormTmp)
      // let obj = {
      //   carCode: this.updateCarObj.carCode,
      //   carName: this.updateCarObj.carName,
      //   carBuyTime: this.updateCarObj.carBuyTime,
      //   carBuyMonery: this.updateCarObj.carBuyMonery,
      //   rentState: this.updateCarObj.rentState,
      //   carNumber: this.updateCarObj.carNumber,
      //   careType: {
      //     id: this.updateCarObj.careTypeId,
      //     label: this.updateCarObj.careTypeName,
      //   },
      // }
      // this.carForm = obj
    },
    updateCar() {
      let param = {
        carCode: this.carForm.carCode,
        carName: this.carForm.carName,
        carNumber: this.carForm.carNumber,
        carBuyTime: this.carForm.carBuyTime,
        carBuyMonery: this.carForm.carBuyMonery,
        rentState: this.carForm.rentState,
        careTypeId: this.carForm.careTypeId,
        careTypeName:
          this.carTypeObj.careTypeName || this.carTypeObj.carTypeName,
        careTypeCode:
          this.carTypeObj.careTypeCode || this.carTypeObj.carTypeCode,
        careTypeId: this.carTypeObj.careTypeId,
        id: this.carForm.id,
      }
      updateCar(param).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.getCar({
            cartypeId:
              this.nodeObj.id || '00000000-0000-0000-0000-000000000000',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchText: '',
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '修改失败',
          })
        }
      })
    },
    handleDeleteCarType() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delParam.carBeans = [...this.tableData]
          deleteCar(this.delParam).then((res) => {
            if (res.status === 200) {
              deleteCaarType(this.nodeObj).then((res) => {
                if (res.data.status === 200) {
                  // this.$refs.tree.remove(this.nodeObj.id)

                  this.delFocusNode(this.nodeObj.id, this.nodeObj.carTypeParent)
                  this.$message({
                    type: 'success',
                    message: '删除成功!',
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '删除失败!',
                  })
                }
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },

    selectRow(selection, row) {
      console.log('row', row)
      this.selection = selection
      this.delParam.carBeans = selection

      // this.updateCarObj = { ...row }
      this.carFormTmp = { ...row }
      // this.beforeUpdateCar(row)
    },
    selectAll(selection) {
      this.delParam.carBeans = selection
      this.selection = selection
    },
    cancleDialog() {
      this.dialogVisible = false

      if (this.formType === 0) {
        this.$refs.form.resetFields()
        this.form = {
          carTypeCode: '',
          carTypeName: '',
          carTypeParent: {
            id: '00000000-0000-0000-0000-000000000000',
            label: '00 车辆品牌',
            children: null,
          },
        }
      } else {
        this.$refs.carForm.resetFields()
        this.carForm = {
          rentState: '未租赁',
          careType: {
            id: '00000000-0000-0000-0000-000000000000',
            label: '00 车辆品牌',
          },
          carBuyMonery: '',
          carBuyTime: '',
          carCode: '',
          carName: '',
          carNumber: '',
        }
      }
    },
    confirmDialog() {
      // 车辆类型
      if (this.formType === 0) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.isAdd) {
              this.addCarType()
            } else {
              this.updateCarType()
            }
          } else {
            return false
          }
        })
        // 车辆
      } else if (this.formType === 1) {
        this.$refs.carForm.validate((valid) => {
          if (valid) {
            if (this.isAdd) {
              this.addCar()
            } else {
              this.updateCar()
            }
          } else {
            return false
          }
        })
      }
    },
    handleNodeClick(node) {
      console.log('node', node)
      this.nodeObj = { ...node }
      this.updateTypeParentId = node.carTypeParent

      this.selectTreeId = node.id
      this.superCartypeId = node.id
      this.treeParentId = node.carTypeParent

      let obj = {
        careType: {
          id: node.id,
          label: node.carTypeName,
        },
      }
      this.carForm.careType = obj.careType
      // this.carForm.careType.id = node.id
      // this.carForm.careType.label = node.carTypeName
      // this.getCarByType(node.id)
    },
    handleTreeSelected(node) {
      if (this.formType === 0) {
        // this.form.carTypeParent = {
        //   id: node.id,
        //   label: node.label,
        // }
      } else if (this.formType === 1) {
        this.carTypeObj = {
          careTypeName: node.carTypeName,
          careTypeCode: node.carTypeCode,
          careTypeId: node.id,
        }
      }

      console.log('node', node)
      this.updateCarObj = node
      this.updateTypeParentId = node.id
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getCarType(parentNode).then((res) => {
          if (res.data.status === 200) {
            parentNode.children = res.data.data.map((item) => {
              item.label = item.carTypeName
              item.children = null

              return item
            })
            callback()
          }
        })
      }
    },
    loadNode(node, resolve) {
      let { data } = node
      if (node.level === 0) {
        return resolve([
          {
            carTypeName: '00 车辆品牌',
            carTypeCode: '111',
            carTypeParent: '00000000-0000-0000-0000-000000000000',
            id: '00000000-0000-0000-0000-000000000000',
          },
        ])
      }

      if (node.level === 1) {
        data.id = data.carTypeParent
        getCarType(data).then((res) => {
          if (res.data.status === 200) {
            return resolve(
              res.data.data.map((item) => {
                if (item.isleaf === 0) {
                  item.isleaf = true
                } else {
                  item.isleaf = false
                }
                return item
              })
            )
          }
        })
      }
      if (node.level > 1) {
        getCarType(data).then((res) => {
          if (res.data.status === 200) {
            return resolve(
              res.data.data.map((item) => {
                if (item.isleaf === 0) {
                  item.isleaf = true
                } else {
                  item.isleaf = false
                }
                return item
              })
            )
          }
        })
      }
    },
    isRended(data) {
      if (data.length === 0) {
        return false
      } else {
        return data.some((item) => item.rentState === '已租赁')
      }
    },
    getDelRowDisabled(rentState) {
      return rentState === '已租赁' ? true : false
    },
    updateFocus(id, parentId) {
      this.focusNode(id)
      let node = this.$refs.tree.getNode(parentId)
      if (parentId !== this.nodeObj.id) {
        this.$refs.tree.remove(id)
      }
      // if (parentId !== this.treeParentId) {
      //   this.$refs.tree.remove(this.selectTreeId)
      // }
      node.loaded = false
      node.expand()
    },

    delFocusNode(id, parentId) {
      let tree = this.$refs.tree
      tree.remove(id)
      let parent = tree.getNode(parentId)
      let ids = parent.childNodes.map((item) => item.data.id)
      if (ids.length !== 0) {
        // tree.setCurrentKey(ids[0])
        // this.nodeObj = tree.getNode(ids[0])
        this.focusNode(ids[0])
        this.getCar({
          cartypeId: ids[0],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchText: '',
        })
      } else {
        this.getCar({
          cartypeId: parentId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchText: '',
        })
        this.focusNode(parentId)
        // tree.setCurrentKey(parentId)
        // this.nodeObj = tree.getNode(parentId)
      }
    },
    isDelCarDisable(selection) {
      if (selection.length === 0) {
        this.delCarDisable = true
      } else {
        if (selection.some((item) => item.rentState === '已租赁')) {
          this.delCarDisable = true
        } else {
          this.delCarDisable = false
        }
      }
    },
    isEditCarDisable(selection) {
      if (selection.length === 1) {
        this.editCarDisable = false
      } else {
        this.editCarDisable = true
      }
    },
    async getCarByType(id) {
      this.pageNum = 1
      this.pageSize = 10
      await getCar({
        cartypeId: id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchText: '',
      }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.list.map((item) => {
            item.carBuyTime = getFamateDate(item.carBuyTime)
            return item
          })
          this.total = res.data.total
        }
      })
      return this.tableData
    },
    focusCarType() {
      let carTypeParent = {
        id: this.nodeObj.id || '',
        label: this.nodeObj.carTypeName || '',
      }
      if (this.formType === 0) {
        if (this.nodeObj.id !== undefined) {
          this.form.carTypeParent = carTypeParent
        }
      } else if (this.formType === 1) {
        if (this.nodeObj.id !== undefined) {
          this.carForm.careType = carTypeParent
        }
      }
    },
    getLastPage() {
      let num = 0
      if (this.total >= this.pageSize) {
        num = this.total / this.pageSize
        if (num === Math.ceil(num)) {
          num = Math.ceil(num) + 1
        } else {
          num = Math.ceil(num)
        }
      } else {
        num = this.pageNum
      }
      return num
    },
  },
}
</script>

<style scoped>
.left {
  padding: 40px 0 0 40px;
}
.pagination {
  position: fixed;
  bottom: 40px;
  right: 20px;
}
.abow_dialog {
  height: 500px !important;
}
.el-dialog-div {
  max-height: 50vh;
  /* max-height: calc(100% - 15vh); */
  overflow: auto;
}

</style>
<style>
.vue-treeselect {
  z-index: 9999 !important;
}
.el-dialog {
  max-height: calc(100 - 150px);
  overflow: hidden;
}
</style>