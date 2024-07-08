<template>
	<div class="editor-wrapper">
		<div ref="editorElem" class="editor"></div>
		<input type="file" ref="fileInput" @change="onFileChange">
	</div>
</template>

<script lang="ts" setup>
	import WangEditor from 'wangeditor'
	import { reactive, ref, watch, computed, onMounted, defineEmits } from "vue";



	const onMounted = () => {
		// 初始化WangEditor
		const editor = new WangEditor(this.$refs.editorElem)

		// 配置图片上传接口地址
		editor.config.uploadImgServer = 'http://xxx/upload'

		// 配置图片上传时需要传递的参数
		editor.config.uploadImgParams = {
			file: null // file字段用于接收本地图片文件
		}

		// 自定义上传方法，将上传的文件传递给WangEditor
		editor.config.customUploadImg = function (files, insertImgFn) {
			const formData = new FormData()
			formData.append('file', files[0])
			this.uploadImgParams.file = files[0]
			const xhr = new XMLHttpRequest()
			xhr.open('POST', this.uploadImgServer, true)
			xhr.onload = function (e) {
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.responseText)
					insertImgFn(response.data.url) // 插入图片
				}
			}
			xhr.send(formData)
		}

		// 创建编辑器
		editor.create()
	}

	const onFileChange = (e) => {
		const file = e.target.files[0]
		const editor = WangEditor.getEditor(this.$refs.editorElem)
		editor.uploadImgParams.file = file // 将获取到的本地图片文件传递给WangEditor的上传参数
		editor.uploadImg() // 调用WangEditor的上传图片方法
		this.$refs.fileInput.value = '' // 重置文件选择器的值，以便下一次选择

		callbackToF();
	}
</script>

<style scoped>
	.editor-wrapper {
		position: relative;
	}

	.editor {
		height: 500px;
	}

	.file-input {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}
</style>