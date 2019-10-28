<template>
  <div class="todo-list">
    <span class="item" :class="{ finished: item.status }">
      {{ index + 1 }}. {{ item.content }}
    </span>
    <span class="pull-right">
      <el-button v-if="!item.status" size="small" type="primary" @click="$emit('finish', item)">
        完成
      </el-button>
      <el-button v-else size="small" type="primary" @click="$emit('restore', item)">
        还原
      </el-button>
      <el-button size="small" :plain="true" type="danger" @click="$emit('remove', item)">
        删除
      </el-button>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ITodoItem } from '../views/TodoList.vue';

export default Vue.extend({
  props: {
    index: {
      type: Number,
    },
    item: {
      type: Object as () => ITodoItem,
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
