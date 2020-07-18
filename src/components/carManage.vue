<template>
  <div>
    <el-container>
      <el-aside class="left" style="border: 1px sold #cccccc">
        <car-type></car-type>
      </el-aside>
      <el-main>
        <h3>车辆管理</h3>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="handleAddCarType">新增车辆类型</el-button>
          <el-button type="primary" size="small" :disabled="editCarTypeDisable">修改车辆类型</el-button>
          <el-button type="primary" size="small" >删除车辆类型</el-button>
          <el-button type="primary" size="small" @click="addCar">新增车辆</el-button>
          <el-button type="primary" size="small" :disabled="editCarDisable">修改车辆</el-button>
          <el-button type="primary" size="small" :disabled="delCarDisable" @click="delCar">删除车辆</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" @select="selectRow">
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
        <el-form-item label="类型编码" :label-width="formLabelWidth" prop="typeId">
          <el-input v-model="form.id" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth" prop="typeName">
          <el-input v-model="form.id" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="上级类型" :label-width="formLabelWidth">
          <treeselect v-model="value" :multiple="true" :options="options" />
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
        <el-button type="primary" @click="addCarType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import carType from './carType'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    carType,
    Treeselect
  },
  computed: {
    total() {
      return this.tableData.length
    }
  },
  created() {
    this.$axios.get('http://localhost:8080/mock/news').then(res => {
      console.log(res.data)
      this.tableData = res.data
    })
  },
  data() {
    return {
      radio: '未租赁',
      editCarDisable: true,
      editCarTypeDisable: true,
      delCarDisable: true,
      formType: 0,
      rules: {
        typeId: [
          { required: true, message: '请输入车辆类型编码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '请输入车辆类型名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      carRules: {
        id: [
          { required: true, message: '请输入车辆编码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入车辆名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
          id: 'a',
          label: 'a',
          children: [
            {
              id: 'aa',
              label: 'aa'
            },
            {
              id: 'ab',
              label: 'ab'
            }
          ]
        },
        {
          id: 'b',
          label: 'b'
        },
        {
          id: 'c',
          label: 'c'
        }
      ],
      formLabelWidth: '120px',
      form: {},
      carForm: {},
      tableData: [],
      dialogTitle: '新增车辆类型',
      dialogVisible: false,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      // this.dialogVisible = false
      if (this.formType === 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
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
    delCar() {}
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
