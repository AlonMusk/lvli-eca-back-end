<template>
	<div style="width: 450px;border: 1px solid #ccc">
		<!-- 工具栏 -->
		<Toolbar :editor="editorRef" :defaultConfig="toolbarConfig"
			style="width: 450px;border-bottom: 1px solid #ccc" />
		<!-- 编辑器 -->
		<Editor v-model="editorParam.content" :defaultConfig="editorConfig"
			style="width: 450px;height: 500px; overflow-y: hidden;" @onCreated="handleCreated"
			@onChange="handleChange" />
	</div>
</template>

<script lang="ts" setup>
	import { inject, onBeforeUnmount, reactive, ref, watch, computed, provide, shallowRef, onMounted, defineEmits } from "vue";
	import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

	import { OssPolicyApi } from "@/utils/apiOss.ts";
	import axios from "axios"


	const reqParam = inject('editorParam')

	const editorParam = computed(() => {
		console.log('父组件：编辑组件传递过来编辑器的新值', reqParam.value);
		return reqParam.value[0];
	})

	//子传父数据
	const emit = defineEmits(['childEventEditor']);
	const callbackToF = (val) => {
		emit('childEventEditor', val)
	}


	// 编辑器实例，必须用 shallowRef，重要！
	const editorRef = shallowRef()



	// 模拟 ajax 异步获取内容
	onMounted(() => {
		// setTimeout(() => {
		// 	valueHtml.value = '<p style="text-align: left;">异步</p>';
		// 	//valueHtml.value = '<p>模拟 Ajax 异步设置内容gg</p>'
		// }, 1500)
	})

	// 编辑器配置
	const editorConfig = {
		placeholder: '请输入内容...',
		MENU_CONF: { /* 菜单配置，下文解释 */

		}
	}


	editorConfig.MENU_CONF['uploadImage'] = {
		// 自定义上传
		async customUpload(file : File, insertFn : InsertFnType) {  // TS 语法
			// async customUpload(file, insertFn) {                   // JS 语法
			// file 即选中的文件
			// 自己实现上传，并得到图片 url alt href

			await handleBeforeUpload(file,insertFn)

		}
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

	const get_suffix = (filename) => {
		let pos = filename.lastIndexOf('.')
		let suffix = ''
		if (pos != -1) {
			suffix = filename.substring(pos)
		}
		return suffix
	}

	// 上传之前处理动作
	const handleBeforeUpload = (file,insertFn) => {
		return new Promise((resolve, reject) => {
			console.log('file:', file);
			let filename = file.name
			try {
				OssPolicyApi().then((res) => {
					const response = res.data;
					console.log('OssPolicyApi:', response);

					// // 组装自定义参数「如果要自定义回传参数这段代码不能省略」
					// if (Object.keys(response['callback-var']).length) {
					//   for (const [key, value] of Object.entries(response['callback-var'])) {
					//     this.data[key] = value
					//   }
					// }		
					var ossData = new FormData();
					ossData.append('name', file.name)
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

					ossData.append('file', file, file.name)

					axios.post(response.host, ossData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).then(res => {
						console.log('上传阿里之后返回', res);
						if (res.status == 200) {

							let gurl = res.data.data.url + '/' + keyValue;
							let galt = '阿里云图片';
							let ghref = res.data.data.url + '/' + keyValue;
							//console.log('gurl', gurl, 'galt', galt, 'ghref', ghref)

							insertFn(gurl, galt, ghref);
						}
					}).catch(error => { })
					
			  })
				
			
		} catch (error) {
			console.log('获取上传配置失败', error);
			reject(error);
			}
		});
		
	}


	const handleCreated = (editor) => {
		editorRef.value = editor // 记录 editor 实例，重要！
	}

	const handleChange = () => {
		// return valueHtml.value ;
		console.log('handleChange', editorParam);
		// 触发
		callbackToF(editorParam.value.content);
	}

	// 组件销毁时，及时销毁编辑器
	onBeforeUnmount(() => {
		const editor = editorRef.value
		if (editor == null) return
		editor.destroy()
	})
</script>

<!-- 别忘了引入样式 -->
<style src="@wangeditor/editor/dist/css/style.css"></style>