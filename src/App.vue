<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
html,
body,
#app {
  height: 100%;
  margin-top: 0px;
  /* font-family: 'PingFang SC';
  font-weight: 540;
  font-size: 70px; */
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #102847;
}

#nav a.router-link-exact-active {
  color: #fff;
}


.el-table {
  margin-top: 15px;
}
.el-select {
  width: 100%;
}
</style>
