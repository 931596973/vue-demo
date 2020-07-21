<template>
  <div>
    <el-container>
      <el-aside class="left" style="border: 1px sold #cccccc">
        <el-tree :props="props" :load="loadNode" lazy @node-click="handleNodeClick">
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
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @select="selectRow"
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
              <el-button @click="handleEdit(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="handleDel(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="1" :page-sizes="[5, 10, 20, 30, 50]" :page-size="5"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="form" :rules="rules" ref="form" v-if="formType === 0">
        <el-form-item label="类型编码" :label-width="formLabelWidth" prop="carTypeCode">
          <el-input v-model="form.carTypeCode" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" prop="carTypeName">
          <el-input v-model="form.carTypeName" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="上级类型" :label-width="formLabelWidth">
          <treeselect v-model="form.carTypeParent" :options="options" :load-options="loadOptions" />
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
          <el-date-picker v-model="carForm.carBuyTime" type="date" placeholder="请选择购买日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买价格" :label-width="formLabelWidth" prop="carBuyMonery">
          <el-input v-model="carForm.carBuyMonery" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="租赁状态" :label-width="formLabelWidth">
          <el-radio-group v-model="carForm.rentState">
            <el-radio label="已租赁" disabled>已租赁</el-radio>
            <el-radio label="未租赁" disabled>未租赁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="careTypeId">
          <treeselect v-model="carForm.careTypeId" :options="options" :load-options="loadOptions"
            @select="handleTreeSelected" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
  deleteCar
} from '../api.js'

export default {
  components: {
    Treeselect
  },
  computed: {
    total() {
      return this.tableData.length
    }
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      props: {
        label: 'carTypeName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      radio: '未租赁',
      editCarDisable: true,
      editCarTypeDisable: true,
      delCarTypeDisable: true,
      delCarDisable: true,
      formType: 0,
      rules: {
        carTypeCode: [
          { required: true, message: '请输入车辆类型编码', trigger: 'blur' }
        ],
        carTypeName: [
          { required: true, message: '请输入车辆类型名称', trigger: 'blur' }
        ]
      },
      carRules: {
        carCode: [
          { required: true, message: '请输入车辆编码', trigger: 'blur' }
        ],
        carName: [
          { required: true, message: '请输入车辆名称', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        carBuyTime: [
          { required: true, message: '请选择购买日期', trigger: 'blur' }
        ],
        carBuyMonery: [
          { required: true, message: '请输入车辆价格', trigger: 'blur' }
        ],
        careTypeId: [
          { required: true, message: '请选择车辆类型', trigger: 'blur' }
        ]
      },
      options: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
          carTypeName: '车辆类型',
          carTypeCode: '00',
          children: null
        }
      ],
      formLabelWidth: '120px',
      form: {
        id: ''
      },
      carForm: {
        rentState: '未租赁',
        careTypeId: null,
        carBuyMonery: '',
        carBuyTime: '',
        carCode: '',
        carName: '',
        carNumber: ''
      },
      tableData: [],
      dialogTitle: '新增车辆类型',
      dialogVisible: false,
      carTypeParent: '',
      nodeObj: {},
      isAdd: true,
      delParam: {
        carBeans: [],
        cartypeIds: []
      }
    }
  },
  methods: {
    init() {
      getCarType({
        id: '00000000-0000-0000-0000-000000000000',
        carTypeName: '车辆类型',
        carTypeCode: '00'
      }).then(res => {
        if (res.data.status === 200) {
          const { data } = res.data
        }
      })
    },
    handleAddCar() {
      this.dialogVisible = true
      this.dialogTitle = '新增车辆信息'
      this.formType = 1
      this.isAdd = true
    },
    handleUpdateCar() {
      this.dialogTitle = '修改车辆信息'
      this.formType = 1
      this.isAdd = false
      this.dialogVisible = true
      this.carForm = this.nodeObj
    },
    handleEdit(value) {
      this.formType = 1
      this.dialogVisible = true
      this.dialogTitle = '修改车辆信息'
    },
    handleDel(value) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.tableData.splice(value, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleSizeChange() {
      console.log('caonima')
    },
    handleCurrentChange() {
      console.log('goudongxi')
    },
    handleAddCarType() {
      this.dialogVisible = true
      this.dialogTitle = '新增车辆类型'
      this.formType = 0
      this.isAdd = true
    },
    addCarType() {
      addCarType(this.form).then(res => {
        if (res.data.status === 200) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        }
      })
    },
    updateCarType() {
      updateCarType(this.form).then(res => {
        if (res.data.status === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
        }
      })
    },
    addCar() {
      let param = {}
      param = this.carForm
      param.id = ''

      param.careTypeName = this.nodeObj.carTypeName
      param.careTypeCode = this.nodeObj.carTypeCode
      param.carBuyMonery = Number.parseInt(this.carForm.carBuyMonery)
      addCar(param).then(res => {
        if (res.data.status === 200) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        }
      })
    },
    updateCar() {
      updateCar(this.carForm).then(res => {
        console.log('res', res)
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
        }
      })
    },
    confirmDialog() {
      // 车辆类型
      if (this.formType === 0) {
        this.$refs.form.validate(valid => {
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
        this.$refs.carForm.validate(valid => {
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
    selectRow(selection, row) {
      selection.length === 1
        ? (this.editCarDisable = false)
        : (this.editCarDisable = true)
      this.delCarDisable = false
      this.nodeObj = row
      console.log('row', row)
    },
    selectAll(selection) {
      console.log('selection', selection)
      this.delParam.carBeans = selection
      this.delCarDisable = false
    },
    handleDelCar() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          deleteCar(this.delParam).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleNodeClick(data) {
      console.log('data', data)
      this.nodeObj = data
      this.carTypeParent = data.carTypeParent
      this.editCarTypeDisable = false
      this.delCarTypeDisable = false
      this.getCar()
    },
    getCar() {
      let param = {
        cartypeId: this.nodeObj.id,
        currentPage: 1,
        pageSize: 10,
        searchText: ''
      }
      getCar(param).then(res => {
        console.log('res', res)
        if (res.status === 200) {
          this.tableData = res.data.list
          console.log('sssssssssssss', res.data)
        }
      })
    },
    handleUpdateCarType() {
      this.dialogVisible = true
      this.dialogTitle = '修改车辆类型'
      this.formType = 0
      this.form = this.nodeObj
      this.isAdd = false
    },
    handleDeleteCarType() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          deleteCaarType(this.nodeObj).then(res => {
            if (res.data.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleTreeSelected(node, instanceId) {
      console.log('node', node)
      console.log('instanceId', instanceId)
      this.nodeObj = node
    },
    loadOptions({ action, parentNode, callback }) {
      console.log('action', action)
      console.log('parentNode', parentNode)
      console.log('callback', callback)
      console.log('gggg')
      if (action === LOAD_CHILDREN_OPTIONS) {
        getCarType(parentNode).then(res => {
          if (res.data.status === 200) {
            parentNode.children = res.data.data.map(item => {
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
            id: ''
          }
        ])
      }

      if (node.level === 1) {
        data.id = data.carTypeParent
        getCarType(data).then(res => {
          if (res.data.status === 200) {
            return resolve(res.data.data)
          }
        })
      }
      if (node.level > 1) {
        getCarType(data).then(res => {
          if (res.data.status === 200) {
            return resolve(res.data.data)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.left {
  padding: 40px 0 0 40px;
  border: 1px sold #cccccc !important;
  border-left: none !important;
}
.pagination {
  float: right;
}
</style>
