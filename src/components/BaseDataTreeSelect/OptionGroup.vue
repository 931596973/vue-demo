
<template>
  <div class="option-group">
    <div
      v-if="hasData"
      class="option-group-data"
    >
      <div
        class="option"
        v-for="(item) in data"
        :key="item.id"
      >
        <div class="option-checkbox">
          <Checkbox
            :value="item._checked"
            @on-change="selectCancel(item)"
          >{{item.title}}</Checkbox>

        </div>
        <div class="option-title">
          <!-- <Tooltip :content="showTitle(item, index)">
            <span class="option-title-span">{{showTitle(item, index)}}</span>
          </Tooltip> -->
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
    <div
      class="no-data"
      v-else
    >
      {{"暂无数据"}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    api: {
      type: Object,
      require: true,
    },
  },
  computed: {
    hasData: {
      get: function () {
        return this.data && this.data.length > 0
      },
    },
  },
  methods: {
    showTitle(item, index) {
      return this.api.selectedShowTitle
        ? this.api.selectedShowTitle(item, index, this.data)
        : item.title
    },
    selectCancel(item) {
      this.$emit('on-change', item)
    },
    deleteClick(item) {},
  },
}
</script>
<style lang="less" scoped>
.option-group {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .option-group-data {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .option {
    width: 100%;
    float: left;
    min-height: 30px;
  }

  .option-title {
    width: calc(~'100% - 20px');
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .option-title-span {
    width: calc(~'100% - 5px');
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .option-checkbox {
    float: left;
    width: 120px;
  }
}
</style>