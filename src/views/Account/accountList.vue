<template>
  <div style="margin-top:20px;margin-left:10px;float: left ;">
    <el-form :inline="true" :model="tableData.searchParams" class="demo-form-inline">
     
      <el-form-item label="关键词搜索">
        <el-input v-model="tableData.searchParams.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList()">查询</el-button>
      </el-form-item>

      <el-form-item style="display: none;">
        <el-button type="primary" @click="addUser()">添加</el-button>
      </el-form-item>

      <el-form-item style="display: none;">
        <el-button type="danger" @click="delBatch">批量删除</el-button>
      </el-form-item>

    </el-form>
  </div>

  <div>
    <el-table ref="multipleTableRef" :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
    
      <el-table-column property="username" label="用户名" width="" />
	     <el-table-column property="roleName" label="角色" width="" />
      <el-table-column property="password" label="账号状态" width="" />

   
      <el-table-column v-if="false" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editUser(scope.$index, scope.row)">编辑</el-button>

          <el-button link type="primary" size="small" @click="delUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  

    <div class="demo-pagination-block">
      <el-pagination v-model:current-page="tableData.searchParams.current_page"
        v-model:page-size="tableData.searchParams.per_page_size" :page-sizes="[ 10, 20, 30, 40, 50, 100]" :small="small"
        :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total_items" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </div>

  <AccountEditInfo :message="dialogTableVisible" :item="formLabelAlign" :editNum="editNum">
  </AccountEditInfo>

  <AccountDetailInfo :infoVisible="infoVisible" :infoDetail="infoDetail" :detailNum="detailNum">
  </AccountDetailInfo>
</template>

<script lang="ts" setup>
import { reactive, ref,onMounted  } from "vue";

import { ElTable } from "element-plus";
import type { FormInstance } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import AccountEditInfo from "./dialog/edit.vue";
import AccountDetailInfo from "./dialog/info.vue";
import { AccountListApi, DelAccountApi } from "@/utils/apiAccount.ts";

const multipleSelection = ref('');
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const tableData = reactive({
  searchParams: {
    username:'',
    current_page: 1,
    per_page_size: 10,
  },
  total_items: 0,
  list: [],
});

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  tableData.searchParams.per_page_size = val;

  searchList();
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  tableData.searchParams.current_page = val;
  searchList();
}




const onSubmit = () => {
  console.log("submit!");
};

let dialogTableVisible = ref(false);
let formLabelAlign = reactive({});
let editNum = ref(0);
let option = ref("添加用户");

//请求接口
const searchList = () => {
  // 请求后台接口
  AccountListApi(tableData.searchParams).then((res) => {
    console.log(res);
    let data = res;
    if (data) {
      tableData.total_items = data.total_items?data.total_items:0;
      tableData.list = data.users;
      if(tableData.list){
        tableData.list = tableData.list.map(item=>{
           return {...item,roleName:(item.role == 1)?"管理员":"普通账号"};
        });
      }

    }
  });
};

onMounted(() => {
  console.log('mounted');
    // 在组件挂载后执行的逻辑代码
    searchList();
  });

//编辑用户
const addUser = () => {
  formLabelAlign = reactive({
    name: '',
    date: '',
    email: '',
    status: ''
  });
  dialogTableVisible.value = true;
  editNum.value += 1;
  console.log(
    "编辑 click dialogTableVisible:",
    dialogTableVisible.value,
    "formLabelAlign",
    formLabelAlign
  );
};
const editUser = (index, litem) => {
  formLabelAlign = litem;
  dialogTableVisible.value = true;
  editNum.value += 1;
  console.log(
    "编辑 click dialogTableVisible:",
    dialogTableVisible.value,
    "formLabelAlign",
    formLabelAlign
  );
};

const delUser = (index, litem) => {
  ElMessageBox.confirm("你确定要删除选中项吗", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {

      //这里写逻辑
      DelAccountApi({ no: litem.no }).then((res) => {
        console.log(res);
        if (res.meta.status == 200) {

          ElMessage({
            type: "success",
            message: "删除成功",
          });
        }
      });



    })
    .catch(() => {
      return;
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};

const labelPosition = ref("right");

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

//批量删除
const delBatch = () => {
  ElMessageBox.confirm("你确定要删除选中项吗", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      //这里写逻辑
      let potData = [];
      console.log('批量删除raw', multipleSelection.value);
      const items = multipleSelection.value.map(item => item.no);
      potData = items.join(',');
      DelAccountApi({ no: potData }).then((res) => {
        console.log(res);
        if (res.meta.status == 200) {

          ElMessage({
            type: "success",
            message: "删除成功",
          });
        }
      });
    })
    .catch(() => {
      return;
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};
</script>

<style scoped>

.main-list {
  margin-top: 0px;
}

/* 分页 */
.demo-pagination-block {
  margin-top: 35px;
  margin-bottom: 35px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}


.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
