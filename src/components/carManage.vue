<template>
  <div>
    <el-container>
      <el-aside class="left">
        <el-tree :props="props" :load="loadNode" lazy ref="tree" node-key="id" highlight-current
          :default-expanded-keys="['00000000-0000-0000-0000-000000000000']" @node-click="handleNodeClick">
        </el-tree>
      </el-aside>
      <el-main>
        <h3>车辆管理</h3>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="handleAddCarType">新增车辆类型</el-button>
          <el-button type="primary" size="small" :disabled="editCarTypeDisable" @click="handleUpdateCarType">修改车辆类型
          </el-button>
          <el-button type="primary" size="small" :disabled="delCarTypeDisable" @click="handleDeleteCarType">删除车辆类型
          </el-button>
          <el-button type="primary" size="small" @click="handleAddCar">新增车辆</el-button>
          <el-button type="primary" size="small" :disabled="editCarDisable" @click="handleUpdateCar">修改车辆</el-button>
          <el-button type="primary" size="small" :disabled="delCarDisable" @click="handleDelCar">删除车辆</el-button>
        </div>
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" height="700px" @select="selectRow"
          @select-all="selectAll">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="carCode" label="车辆编码">
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

        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageNum" :page-sizes="[5, 10, 20, 30, 50]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>

    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" v-if="formType === 0">
        <el-form-item label="类型编码" :label-width="formLabelWidth" prop="carTypeCode">
          <el-input v-model="form.carTypeCode" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" prop="carTypeName">
          <el-input v-model="form.carTypeName" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="上级类型" :label-width="formLabelWidth" prop="carTypeParent">
          <treeselect v-model="form.carTypeParent" :options="options" valueFormat="node" :load-options="loadOptions" />
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
          <treeselect v-model="carForm.careType" :options="options" valueFormat="node" :load-options="loadOptions"
            @select="handleTreeSelected" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import {
  getCarType,
  updateCarType,
  addCarType,
  deleteCaarType,
  addCar,
  getCar,
  updateCar,
  deleteCar,
} from '../api.js'
import { getFamateDate } from '../utils'

