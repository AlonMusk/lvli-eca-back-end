<template>
	<div style="margin-top:20px;margin-left:10px;float: left;">
		<el-form :inline="true" :model="data" class="demo-form-inline">

			<el-form-item label="产品名称">
				<el-input v-model="data.searchParams.name" placeholder="请输入" clearable />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOpt">新增</el-button>
			</el-form-item>
		</el-form>
	</div>

	<div>
		<p v-if="loading">正在加载...</p>
		<div v-else>
			<el-table ref="multipleTableRef" :data="data.list" style="width: 100%">
				<el-table-column prop="id" label="产品ID">
				</el-table-column>

				<el-table-column prop="name" label="产品名">
				</el-table-column>

				<el-table-column prop="is_new" label="是否新品">
				</el-table-column>

				<el-table-column prop="status" label="状态">
				</el-table-column>

				<el-table-column fixed="right" label="操作" width="150">
					<template #default="scope">
						<el-button link type="primary" style="   
    height: 32px;width: 50px;display:none;
    background-color: rgb(64,158,255);
    color: white;" size="small" @click="detailOpt(scope.$index, scope.row)">详情</el-button>

						<el-button link type="primary" style=" 
    height: 32px;width: 50px;
    background-color: rgb(64,158,255);
    color: white;" size="small" @click="editOpt(scope.$index, scope.row)">编辑</el-button>
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

	<Edit :param="editParam" @child-event="handleEditEvent" />

</template>

