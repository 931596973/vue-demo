<template>
  <div>
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
      <el-button type="primary" size="small" @click="handleAdd">新建</el-button>
      <el-button type="primary" size="small" @click="handleDel" :disabled="delDisabled">删除</el-button>
    </div>
    <el-table ref="table" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableHeight"
      @select-all="selectAll" @select="selectRow">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="bueCode" label="订单编号" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="careateUser" label="制单人">
      </el-table-column>
      <el-table-column prop="rentDate" label="出租日期" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="rentOrg" label="出租单位">
      </el-table-column>
      <el-table-column prop="rentMonery" label="租金">
      </el-table-column>
      <el-table-column prop="rentDuration" label="出租时长（月）">
      </el-table-column>
      <el-table-column prop="carName" label="车辆">
      </el-table-column>
      <el-table-column prop="rentUser" label="承租人">
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button @click="handleRowEdit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="handleRowDel(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="pageNum" :page-sizes="[3,5, 10, 20, 30, 50]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" @closed="handlClose">
      <el-form :model="form" ref="form" v-if="formType === 0">
        <el-form-item label="订单编号" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="车辆" :label-width="formLabelWidth">
          <el-select v-model="form.carId" placeholder="请选择车辆">
            <el-option v-for="item in cars" :key="item.id" :label="item.careTypeName + '-' + item.carName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="orderForm" ref="orderForm" :rules="orderRules" v-if="formType === 1">
        <el-form-item label="订单编号" :label-width="formLabelWidth" prop="bueCode">
          <el-input v-model="orderForm.bueCode" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="制单人" :label-width="formLabelWidth" prop="careateUser">
          <el-input v-model="orderForm.careateUser" autocomplete="off" placeholder="请输入制单人"></el-input>
        </el-form-item>
        <el-form-item label="出租日期" :label-width="formLabelWidth" prop="rentDate">
          <el-date-picker v-model="orderForm.rentDate" type="date" placeholder="请选择出租日期时间" value-format="yyyy-MM-dd"
            @change="handleDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租赁单位" :label-width="formLabelWidth" prop="rentOrg">
          <el-input v-model="orderForm.rentOrg" autocomplete="off" placeholder="请输入租赁单位"></el-input>
        </el-form-item>
        <el-form-item label="承建人" :label-width="formLabelWidth" prop="rentUser">
          <el-input v-model="orderForm.rentUser" autocomplete="off" placeholder="请输入承建人"></el-input>
        </el-form-item>
        <el-form-item label="租金" :label-width="formLabelWidth" prop="rentMonery">
          <el-input v-model.number="orderForm.rentMonery" autocomplete="off" placeholder="请输入租金"></el-input>
        </el-form-item>
        <el-form-item label="出租时长" :label-width="formLabelWidth" prop="rentDuration">
          <el-select v-model="orderForm.rentDuration" placeholder="请选择出租时长">
            <el-option v-for="item in rentTimes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆" :label-width="formLabelWidth" prop="carId">
          <el-select v-model="orderForm.carId" placeholder="请选择车辆" :disabled="selectCarDisable">
            <el-option v-for="item in cars" :key="item.id" :label="item.careTypeName + '-' + item.carName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="orderForm.extInfo" autocomplete="off" placeholder="请输入备注"></el-input>
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
import { getRent, updateRent, addRent, deleteRent, getCar } from '../api'
import { getFamateDate } from '../utils'

export default {
  watch: {
    delArr() {
      this.delArr.length === 0
        ? (this.delDisabled = true)
        : (this.delDisabled = false)
    },
  },
  created() {
    this.getTableHeight()
    this.getCar()
    this.getRent()
  },
  data() {
    return {
      tableHeight: '',
      pageNum: 1,
      pageSize: 5,
      total: 0,
      delDisabled: true,
      formType: 0,
      form: {},
      value: '',
      cars: [],
      allCars: [],
      orderForm: {
        id: '',
        bueCode: '',
        rentDate: new Date(),
        carId: '',
      },
      orderRules: {
        bueCode: [
          { required: true, message: '请输入订单编号', trigger: 'blur' },
        ],
        careateUser: [
          { required: true, message: '请输入制单人', trigger: 'blur' },
        ],
        rentOrg: [
          { required: true, message: '请输入租赁单位', trigger: 'blur' },
        ],
        rentDate: [
          { required: true, message: '请选择出租日期', trigger: 'blur' },
        ],
        rentUser: [
          { required: true, message: '请输入承建人', trigger: 'blur' },
        ],
        rentDuration: [
          { required: true, message: '请选择出租时长', trigger: 'blur' },
        ],
        carId: [{ required: true, message: '请选择出租时长', trigger: 'blur' }],
        rentMonery: [
          { required: true, message: '请输入租金', trigger: 'change' },
          { type: 'number', message: '请输入数字', trigger: 'change' },
        ],
      },
      tableData: [],
      dialogTitle: '',
      dialogVisible: false,
      formLabelWidth: '120px',
      rentTimes: [
        { label: '1月', value: 1 },
        { label: '2月', value: 2 },
        { label: '3月', value: 3 },
      ],
      delArr: [],
      isAdd: true,
      selectCarDisable: false,
    }
  },
  methods: {
    getTableHeight() {
      this.tableHeight = window.innerHeight - 160
      window.onresize = (event) => {
        this.tableHeight = event.currentTarget.innerHeight - 160
        this.$refs.table.doLayout()
      }
    },
    getCar() {
      let param = {
        cartypeId: '00000000-0000-0000-0000-000000000000',
        pageNum: 1,
        pageSize: 999,
        searchText: '',
      }
      getCar(param).then((res) => {
        if (res.status === 200) {
          this.allCars = res.data.list
          this.cars = this.allCars
        }
      })
    },
    getRent(
      { carCode, pageNum, pageSize, searchText } = {
        carCode: '',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchText: '',
      }
    ) {
      let param = {
        carCode,
        pageNum,
        pageSize,
        searchText,
      }
      getRent(param).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.list.map((item) => {
            item.rentDate = getFamateDate(item.rentDate)
            return item
          })
          this.total = res.data.total
        }
      })
    },
    handleDateChange(value) {
      this.orderForm.bueCode = this.getOrderNo(value)
    },
    handleQuery() {
      this.dialogVisible = true
      this.formType = 0
      this.dialogTitle = '查询'
      this.cars = this.allCars.filter((item) => item.rentState === '已租赁')
    },
    handleAdd() {
      this.isAdd = true
      this.dialogVisible = true
      this.selectCarDisable = false
      this.dialogTitle = '车辆租赁单新建'
      this.formType = 1
      this.orderForm.bueCode = this.getOrderNo(
        getFamateDate(this.orderForm.rentDate)
      )
      this.cars = this.allCars.filter((item) => item.rentState === '未租赁')
    },
    handleDel() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          let param = {
            carId: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            rentBeans: this.delArr,
            rentIds: [],
            searchText: '',
          }
          deleteRent(param).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              // this.delArr.forEach(item => {
              //   this.tableData.forEach((one, index) => {
              //     if (item.id === one.id) {
              //       this.tableData.splice(index, 1)
              //     }
              //   })
              // })
              this.getRent({
                carCode: '',
                pageNum: 1,
                pageSize: this.pageSize,
                searchText: '',
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
    handleRowEdit(row) {
      console.log('row', row)
      this.dialogTitle = '修改租赁信息'
      this.dialogVisible = true
      this.formType = 1
      this.isAdd = false
      this.cars = this.allCars
      this.selectCarDisable = true
      this.orderForm = row
    },
    handleRowDel(value, index) {
      console.log('value', value)
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          let param = {
            carId: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            rentBeans: [value],
            rentIds: [],
            searchText: '',
          }
          deleteRent(param).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.tableData.splice(index, 1)
              this.total --
              // this.minusPageNum()
              // this.getRent()
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
          this.message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    addRent() {
      this.orderForm.carCode = ''
      this.orderForm.carName = ''
      addRent(this.orderForm).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          // this.getPageNumm()
          this.getRent()
          this.getCar()
          this.$refs.orderForm.resetFields()
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '添加失败',
          })
        }
      })
    },
    updateRent() {
      updateRent(this.orderForm).then((res) => {
        if (res.status === 200) {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '修改成功',
            })
            this.getRent()
            this.$refs.orderForm.resetFields()
            this.dialogVisible = false
          } else {
            this.$message({
              type: 'error',
              message: '修改失败',
            })
          }
        }
      })
    },
    confirmDialog() {
      if (this.formType === 0) {
        this.getRent({
          carCode: this.form.carId || '',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchText: this.form.id || '',
        })
        this.dialogVisible = false
      } else if (this.formType === 1) {
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            if (this.isAdd) {
              this.addRent()
            } else {
              this.updateRent()
            }
          } else {
            return false
          }
        })
      }
    },
    clearForm() {

      if (!this.isAdd) {
        this.orderForm = {
          id: '',
          bueCode: '',
          rentDate: new Date(),
          carId: '',
        }
      }

      this.$refs.orderForm.resetFields()
    },
    cancleDialog() {
      this.dialogVisible = false
      this.clearForm()
    },
    selectAll(selection) {
      this.delArr = selection
    },
    selectRow(selection, row) {
      this.delArr = selection
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getRent()
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.getRent()
    },
    getOrderNo(value) {
      let result = ''
      let flowNo = Math.floor(Math.random() * 1000)
      result = 'ZLD' + value.replace(/-/g, '') + flowNo
      return result
    },
    handlClose() {
      this.clearForm()
    },
    // minusPageNum() {
    //   if (this.total - this.pageSize * this.pageNum === 1) {
    //     this.pageNum--
    //   }
    // },
    getPageNumm() {
      this.pageNum = Math.ceil((this.total + 1) / this.pageSize)
      console.log('sss', Math.ceil((this.total + 1) / this.pageSize))
      console.log('sss', this.pageNum)
    },
  },
}
</script>

<style scoped>
.pagination {
  position: fixed;
  bottom: 40px;
  right: 20px;
}
</style>