export default {
  components: {
    Treeselect,
  },
  watch: {
    selection(selection) {
      this.isDelCarDisable(selection)
      this.isEditCarDisable(selection)
    },
  },
  mounted() {
    this.getCar()
    // this.$nextTick(() => {
    //   document.querySelector('.el-tree-node__content').click()
    // })
    console.log('tree', this.$refs.tree)
  },
  data() {
    return {
      pageSize: 5,
      pageNum: 1,
      total: 0,
      props: {
        label: 'carTypeName',
        children: 'zones',
        isLeaf: 'leaf',
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
        ],
        careType: [
          { required: true, message: '请选择车辆类型', trigger: 'blur' },
        ],
      },
      options: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
          carTypeName: '车辆类型',
          carTypeCode: '00',
          children: null,
        },
      ],
      formLabelWidth: '120px',
      form: {
        id: '',
        carTypeParent: {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
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
      tableData: [],
      dialogTitle: '新增车辆类型',
      dialogVisible: false,
      nodeObj: {},
      updateTypeObj: {},
      updateCarId: '',
      isAdd: true,
      delParam: {
        carBeans: [],
        cartypeIds: [],
      },
      selectTreeId: '',
      updateCartypeId: '',
      selection: [],
    }
  },
  methods: {
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
        center: true,
      })
        .then(() => {
          this.delParam.carBeans = [value]
          deleteCar(this.delParam).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getCar()
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
        center: true,
      })
        .then(() => {
          deleteCar(this.delParam).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getCar()
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
      this.getCar()
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.getCar()
    },
    handleAddCarType() {
      this.dialogVisible = true
      this.dialogTitle = '新增车辆类型'
      this.formType = 0
      this.isAdd = true
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
          this.$refs.form.resetFields()
          this.$refs.tree.append(res.data.data, res.data.data.carTypeParent)
          this.$refs.tree.getNode(res.data.data.carTypeParent).loaded = false
          this.$refs.tree.getNode(res.data.data.carTypeParent).expand()
          this.$refs.tree.setCurrentKey(res.data.data.id)
          this.nodeObj = this.$refs.tree.getCurrentNode()
        } else {
          this.$message({
            type: 'error',
            message: '添加失败',
          })
        }
      })
    },
    handleUpdateCarType() {
      this.dialogVisible = true
      this.dialogTitle = '修改车辆类型'
      this.formType = 0
      this.isAdd = false
      let obj = {
        carTypeCode: '',
        carTypeName: '',
        carTypeParent: {
          id: '',
          label: '',
        },
      }
      obj.carTypeCode = this.nodeObj.carTypeCode
      obj.carTypeName = this.nodeObj.carTypeName
      obj.carTypeParent.id = this.nodeObj.carTypeParent
      obj.carTypeParent.label = this.nodeObj.carParentName
      this.form = obj
    },
    updateCarType() {
      let param = {
        carTypeCode: this.form.carTypeCode,
        carTypeName: this.form.carTypeName,
        carTypeParent: this.nodeObj.carTypeParent,
        id: this.nodeObj.id,
      }
      updateCarType(param).then((res) => {
        if (res.data.status === 200) {
          this.refreshNode(param.carTypeParent)
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.dialogVisible = false
          this.$refs.form.resetFields()
        } else {
          this.$message({
            type: 'error',
            message: '修改失败',
          })
        }
      })
    },
    handleAddCar() {
      document.querySelector('.car-tree').click()

      this.dialogVisible = true
      this.dialogTitle = '新增车辆信息'
      this.formType = 1
      this.isAdd = true
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
          this.getCar()
        } else {
          this.$message({
            type: 'error',
            message: '添加失败',
          })
        }
      })
    },
    handleRowEdit(row) {
      this.nodeObj = row
      this.updateTypeObj = row
      this.updateCarId = row.id
      this.updateCartypeId = row.careTypeId
      this.dialogVisible = true
      this.dialogTitle = '修改车辆信息'
      this.formType = 1
      this.isAdd = false
      let obj = {
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
    handleUpdateCar() {
      this.dialogTitle = '修改车辆信息'
      this.formType = 1
      this.isAdd = false
      this.dialogVisible = true
      let obj = {
        carCode: this.updateTypeObj.carCode,
        carName: this.updateTypeObj.carName,
        carBuyTime: this.updateTypeObj.carBuyTime,
        carBuyMonery: this.updateTypeObj.carBuyMonery,
        rentState: this.updateTypeObj.rentState,
        carNumber: this.updateTypeObj.carNumber,
        careType: {
          id: this.updateTypeObj.careTypeId,
          label: this.updateTypeObj.careTypeName,
        },
      }
      this.carForm = obj
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
          this.updateTypeObj.careTypeName || this.updateTypeObj.carTypeName,
        careTypeCode:
          this.updateTypeObj.careTypeCode || this.updateTypeObj.carTypeCode,
        careTypeId: this.updateCartypeId,
        id: this.updateCarId,
      }
      updateCar(param).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.getCar()
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
        center: true,
      })
        .then(() => {
          this.delParam.carBeans = [...this.tableData]
          deleteCar(this.delParam).then((res) => {
            if (res.status === 200) {
              deleteCaarType(this.nodeObj).then((res) => {
                if (res.data.status === 200) {
                  this.$refs.tree.remove(this.nodeObj.id)

                  this.focusNode(this.nodeObj.carTypeParent)
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
      this.selection = selection
      this.delParam.carBeans = selection
      this.nodeObj = row
      this.updateTypeObj = row
      this.updateCarId = row.id
      this.updateCartypeId = row.careTypeId
    },
    selectAll(selection) {
      this.delParam.carBeans = selection
    },
    cancleDialog() {
      this.dialogVisible = false
      this.form = {
        id: '',
        carTypeParent: {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
        },
      }
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
      console.log('node')
      this.selectTreeId = node.id
      this.nodeObj = node
      this.form.carTypeParent.id = node.carTypeParent
      this.form.carTypeParent.label = node.carParentName
      this.carForm.careType.id = node.id
      this.carForm.careType.label = node.carTypeName
      this.carForm
      this.editCarTypeDisable = false
      getCar({
        cartypeId: this.nodeObj.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchText: '',
      }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.delCarTypeDisable = this.isRended(this.tableData)
        }
      })
    },
    handleTreeSelected(node) {
      this.nodeObj = node
      this.updateTypeObj = node
      this.updateCartypeId = node.id
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
            return resolve(res.data.data)
          }
        })
      }
      if (node.level > 1) {
        getCarType(data).then((res) => {
          if (res.data.status === 200) {
            return resolve(res.data.data)
          }
        })
      }
    },
    isRended(data) {
      return data.some((item) => item.rentState === '已租赁')
    },
    getDelRowDisabled(rentState) {
      return rentState === '已租赁' ? true : false
    },
    refreshNode(id) {
      let node = this.$refs.tree.getNode(id)
      node.loaded = false
      node.expand()
    },
    focusNode(parentId) {
      let parent = this.$refs.tree.getNode(parentId)
      let ids = parent.childNodes.map((item) => item.data.id)
      if (ids.length !== 0) {
        this.$refs.tree.setCurrentKey(ids[0])
      } else {
        this.$refs.tree.setCurrentKey(parentId)
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
</style>
