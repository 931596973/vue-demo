<template>
  <div>
    <h1>狗</h1>
    <el-button
      type="primary"
      @click="tijiao"
    >tijiao</el-button>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="表单项A">
        <!-- <base-data-select
          v-model="form.select"
          multiple
          clearable
        ></base-data-select> -->
        <base-data-tree-select
          v-model="form.tree"
          multiple
        ></base-data-tree-select>

      </el-form-item>
      <el-form-item label="表单项A">
        <base-data-select
          v-model="form.select"
          clearable
        ></base-data-select>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import BaseDataSelect from './BaseDataSelect/index'
import BaseDataTreeSelect from './BaseDataTreeSelect/index'
export default {
  components: {
    BaseDataTreeSelect,
    BaseDataSelect,
  },

  data() {
    return {
      define: {
        config: {
          multiple: true,
        },
      },
      form: {
        select: '',
        tree: '',
      },
    }
  },
  methods: {
    tijiao() {
      console.log(this.form)
    },
    asdfsdf(val) {
      this.form.select = val
    },
  },
}
</script>

<style lang='scss' scoped>
</style>