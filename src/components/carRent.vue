<template>
  <div>
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
      <el-button type="primary" size="small" @click="handleAdd">新建</el-button>
      <el-button type="primary" size="small" @click="handleDel" :disabled="delDisabled">删除</el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" @select="selectRow">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="订单编号" width="120">
      </el-table-column>
      <el-table-column prop="name" label="制单人" width="120">
      </el-table-column>
      <el-table-column prop="rentDate" label="出租日期" width="120">
      </el-table-column>
      <el-table-column prop="buyCompany" label="出租单位" width="120">
      </el-table-column>
      <el-table-column prop="rentPrice" label="租金" width="120">
      </el-table-column>
      <el-table-column prop="rentTime" label="出租时长（月）" width="120">
      </el-table-column>
      <el-table-column prop="car" label="车辆" width="120">
      </el-table-column>
      <el-table-column prop="rentName" label="承租人" width="120">
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button @click="handleRowEdit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="handleRowDel(scope.$index)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="1" :page-sizes="[5, 10, 20, 30, 50]" :page-size="5"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="form" :rules="rules" ref="form" v-if="formType === 0">
        <el-form-item label="订单编号" :label-width="formLabelWidth" prop="typeId">
          <el-input v-model="form.id" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>
        <el-form-item label="车辆" :label-width="formLabelWidth">
          <el-select v-model="value" placeholder="请选择车辆">
            <el-option v-for="item in cars" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="orderForm" ref="orderForm" :rules="orderRules" v-if="formType === 1">
        <el-form-item label="订单编号" :label-width="formLabelWidth" prop="orderNo">
          <el-input v-model="orderForm.orderNo" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="制单人" :label-width="formLabelWidth" prop="name">
          <el-input v-model="orderForm.name" autocomplete="off" placeholder="请输入制单人"></el-input>
        </el-form-item>
        <el-form-item label="出租日期" :label-width="formLabelWidth" prop="rentDate">
          <el-date-picker v-model="orderForm.rentDate" type="date" placeholder="请选择出租日期时间" value-format="yyyy-MM-dd"
            @change="handleDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租赁单位" :label-width="formLabelWidth" prop="rentCompany">
          <el-input v-model="orderForm.rentCompany" autocomplete="off" placeholder="请输入租赁单位"></el-input>
        </el-form-item>
        <el-form-item label="承建人" :label-width="formLabelWidth" prop="contractor">
          <el-input v-model="orderForm.contractor" autocomplete="off" placeholder="请输入承建人"></el-input>
        </el-form-item>
        <el-form-item label="租金" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入租金"></el-input>
        </el-form-item>
        <el-form-item label="出租时长（月）" :label-width="formLabelWidth" prop="duration">
          <el-select v-model="orderForm.duration" placeholder="请选择出租时长">
            <el-option v-for="item in rentTimes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆" :label-width="formLabelWidth">
          <el-select v-model="orderForm.car" placeholder="请选择车辆">
            <el-option v-for="item in cars" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="orderForm.remark" autocomplete="off" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRentOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
      delDisabled: true,
      formType: 0,
      form: {},
      rules: {},
      value: '',
      cars: [],
      orderForm: {
        orderNo: '',
        rentDate: new Date(),

      },
      orderRules: {
        orderNo: [
          { required: true, message: '请输入订单编号', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入制单人', trigger: 'blur' }],
        rentCompany: [
          { required: true, message: '请输入租赁单位', trigger: 'blur' }
        ],
        rentDate: [
          { required: true, message: '请选择出租日期', trigger: 'blur' }
        ],
        contractor: [
          { required: true, message: '请输入承建人', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请选择出租时长', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入租金', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'change' }
        ]
      },
      tableData: [],
      dialogTitle: '查询',
      dialogVisible: false,
      formLabelWidth: '120px',
      rentTimes: [
        { label: '1月', value: 1 },
        { label: '2月', value: 2 },
        { label: '3月', value: 3 }
      ]
    }
  },
  methods: {
    handleDateChange(value) {
      console.log('date', value)
      this.orderForm.orderNo = this.getOrderNo(value)
      console.log('datess', this.getOrderNo(value))
    },
    handleQuery() {
      this.dialogVisible = true
    },
    handleAdd() {
      this.dialogVisible = true
      this.dialogTitle = '车辆租赁单新建'
      this.formType = 1
      this.orderForm.orderNo = this.getOrderNo(
        this.getFamateDate(this.orderForm.rentDate)
      )
    },
    handleDel() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
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
    handleRowEdit(value) {
      console.log('sss', value)
      this.dialogTitle = '修改租赁信息'
      this.dialogVisible = true
      this.formType = 1
    },
    handleRowDel(value) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        this.message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addRentOrder() {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSelectionChange() {},
    selectRow(section, row) {
      if (section.length > 0) this.delDisabled = false
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    getOrderNo(value) {
      let result = ''
      let flowNo = Math.floor(Math.random() * 1000)
      result = 'ZLD' + value.replace(/-/g, '') + flowNo
      return result
    },
    getFamateDate(value) {
      let date = new Date(value)
      let year = date.getFullYear()
      let month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    }
  }
}
</script>

<style scoped>
.pagination {
  float: right;
}
</style>