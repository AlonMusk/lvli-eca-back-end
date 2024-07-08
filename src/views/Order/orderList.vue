<template>
	<div style="margin-top:20px;margin-left:10px;float: left;">
		<el-form :inline="true" :model="data" class="demo-form-inline">

			<el-form-item label="订单号">
				<el-input v-model="data.searchParams.name" placeholder="请输入" clearable />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" >新增</el-button>
			</el-form-item>
		</el-form>
	</div>

	<div>
		<p v-if="loading">正在加载...</p>
		<div v-else>
			<el-table ref="multipleTableRef" :data="data.list" style="width: 100%">
				<el-table-column prop="id" label="订单ID">
				</el-table-column>

				<el-table-column prop="name" label="流水号">
				</el-table-column>

				<el-table-column prop="is_new" label="原价">
				</el-table-column>

				<el-table-column prop="status" label="数量">
				</el-table-column>
				
				<el-table-column prop="status" label="单位">
				</el-table-column>

				<el-table-column fixed="right" label="操作" width="150">
					<template #default="scope">
						<el-button link type="primary" style="   
    height: 32px;width: 50px;
    background-color: rgb(64,158,255);
    color: white;" size="small" @click="detailOpt(scope.$index, scope.row)">详情</el-button>

						<el-button link type="primary" style=" 
    height: 32px;width: 50px;
    background-color: rgb(64,158,255);
    color: white;" size="small" @click="editOpt(scope.$index, scope.row)">编辑</el-button>

<el-button link type="primary" style=" 
    height: 32px;width: 50px;
    background-color: rgb(64,158,255);
    color: white;" size="small" @click="refundOpt(scope.$index, scope.row)">退款</el-button>

					</template>
				</el-table-column>

			</el-table>


			<div class="demo-pagination-block">
				<el-pagination v-model:current-page="data.searchParams.current_page"
					v-model:page-size="data.searchParams.page_size" :page-sizes="[10, 20, 30, 40, 50, 100]"
					:small="small" :disabled="disabled" :background="background"
					layout="total, sizes, prev, pager, next, jumper" :total="data.total" @size-change="handleSizeChange"
					@current-change="handleCurrentChange" />
			</div>

		</div>
	</div>

	<el-dialog v-model="data.editDialogShow" :title="data.editTitle">
		<el-form :model="data.editForm" :rules="data.rules" ref="ruleFormRef" label-position="right" label-width="100px"
			style="max-width: 460px">
			<el-form-item label="产品名" style="display: none;">
				<el-input v-model="data.editForm.id" />

			</el-form-item>
			<el-form-item label="产品名" prop="name">
				<el-input v-model="data.editForm.id" style="display: none;" />
				<el-input v-model="data.editForm.name" placeholder="请输入产品名称" />
			</el-form-item>
			<el-form-item label="产品标题" prop="title">
				<el-input v-model="data.editForm.title" />
			</el-form-item>

			<el-form-item label="主图" prop="main_img">

				<SimpleUpload v-model="data.editForm.main_img"></SimpleUpload>
			</el-form-item>

			<el-form-item label="产品子图" prop="sub_img">
				<PictureCard v-model="data.editForm.sub_img"></PictureCard>
			</el-form-item>

			<el-form-item label="所属品牌">
				<el-select v-model="data.editForm.brand_id">
					<el-option v-for="(item, index) in data.brandList" :index="index" :value="item.id"
						:label="item.name">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="产品分类">
				<el-select v-model="data.editForm.cat_id">
					<el-option v-for="(item, index) in data.catList" :index="index" :value="item.id" :label="item.name">
					</el-option>
				</el-select>
			</el-form-item>

			<!-- 属性 -->
			<el-form-item label="产品属性">
				<el-checkbox-group v-model="checkAttr" @change="checkAttrsChange">
					<el-checkbox v-for="(item, index) in  data.attrList" :index="index" :label="item.id">
						{{
              item.name
            }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<!-- 标签 -->
			<el-form-item label="产品标签">
				<el-checkbox-group v-model="checkTag" @change="checkTagsChange">
					<el-checkbox v-for="(item, index) in  data.tagList" :index="index" :label="item.id">
						{{
              item.name
            }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<!-- 产品详情 -->
			<el-form-item label="产品详情" prop="content">
				<Editor v-model="data.editForm.content"></Editor>

			</el-form-item>
			<!-- 是否新品 -->
			<el-form-item label="是否新品">
				<el-radio-group v-model="data.editForm.is_new" class="ml-4">
					<el-radio label="1" size="large">是</el-radio>
					<el-radio label="0" size="large">是</el-radio>
				</el-radio-group>

			</el-form-item>
			<!-- 状态 上架  下架  -->
			<el-form-item label="状态">

				<el-radio-group v-model="data.editForm.status" class="ml-4">
					<el-radio label="1" size="large">上架</el-radio>
					<el-radio label="0" size="large">下架</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="flex">
				<el-button type="primary" @click="cancel()">取消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
			</div>

		</template>

	</el-dialog>
</template>


<script lang="ts" setup>
	import { onMounted, reactive, ref, inject, onBeforeUnmount, computed } from "vue";
	import { ElTable, ElMessage, ElMessageBox } from "element-plus";
	import { ProductListApi, ProductDetailApi, ProductAddApi, BrandListApi, CatListApi, AttrListApi, TagListApi } from "@/utils/apiProduct.ts";
	import SimpleUpload from "@/components/SimpleUpload.vue";
	import PictureCard from "@/components/PictureCard.vue";
	import Editor from "@/components/Editor.vue";
	import bus from '@/utils/bus.ts';
	import { useStore } from "vuex"
	import { OrderListApi,RefundApi } from "@/utils/apiOrder.ts";
	const store = useStore()
	
	//let formLabelAlign = reactive({});

	const data = reactive({
		searchParams: {
			name: "",
			current_page: 1,
			page_size: 10,
		},
		list: [],
		total: 0,

		editForm: {
			id: 0,
			name: "",
			title: "",
			main_img: "",
			sub_img: "",

			brand_id: "",
			cat_id: "",
			sub_cat_id: "",

			attr_id: "",
			tag_id: "",
			content: "",
			is_new: "1",
			status: "1",

		},
		editDialogShow: false,
		editTitle: "",
		brandList: [],
		catList: [],
		attrList: [],
		tagList: [],

		number: 0, //计数 变化值使用

		// 验证
		rules: {
			name: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],
			title: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],
			brand_id: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],
			cat_id: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],

			attr_id: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			], 
			main_img: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],
			sub_img: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],
			content: [
				{ required: true, message: "此项为必填", trigger: "blur" }
			],
			// email:[{required:false,pattern:/正则/,message:"此项为必填",trigger:"blur"}],

		}


	});

	const loading = ref(false);
	const small = ref(false);
	const disabled = ref(false);
	const background = ref(false);
	
	
	//请求接口
const searchList = () => {
  // 请求后台接口
  OrderListApi(data.searchParams).then((res) => {
    console.log(res);
 
    if (res) {
		data.total_items = res.data.total?res.data.total:0;
		data.list = res.data.items;
      if(data.list){
        data.list = data.list.map(item=>{
           return {...item,roleName:(item.role == 1)?"管理员":"普通账号"};
        });
      }

    }
  });
};

const refundOpt = (index, row) => {
	let refund_amount =row.price*100;
	RefundApi({ trade_no: row.trade_no,refund_amount:refund_amount }).then((res) => {
		console.log(res);
	});
};

onMounted(() => {
  console.log('mounted');
    // 在组件挂载后执行的逻辑代码
    searchList();
  });
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