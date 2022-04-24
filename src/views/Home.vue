<template>
  <div>
    <el-container>
      <el-aside width="13%">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header style="height: 55px;">
          <Top></Top>
        </el-header>
        <el-main>
          <div style="margin: 0 15px;">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from './inc/Aside'
import Top from './inc/Top'

export default {
  name: 'Home',
  components: {
    Aside,
    Top
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}
.el-header {
  background-color: #2a4866;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-aside {
  background-color: #102847;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
  padding-top: 10px;
  text-align: left;
  background-color: #2a4866;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
a {
  text-decoration: none;
}
</style>
