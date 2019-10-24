<template>
  <div class="todo-list">
    <span class="item" :class="{ finished: item.status }">
      {{ index + 1 }}. {{ item.content }}
    </span>
    <span class="pull-right">
      <el-button v-if="!item.status" size="small" type="primary" @click="$emit('finish', index)">
        完成
      </el-button>
      <el-button v-else size="small" type="primary" @click="$emit('restore', index)">
        还原
      </el-button>
      <el-button size="small" :plain="true" type="danger" @click="$emit('remove', index)">
        删除
      </el-button>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface TodoItem {
  status: boolean;
  content: string;
}

export default Vue.extend({
  props: {
    index: {
      type: Number,
    },
    item: {
      type: Object as () => TodoItem,
    },
  },
});
</script>

<style lang="stylus" scoped>
.todo-list
  width 100%
  margin-top 8px
  padding-bottom 8px
  border-bottom 1px solid #eee
  overflow hidden
  text-align left
  .item
    font-size 20px
    &.finished
      text-decoration line-through
      color #ddd
  .pull-right
    float right
</style>
