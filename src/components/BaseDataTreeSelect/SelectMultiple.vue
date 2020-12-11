<template>
  <div class="multiple-select">
    <div
      class="ivu-select ivu-select-multiple ivu-select-default"
      @click="handleClick"
    >
      <div
        class="ivu-select-selection"
        style="min-height:32px"
      >
        <Icon
          class="select-icon"
          type="ios-more"
          @click="handleClick"
        />
        <span
          v-if="!selection.length"
          class="ivu-select-placeholder"
        >{{placeholder}}</span>
        <div class="select-tags">
          <div
            class="ivu-tag ivu-tag-checked"
            v-for="(item, index) in selection"
            :key="item[formate]"
          >
            <span class="ivu-tag-text">{{item[formate]}}</span>
            <i
              class="ivu-icon ivu-icon-ios-close"
              @click.stop="closeTag(index, item)"
            ></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    selection: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    formate: {
      type: String,
      default: 'code',
    },
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit('on-select-click')
    },
    closeTag(index, item) {
      this.$emit('on-close-tag', index, item)
    },
  },
}
</script>

<style lang='less' scoped>
.select-icon {
  line-height: 32px;
  float: right;
}
.ivu-tag {
  height: 26px;
  line-height: 26px;
}
.multiple-select {
  /deep/ .ivu-select-multiple {
    .ivu-select-selection {
      padding-right: 10px;
    }
  }
}
</style>