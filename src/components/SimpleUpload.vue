<template>
	<el-upload class="avatar-uploader" :action="uploadUrl" :before-upload="uploadBefore" :show-file-list="false"
		v-model:file-list="simplePicParams.simpleFileList" :on-success="handleSuccess"  :on-error="handleError"
		:http-request="handleBeforeUpload">
		<img v-if="simplePicParams.simpleFileList[0]" :src="simplePicParams.simpleFileList[0].url" class="avatar" />
		<el-icon v-else class="avatar-uploader-icon">
			<Plus />
		</el-icon>
	</el-upload>
</template>

<script lang="ts" setup>
	import { onBeforeUnmount, reactive, ref, watch, computed, inject,provide, shallowRef, onMounted, defineEmits } from "vue";
	import { Plus } from '@element-plus/icons-vue'
	import { OssPolicyApi } from "@/utils/apiOss.ts";
	import { ElMessage } from 'element-plus'
	import axios from "axios"
	import type { UploadProps } from 'element-plus'
	
	//import { useStore } from "vuex"
	
	const reqParam = inject('simpleUploadParam')
	
	const fileUrl = ref('');
	
	const simplePicParams = computed(() => {
		console.log('父组件：编辑组件传递过来的新值', reqParam.value[0] );
		fileUrl.value = 'http://static.lvlics.com'+reqParam.value[0].fileUrl;
		return reqParam.value[0];
	})
	
	
	//子传父数据
	const emit = defineEmits(['childEventSimpleUpload']);
	const callbackToF = (val) => {
		emit('childEventSimpleUpload', val)
	}

	//const store = useStore()
	
	const uploadUrl = ref(""); // 上传提交地址
	//let fileList = ref(propPicCardParams.dialogParams.fileList);
	//let fileList = reactive([]) // 上传的文件  

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
			// console.log('OssPolicyApi:', response);

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
						
						
						reqParam.value[0].fileUrl = res.data.data.url + '/' + keyValue;
			
				
				
						reqParam.value[0].simpleFileList.splice(0, reqParam.value[0].simpleFileList.length);

						reqParam.value[0].simpleFileList.push({
							name: keyValue,
							url: res.data.data.url + '/' + keyValue
						});
                        console.log('阿里云处理之后 reqParam.value[0]',reqParam.value[0]);
						callbackToF(reqParam.value[0].simpleFileList);

					
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

<style scoped>
	.avatar-uploader .avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: var(--el-transition-duration-fast);
	}

	.avatar-uploader .el-upload:hover {
		border-color: var(--el-color-primary);
	}

	.el-icon.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		text-align: center;
	}
</style>