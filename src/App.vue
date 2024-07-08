<template>
	<!-- 相当a标签,to="路由path" -->
	<!-- <nav>
	  <router-link to="/">Home</router-link> |
	  <router-link to="/about">About</router-link>
	</nav> -->
	<!-- router-view:展示路由对应的组件内容 -->
	<router-view />
</template>
  
<style>
body,
html {
	padding: 0;
	margin: 0;
}

/* flex布局类名 */
.flex-float {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.flex {
	display: flex;
	align-items: center;
}

.page_content {
	box-sizing: border-box;
	display: block;
	width: 100%;
	padding: 20px;
	background: #fff;
	margin-top: 30px;
}</style>
  