<template>
	<el-upload v-model:file-list="mutilPicParams.mutilFileList" action="uploadUrl" list-type="picture-card"
		:on-preview="handlePictureCardPreview" :on-remove="handleRemove" :http-request="handleBeforeUpload"
		:before-upload="uploadBefore" :on-success="handleSuccess" :on-error="handleError" :limit="mutilPicParams.limit">
		<el-icon>
			<Plus />
		</el-icon>
	</el-upload>

	<el-dialog v-model="dialogVisible">
		<img w-full :src="dialogImageUrl" alt="Preview Image" />
	</el-dialog>
</template>

<script lang="ts" setup>
	import { inject, reactive, ref, watch, computed, onMounted, defineProps, defineEmits } from "vue";
	import { Plus } from '@element-plus/icons-vue'

	import type { UploadProps, UploadUserFile } from 'element-plus'
	import { OssPolicyApi } from "@/utils/apiOss.ts";
	import { ElMessage } from 'element-plus'
	import axios from "axios"


	const reqParam = inject('mutilUploadParam')
	const mutilPicParams = computed(() => {
		console.log('父组件：编辑组件传递过来给多图片组件的新值', reqParam.value);
		return reqParam.value[0];
	})

	//子传父数据
	const emit = defineEmits(['childEventMutilUpload']);
	const callbackToF = (val) => {
		emit('childEventMutilUpload', val)
	}


	const uploadUrl = ref(""); // 上传提交地址

	//const fileList = ref<UploadUserFile[]>([])

	const dialogImageUrl = ref('')
	const dialogVisible = ref(false)

	const handleRemove : UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
		console.log('移除照片：', uploadFile, uploadFiles)
		let tempuploadFiles = [...uploadFiles];

		const valueToRemove = uploadFile.name;
		let newArray = tempuploadFiles
			.filter(item => item.name !== valueToRemove)
			.map(({ name, url }) => Object.assign({}, { name, url }));


		console.log('newArray:', newArray);
		newArray = newArray.map(({ uid, ...rest }) => Object.fromEntries(Object.entries(rest)));
		reqParam.value[0].mutilFileList = reqParam.value[0].mutilFileList.map(({ uid, ...rest }) => Object.fromEntries(Object.entries(rest)));
		console.log('newArray:', newArray);


		callbackToF(newArray);
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

						console.log('filename', filename);
						reqParam.value[0].mutilFileList = reqParam.value[0].mutilFileList
							.filter(item => item.name !== filename)
							.map(({ name, url }) => Object.assign({}, { name, url }));

						reqParam.value[0].mutilFileList.push({
							name: keyValue,
							url: res.data.data.url + '/' + keyValue
						});
						callbackToF(reqParam.value[0].mutilFileList);

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