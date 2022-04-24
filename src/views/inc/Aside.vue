<template>
  <el-row>
    <el-col>
      <el-menu class="el-menu-vertical-demo" background-color="#102847" text-color="#fff" active-text-color="#88B5EA" :router="true">
        <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path">
          <i :class="'el-icon-'+item.icon"></i>
          <span slot="title">{{item.label}}</span>
        </el-menu-item>
        <el-submenu :index="item.label" v-for="item in hasChildren" :key="item.path">
          <template slot="title">
            <i :class="'el-icon-'+item.icon"></i>
            <span>{{item.label}}</span>
          </template>

          <el-menu-item-group>
            <el-menu-item v-for="(subItem,subIndex) in item.children" :key="subIndex" :index="subItem.path">
              <i :class="'el-icon-'+subItem.icon"></i>
              {{subItem.label}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menu: [
        {
          path: '/home/index',
          name: 'index',
          label: '首页',
          icon: 'pie-chart',
          url: 'Index'
        },
        {
          path: '/home/borad',
          name: 'borad',
          label: '公告管理',
          icon: 'edit-outline',
          url: 'Borad'
        },

        {
          label: '对象管理',
          icon: 'user',
          children: [
            {
              path: '/home/patient',
              name: 'patient',
              label: '患者管理',
              icon: 's-custom',
              url: '/home/Patient'
            },
            {
              path: '/home/doctor',
              name: 'doctor',
              label: '医生管理',
              icon: 'user-solid',
              url: '/home/Doctor'
            }
            /* {
              path: '/home/admin',
              name: 'admin',
              label: '管理员管理',
              icon: 's-check',
              url: '/home/Admin'
            } */
          ]
        },
        {
          label: '系统管理',
          icon: 'setting',
          children: [
            {
              path: '/home/role',
              name: 'role',
              label: '角色管理',
              icon: 's-management',
              url: '/home/Role'
            },
            {
              path: '/home/user',
              name: 'user',
              label: '用户管理',
              icon: 's-check',
              url: '/home/User'
            }
          ]
        },
        {
          path: '/home/register',
          name: 'register',
          label: '预约管理',
          icon: 'chat-square',
          url: 'Register'
        },
        {
          path: '/home/room',
          name: 'room',
          label: '科室管理',
          icon: 'house',
          url: 'Room'
        },
        {
          path: '/home/drug',
          name: 'drug',
          label: '药方管理',
          icon: 'notebook-2',
          url: 'Drug'
        },
        {
          path: '/home/charge',
          name: 'charge',
          label: '收费管理',
          icon: 'bank-card',
          url: 'Charge'
        },
      ]
    }
  },
  computed: {
    noChildren() {
      return this.menu.filter(item => !item.children)
    },
    hasChildren() {
      return this.menu.filter(item => item.children)
    }
  }
}
</script>

<style>
.el-menu-item i {
  padding-left: 15px;
}
.el-menu-item-group .el-menu-item i {
  padding-left: 0;
}
.el-submenu i {
  padding-left: 15px;
}
</style>