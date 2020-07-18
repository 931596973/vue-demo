<template>
  <div>
    <el-tree :props="props" :load="loadNode" lazy>
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      console.log('node', node)
      console.log('resolve', resolve)

      if (node.level === 0) {
        return resolve([{ name: '00 车辆品牌' }])
      } else if (node.level === 1) {
        return resolve([
          {
            name: '01 高档车'
          },
          {
            name: '02 中档车'
          },
          {
            name: '03 低档车',
            leaf: true
          }
        ])
      } else if ( node.level === 2 ) {
        return resolve([
          {
            name: '0101 劳斯莱斯系列'
          },
          {
            name: '0102 保时捷系列'
          }
        ])
      }
    }
  }
}
</script>

<style scoped>
</style>