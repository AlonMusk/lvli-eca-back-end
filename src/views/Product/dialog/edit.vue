<template>

<el-dialog v-model="PParam.showEdit" :title="PParam.editTitle">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">基本信息1</el-tab-pane>
      <el-tab-pane label="价格/库存" name="second">Config</el-tab-pane>
      <el-tab-pane label="商品参数" name="third">Role</el-tab-pane>
      <el-tab-pane label="商品详情" name="fourth">Task</el-tab-pane>
    </el-tabs>
</el-dialog>

  </template>
  <script lang="ts" setup>

  import { provide, reactive, ref, watch, inject, computed, onBeforeUnmount } from "vue";
  import type { TabsPaneContext } from 'element-plus'
  
  const activeName = ref('first')




  
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }

  const reqParam = inject('param')
  const PParam = computed(() => {
	console.log('父组件传递过来的新值', reqParam.value);
	return reqParam.value[0];
})



  </script>


  <style>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  </style>
  