<template>
  <div>
    <div class="btn-wrap">
      <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
      <el-button type="primary" size="small" @click="handleAdd">新建</el-button>
      <el-button type="primary" size="small" @click="handleDel">删除</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="form" :rules="rules" ref="form" v-if="formType === 0">
        <el-form-item label="订单编号" :label-width="formLabelWidth" prop="typeId">
          <el-input v-model="form.id" autocomplete="off" placeholder="请输入车辆类型编码"></el-input>
        </el-form-item>

        <el-form-item label="上级类型" :label-width="formLabelWidth">
          <treeselect v-model="value" :multiple="true" :options="options" />
        </el-form-item>
      </el-form>
      <el-form :model="orderForm" :rules="orderRules" v-if="formType === 1">
        <el-form-item label="订单编号" :label-width="formLabelWidth" prop="id">
          <el-input v-model="orderForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="制单人" :label-width="formLabelWidth" prop="name">
          <el-input v-model="orderForm.name" autocomplete="off" placeholder="请输入车辆类型名称"></el-input>
        </el-form-item>
        <el-form-item label="出租日期" :label-width="formLabelWidth" prop="buyDate">
          <el-date-picker v-model="orderForm.buyDate" type="date" placeholder="请选择购买日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租赁单位" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="承建人" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="租金" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="出租时长（月）" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="车辆" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderForm.price" autocomplete="off" placeholder="请输入车辆价格"></el-input>
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
  data() {
    return {
      formType: 0,
      form: {},
      rules: [],
      value:'',
      options: [],
      orderForm: {},
      orderRules: [],
      tableData: [],
      dialogTitle: '查询',
      dialogVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleQuery() {
      this.dialogVisible = true
    },
    handleAdd() {},
    handleDel() {},
    handleRowEdit(value) {},
    handleRowDel(value) {},
    addRentOrder() {},
    handleSelectionChange(){},
    selectRow(){}
  }
}
</script>

<style scoped>
</style>