<script lang="ts" setup>
	import { onMounted, reactive, ref, inject, provide, onBeforeUnmount, onUnmounted, computed } from "vue";
	import { ElTable, ElMessage, ElMessageBox } from "element-plus";
	import { ProductListApi, ProductDetailApi, ProductAddApi, BrandListApi, CatListApi, AttrListApi, TagListApi } from "@/utils/apiProduct.ts";
	import SimpleUpload from "@/components/SimpleUpload.vue";
	import PictureCard from "@/components/PictureCard.vue";
	import Editor from "@/components/Editor.vue";
	import bus from '@/utils/bus.ts';
	import { useStore } from "vuex"
	import Edit from "./dialog/edit.vue";

	const editParam = ref([
		{
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
			showEdit: false,
			editTitle: '添加产品',
			countNumber: 0,

			simpleFileList: [],
			mutilFileList: [],

			brandList: [],
			catList: [],
			checkAttr: [],
			attrList: [],
			tagList: [],
			
			checkTag: [],
		}
	]);
	provide('param', editParam);

	const handleEditEvent = (data) => {
		console.log('接收到子组件的事件', data);
	}

	//接收子组件:编辑器数据
	const editorToF = (val : any) => {
		console.log('接收子组件:编辑器数据', val)
		data.editForm.content = val;
	}

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

	// 编辑
	const checkAttr = ref([]);
	const checkTag = ref([]);
	const ruleFormRef = ref();
	const mainImg = reactive([]);

	const addOpt = () => {
		//PParam.content = "";
		editParam.value[0].editForm.id = 0;
		editParam.value[0].editForm.name = "";
		editParam.value[0].editForm.title = "";
		editParam.value[0].editForm.main_img = "";
		editParam.value[0].editForm.sub_img = "";
		editParam.value[0].editForm.brand_id = 0;
		editParam.value[0].editForm.cat_id = 0;
		editParam.value[0].editForm.sub_cat_id = 0;
		editParam.value[0].editForm.attr_id = "";
		editParam.value[0].editForm.tag_id = "";
		editParam.value[0].editForm.content = "";
		editParam.value[0].editForm.sku=[{
			id:0,
			price:"",
			old_price:""
		}];
		editParam.value[0].editForm.is_new = 1;
		editParam.value[0].editForm.status = 1;

		editParam.value[0].showEdit = true;
		editParam.value[0].editTitle = "添加产品";

		editParam.value[0].countNumber = 0;
		editParam.value[0].simpleFileList = [];
		editParam.value[0].mutilFileList = [];


		editParam.value[0].checkAttr = [];
		editParam.value[0].checkTag = [];
		

		console.log('添加', editParam);
	}



	const detailOpt = (index, item) => {

	}



	// const test = computed(() => store.getters['getMainImage']);

	// const count = computed(() => store.state.count);


	const count = computed(() => store.state.count);

	const getNetWorkUrl = (url) => {
		return 'http://static.lvlics.com/' + url;
	}

	let items = [];

	const editOpt = (index, row) => {
		data.editForm.id = row.id;

		ProductDetailApi({ id: row.id }).then((res) => {
			let resData = res;
			console.log('ProductDetailApi', resData);
			if (resData.code == 200) {
				let simpleFileList = [];
				if (resData.data.main_img) {
					simpleFileList = resData.data.main_img.split(",").map((value) => ({
						name: value,
						url: 'http://static.lvlics.com' + value,
					}));
				}

				let mutilFileList = [];
				if (resData.data.sub_img) {
					mutilFileList = resData.data.sub_img.split(",").map((value) => ({
						name: value,
						url: 'http://static.lvlics.com' + value,
					}));
				}

				editParam.value[0].editForm.id = resData.data.id;
				editParam.value[0].editForm.name = resData.data.name;
				editParam.value[0].editForm.title = resData.data.title;
				editParam.value[0].editForm.main_img = resData.data.main_img;
				editParam.value[0].editForm.sub_img = resData.data.sub_img;
				editParam.value[0].editForm.brand_id = resData.data.brand_id;
				editParam.value[0].editForm.cat_id = resData.data.cat_id;
				editParam.value[0].editForm.sub_cat_id = resData.data.sub_cat_id;
				editParam.value[0].editForm.attr_id = resData.data.attr_id;
				editParam.value[0].editForm.tag_id = resData.data.tag_id;
				editParam.value[0].editForm.content = resData.data.content;
				editParam.value[0].editForm.is_new = resData.data.is_new;
				editParam.value[0].editForm.status = resData.data.status;
				editParam.value[0].editForm.sku = resData.data.sku;
			

				editParam.value[0].showEdit = true;
				editParam.value[0].editTitle = "编辑产品";

				editParam.value[0].countNumber = 0;
				editParam.value[0].simpleFileList = simpleFileList;
				editParam.value[0].mutilFileList = mutilFileList;
				
				if(resData.data.attr_id.length>0){
					let ids = resData.data.attr_id.split(",");
					var names = [];
					editParam.value[0].attrList.forEach(function(obj) {
				    if (ids.includes(obj.id.toString())) {
				        names.push(obj.name);
				    }
				});
				editParam.value[0].checkAttr =names;
				console.log('checkAttr',editParam.value[0].checkAttr )
				}

				if(resData.data.tag_id && resData.data.tag_id.length>0){
					let ids = resData.data.tag_id.split(",");
					var tagNames = [];
					editParam.value[0].tagList.forEach(function(obj) {
				    if (ids.includes(obj.id.toString())) {
				        tagNames.push(obj.name);
				    }
				});
				editParam.value[0].checkTag =tagNames;
				console.log('checkTag',editParam.value[0].checkTag )
				}

				const detail = data.editForm.main_img.replace(/^\//, '');

				items = [];
				items.push({
					name: detail,
					url: getNetWorkUrl(detail),
				})
				console.log('items', items);
				//mainImg.value=data.editForm.main_img;
				//  ElMessage.info('编辑成功');
			}
		});


	}
	const clickEven = (val) => {
		console.log("子组件传递的消息：", val);
		//result.value=val.content
		//data.editForm.main_img = val.main_img;
	};


	const search = () => {
		searchList();
	};

	const handleSizeChange = (val : number) => {
		console.log(`${val} items per page`);
		data.searchParams.page_size = val;
		searchList();
	}
	const handleCurrentChange = (val : number) => {
		console.log(`current page: ${val}`);
		data.searchParams.current_page = val;
		searchList();
	}


	//请求接口
	const searchList = () => {
		// 请求后台接口
		ProductListApi(data.searchParams).then((res) => {
			console.log(res);
			let resData = res.data;

			if (resData) {
				data.total = resData.total ?? 0;
				//tableData.list = res.products;

				// 搜索项
				data.list = resData.items.map(item => {
					const newItem = { ...item };
					// const matchingItem = resData.headers.find(obj => obj.name === item.name);
					// if (matchingItem) {
					//   newItem.labelName = matchingItem.display_name;
					// }
					return newItem;
				});

			}
		});
	};

	const brandList = () => {
		// 请求后台接口
		BrandListApi().then((res) => {
			// console.log(res);
			let resData = res.data;
			if (resData) {
				data.brandList = resData.items;
				editParam.value[0].brandList = resData.items;
			}
		});
	};


	const catList = () => {
		CatListApi().then((res) => {
			let resData = res.data;
			if (resData) {
				data.catList = resData.items;
				editParam.value[0].catList = resData.items;
			}
		});
	};


	const attrList = () => {
		AttrListApi().then((res) => {
			let resData = res.data;
			if (resData) {
				data.attrList = resData.items;
				editParam.value[0].attrList = resData.items;

			}
		});
	};

	const tagList = () => {
		TagListApi().then((res) => {
			let resData = res.data;
			if (resData) {
				data.tagList = resData.items;
				editParam.value[0].tagList = resData.items;
			}
		});
	};




	onMounted(async () => {
		console.log('onMounted');
		try {
			loading.value = true;
			searchList();
			brandList();
			catList();
			attrList();
			tagList();
		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
		}
	});


    //定时器用法
	// const intervalId = setInterval(() => {
	// 	editParam.value = [
	// 		{
	// 			showEdit: true,
	// 			editTitle: '添加产品2',
	// 			id: 1,
	// 			name: '产品名2',
	// 			title: "hello2",
	// 		}
	// 	]
	// }, 5000);
	// 在组件卸载时清除定时器，防止内存泄漏
	// onUnmounted(() => {
	// 	clearInterval(intervalId);
	// });
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