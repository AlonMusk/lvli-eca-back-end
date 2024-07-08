<template>
  <div>
    <!-- 添加用户  用户名 密码 联系方式-->
  <el-dialog v-model="dialogTableVisible" :title="option">

<el-form ref="ruleFormRef" :label-position="labelPosition" label-width="100px" :model="formLabelAlign"
  style="max-width: 460px">
  <el-form-item label="用户名">
    <el-input v-model="formLabelAlign.name" />
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="formLabelAlign.region" />
  </el-form-item>
  <el-form-item label="联系方式">
    <el-input v-model="formLabelAlign.type" />
  </el-form-item>
  <el-form-item label="">

    <el-button type="primary" @click="submitForm(ruleFormRef)">
      保存
    </el-button>
  </el-form-item>
</el-form>
</el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from "vue";

import { toRefs, defineProps } from "vue";

//编辑
const labelPosition = ref("right");
//let dialogTableVisible = ref(false);

const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const props = defineProps({
  //子组件接收父组件传递过来的值
  infoVisible: String,
  infoDetail: String,
  detailNum:Number,
});
//使用父组件传递过来的值

let infoVisible = ref(false);


let infoDetail = reactive({});


// 监听父组件传递子组件数据变化
watch(props, (newProps) => {
  console.log("父传过来的消息1:", newProps);
  infoVisible.value = newProps.infoVisible;
  infoDetail = newProps.infoDetail;
});


//子传父
import { defineEmits } from "vue";
// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(["clickChild"]);
const clickChild = () => {
  let param = {
    content: "子组件的消息b",
  };
  //传递给父组件
  emit("clickChild", param);
};

//const message = ref('默认值');

const sendMessage = () => {
  this.$emit("custom-event", "子组件的消息");
};
</script>
<style scoped></style>