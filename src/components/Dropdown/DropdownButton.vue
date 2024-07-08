<template>
    <!-- <div style="overflow-y:auto"> -->
    <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">

            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>

            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <!-- </div> -->
</template>
    
<script lang="ts" setup>
import { defineEmits } from "vue";
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command: string | number | object) => {
    console.log('command:', command);
    if (command == 'logout') {
        clickChild();
    }
    // ElMessage(`click on item ${command}`)
}

//子传父
// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(["clickchild"]);
const clickChild = () => {
    console.log('clickchild');
    let param = {
        content: "子组件的消息b",
    };
    //传递给父组件
    emit("clickchild", param);
};

</script>
<style scoped>
.el-dropdown-link:focus {
    outline: none;
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>
    