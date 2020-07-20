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
          <el-button type="primary" size="small" @click="handleDeleteCarType">删除车辆类型</el-button>
          <el-button type="primary" size="small" @click="addCar">新增车辆</el-button>
          <el-button type="primary" size="small" :disabled="editCarDisable">修改车辆</el-button>
          <el-button type="primary" size="small" :disabled="delCarDisable" @click="delCar">删除车辆</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @select="selectRow">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="车辆编码" width="120">
          </el-table-column>
          <el-table-column prop="name" label="名称" width="120">
          </el-table-column>
          <el-table-column prop="carNumber" label="车牌号" width="120">
          </el-table-column>
          <el-table-column prop="buyDate" label="购买日期" width="120">
          </el-table-column>
          <el-table-column prop="price" label="购买价格" width="120">
          </el-table-column>
          <el-table-column prop="rentStatus" label="租赁状态" width="120">
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
        <el-form-item label="类型编码" :label-width="formLabelWidth" prop="carTypeId">
          <el-input v-model="form.carTypeId" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" prop="carTypeName">
          <el-input v-model="form.carTypeName" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="上级类型" :label-width="formLabelWidth">
          <treeselect v-model="form.carTypeParent" :options="options" :load-options="loadOptions" />
        </el-form-item>
      </el-form>
      <el-form :model="carForm" :rules="carRules" ref="form" v-if="formType === 1">
        <el-form-item label="车辆编码" :label-width="formLabelWidth" prop="id">
          <el-input v-model="carForm.id" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>
        <el-form-item label="车辆名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="carForm.name" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNumber">
          <el-input v-model="carForm.carNumber" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="购买日期" :label-width="formLabelWidth" prop="buyDate">
          <el-date-picker v-model="carForm.buyDate" type="date" placeholder="请选择购买日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="carForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="租赁状态" :label-width="formLabelWidth" prop="typeName">
          <el-radio-group v-model="radio">
            <el-radio label="已租赁" disabled>已租赁</el-radio>
            <el-radio label="未租赁" disabled>未租赁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="typeName">
          <el-input v-model="carForm.carType" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
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
  deleteCaarType
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
  created() {
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
      delCarDisable: true,
      formType: 0,
      rules: {
        carTypeId: [
          { required: true, message: '请输入车辆类型编码', trigger: 'blur' }
        ],
        carTypeName: [
          { required: true, message: '请输入车辆类型名称', trigger: 'blur' }
        ]
      },
      carRules: {
        id: [{ required: true, message: '请输入车辆编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入车辆名称', trigger: 'blur' }],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        buyDate: [
          { required: true, message: '请选择购买日期', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入车辆价格', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'change' }
        ]
      },
      value: null,
      // define options
      options: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          label: '00 车辆品牌',
          children: null
        }
      ],
      formLabelWidth: '120px',
      form: {},
      carForm: {},
      tableData: [],
      dialogTitle: '新增车辆类型',
      dialogVisible: false,
      carTypeObj: {
        id: '',
        carTypeCode: '',
        carTypeName: '',
        carTypeParent: ''
      }
    }
  },
  methods: {
    init() {
      getCarType(
        '00000000-0000-0000-0000-000000000000',
        '车辆类型',
        '00'
      ).then(res => {
        if (res.data.status === 200) {
          const { data } = res.data
          console.log(data)
        }
      })
    },
    addCar() {
      this.dialogVisible = true
      this.dialogTitle = '新增车辆信息'
      this.formType = 1
    },
    handleEdit(value) {
      console.log('scope', value)
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
    },
    addCarType() {
      this.form.id = ''
      this.form.carTypeCode = this.form.carTypeId
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
    confirmDialog() {
      // 车辆类型
      if (this.formType === 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.addCarType()
          } else {
            return false
          }
        })
      } else if (this.formType === 1) {
        this.$refs.carForm.validate(valid => {
          if (valid) {
            alert('ss')
          } else {
            return false
          }
        })
      }
    },
    selectRow(selection, row) {
      console.log('selection', selection)
      console.log('row', row)
      selection.length === 1
        ? (this.editCarDisable = false)
        : (this.editCarDisable = true)
      this.delCarDisable = false
    },
    delCar() {},
    handleNodeClick(data) {
      this.carTypeObj.carTypeName = data.carTypeName
      this.carTypeObj.carTypeCode = data.carTypeCode
      this.carTypeObj.carTypeParent = data.carTypeParent
    },
    handleUpdateCarType() {
      updateCarType().then(res => {})
    },
    handleDeleteCarType() {

    },
    loadOptions({ action, parentNode, callback }) {
      console.log('action', action)
      console.log('parentNode', parentNode)
      console.log('callback', callback)
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      if (action === LOAD_CHILDREN_OPTIONS) {
        switch (parentNode.id) {
          case 'success': {
            simulateAsyncOperation(() => {
              parentNode.children = [
                {
                  id: 'child',
                  label: 'Child option'
                }
              ]
              callback()
            })
            break
          }
          case 'no-children': {
            simulateAsyncOperation(() => {
              parentNode.children = []
              callback()
            })
            break
          }
          case 'failure': {
            simulateAsyncOperation(() => {
              callback(new Error('Failed to load options: network error.'))
            })
            break
          }
          default: /* empty */
        }
      }
    },
    loadNode(node, resolve) {
      const { data } = node
      console.log(node)
      if (node.level === 0) {
        return resolve([
          {
            carTypeName: '00 车辆品牌',
            carTypeCode: '111',
            carTypeParent: '00000000-0000-0000-0000-000000000000'
          }
        ])
      }
      if (node.level > 0) {
        getCarType(
          data.carTypeParent,
          data.carTypeName,
          data.carTypeCode
        ).then(res => {
          console.log(res)
          return resolve([])
        })
      }

      // setTimeout(() => {
      //   const data = [
      //     {
      //       name: 'leaf',
      //       leaf: true
      //     },
      //     {
      //       name: 'zone'
      //     }
      //   ]

      //   resolve(data)
      // }, 500)
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
