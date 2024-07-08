<template>
	<el-upload v-model:file-list="fileList" action="uploadUrl" list-type="picture-card"
		:on-preview="handlePictureCardPreview" :on-remove="handleRemove" :http-request="handleBeforeUpload"
		:before-upload="uploadBefore" :on-success="handleSuccess" :on-error="handleError" limit="3">
		<el-icon>
			<Plus />
		</el-icon>
	</el-upload>

	<el-dialog v-model="dialogVisible">
		<img w-full :src="dialogImageUrl" alt="Preview Image" />
	</el-dialog>
</template>

<script lang="ts" setup>
	import { reactive, ref, watch, computed,onMounted,defineProps } from "vue";
	import { Plus } from '@element-plus/icons-vue'

	import type { UploadProps, UploadUserFile } from 'element-plus'
	import { OssPolicyApi } from "@/utils/apiOss.ts";
	import { ElMessage } from 'element-plus'
	import axios from "axios"
	import bus from '@/utils/bus.ts';
	import { useStore } from "vuex"

	const propPicCardParams = defineProps(['picCardParams']);

	let dialogParams = ref(propPicCardParams.dialogParams);
	console.log('dialogParams', dialogParams);

	// 监听propPicCardParams 可以是父组件传递子组件数据变化  也可以是本地值的变化
	watch(propPicCardParams.dialogParams, (newProps, oldValue) => {
		console.log("数据发生了变化:", newProps);
		dialogParams.value = newProps.dialogParams;
	});

	//子传父数据
	const emit = defineEmits(['cClick']);
	const callbackToF = (val) => {
		emit('cClick', val)
	}

	const store = useStore()

	let localFileList = [];
	let localFileList2 = [];
	let fileList = computed(() => {
		// 在这里定义计算属性的逻辑
		return store.getters['getSubImage'];
	});

	//辅助
	let fileList2 = computed(() => {
		// 在这里定义计算属性的逻辑
		return store.getters['getSubImage2'];
	});

	const uploadUrl = ref(""); // 上传提交地址

	//const fileList = ref<UploadUserFile[]>([])

	const dialogImageUrl = ref('')
	const dialogVisible = ref(false)

	const handleRemove : UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
		console.log('移除照片：', uploadFile, uploadFiles)


		const matchIndex = localFileList2.findIndex(obj => obj.oldVal === uploadFile.name);
		const matchItem = localFileList2.splice(matchIndex, 1)[0];

		const matchBItem = localFileList.find(obj => obj.name === matchItem.newVal);
		const matchBIndex = localFileList.findIndex(obj => obj.name === matchBItem.name);
		localFileList.splice(matchBIndex, 1);

		// 触发
		store.commit('setSubImage', localFileList)
		store.commit('setSubImage2', localFileList2)
	}

	const handlePictureCardPreview : UploadProps['onPreview'] = (uploadFile) => {
		dialogImageUrl.value = uploadFile.url!
		dialogVisible.value = true
	}

	const get_suffix = (filename) => {
		let pos = filename.lastIndexOf('.')
		let suffix = ''
		if (pos != -1) {
			suffix = filename.substring(pos)
		}
		return suffix
	}
	const random_string = (len) => {
		len = len || 32
		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
		var maxPos = chars.length
		var pwd = ''
		for (let i = 0; i < len; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos))
		}
		return pwd
	}

	const uploadBefore = (file) => {
		// 上传文件之前校验图片格式和大小
		const isJPG = file.type === 'image/svg+xml' || file.type === 'image/png'
		const isLt5M = file.size / 1024 / 1024 < 5
		if (false && !isJPG) {
			ElMessage.error('上传图片只能是 PNG、SVG 格式!')
			return false
		}
		if (!isLt5M) {
			ElMessage.error('上传图片大小不能超过5MB!')
			return false
		}
	}

	// 上传之前处理动作
	const handleBeforeUpload = async (file) => {

		let filename = file.file.name
		try {
			const res = await OssPolicyApi()

			const response = res.data;
			//console.log('OssPolicyApi:', response);

			uploadUrl.value = response.host

			// // 组装自定义参数「如果要自定义回传参数这段代码不能省略」
			// if (Object.keys(response['callback-var']).length) {
			//   for (const [key, value] of Object.entries(response['callback-var'])) {
			//     this.data[key] = value
			//   }
			// }


			var ossData = new FormData()
			ossData.append('name', file.file.name)
			//key就代表文件层级和阿里云上的文件名
			//  let filename = file.file.name
			let picName = random_string(10) + get_suffix(filename)
			let keyValue = response.dir + picName
			ossData.append('key', keyValue)

			ossData.append('policy', response.policy)
			ossData.append('OSSAccessKeyId', response.accessid)
			ossData.append('success_action_status', 200)
			ossData.append('signature', response.signature)
			ossData.append('host', response.host)
			ossData.append('callback', response.callback)

			ossData.append('file', file.file, file.file.name)


			axios.post(response.host, ossData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
				.then(res => {
					console.log('上传阿里之后返回', res);
					if (res.status == 200) {
						dialogImageUrl.value = res.data.data.url + '/' + keyValue

						console.log('fileList2', localFileList2);
						console.log('fileList', localFileList);
						localFileList.push({
							name: keyValue,
							url: dialogImageUrl.value
						})
						localFileList2.push({
							oldVal: filename,
							newVal: keyValue
						})

						console.log('fileList2', localFileList2);
						console.log('fileList', localFileList);
						// 触发
						store.commit('setSubImage', localFileList)
						store.commit('setSubImage2', localFileList2)

					}
				})
				.catch(error => { })
		} catch (error) {
			console.log('获取上传配置失败', error);
			ElMessage.error("获取上传配置失败");

		}
	}


	// 文件上传成功处理
	const handleSuccess = (response, file, fileList) => {
		console.log('handleSucess', response, file, fileList);
	}




	// 上传失败处理
	const handleError = () => {
		ElMessage.error("上传失败");

	}
</script>