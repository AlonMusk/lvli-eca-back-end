<template>
  <div>
    <!-- <button @click="clickChild">点击子组件</button> -->
    <!-- <slot></slot> -->

    <el-dialog v-model="dialogTableVisible" :title="option">
      <el-form
        ref="ruleFormRef"
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
      >
        <el-form-item label="标题">
          <el-input v-model="formLabelAlign.title" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formLabelAlign.author" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from "vue";

import { toRefs, defineProps } from "vue";
import { EditOrderApi } from "@/utils/apiOrder.ts";

import { ElMessage } from 'element-plus'
//编辑
const labelPosition = ref("right");
//let dialogTableVisible = ref(false);

const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!",fields);

      // 请求后台接口
      EditOrderApi(formLabelAlign).then((res) => {
        console.log(res);
        if (res.data) {
          ElMessage({
            message: "编辑成功",
            type: "success",
          });
          dialogTableVisible.value = false;
        } else {
          ElMessage.error("编辑失败.");
        }
      });

      return true;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const props = defineProps({
  //子组件接收父组件传递过来的值
  message: String,
  item: String,
  editNum: Number,
});
//使用父组件传递过来的值
const { message } = toRefs(props);

let dialogTableVisible = ref(false);
let formLabelAlign = reactive({});
console.log("父传过来的消息:", message);

// 监听父组件传递子组件数据变化
watch(props, (newProps) => {
  console.log("父传过来的消息1:", newProps);
  dialogTableVisible.value = newProps.message;
  formLabelAlign = newProps.item;
});

//监控单个
//  watch(
//     () => props.message,
//     (newProps) => {
//         message.value = newProps.message
//         console.log('父传过来的消息:',newProps);
//     }
// );

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

const sendMessage = () => {
  this.$emit("custom-event", "子组件的消息");
};
</script>
<style scoped></style>
