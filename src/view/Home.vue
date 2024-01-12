<template>
  <a-layout id="components-layout-trigger">
    <a-layout-sider v-model:collapsed="state.collapsed" :trigger="null" collapsible>
      <div class="logo" >
        <img class="bigLogo" v-if="!state.collapsed" alt="" src="../assets/images/logo.png" />
        <img v-else alt="" src="../assets/images/logo_2.png" style="width: 48px" />
      </div>
      <div class="antMenu">
        <a-menu
            v-model:openKeys="state.openKeys"
            v-model:selectedKeys="state.selectedKeys"
            mode="inline"
            theme="dark"
            :inline-collapsed="state.collapsed"
            :items="state.menuList"
            @select="routeTo"
            @openChange="openChange"
        ></a-menu>
      </div>
    </a-layout-sider>

    <a-layout>
      <a-layout-header  style="background: #fff; padding: 0;" >
        <menu-unfold-outlined
            v-if="state.collapsed"
            class="trigger"
            @click="toggleCollapsed"
        />
        <menu-fold-outlined v-else class="trigger" @click="toggleCollapsed" />
      </a-layout-header>
      <a-tabs v-model:activeKey="tabStats.activeKey" hide-add type="editable-card" @change="tabChange" @edit="onEdit">
        <a-tab-pane v-for="pane in tabStats.panes" :key="pane.text" :tab="pane.title" :closable="tabStats.panes.length>1">
        </a-tab-pane>
      </a-tabs>
      <a-layout-content
          :style="{
            padding: '0 10px 0 10px',
            boxSizing: 'border-box',
            minHeight: '280px',
            height: '100%',
            overflow: 'auto',
          }"
      >
        <keep-alive v-if="route.meta.keepAlive">
          <router-view></router-view>
        </keep-alive>
        <router-view v-if="!route.meta.keepAlive"></router-view>
      </a-layout-content>



    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>

import {h, onMounted, reactive, VNode, watch} from 'vue';
import {useUserStore} from '@/store/user'
import {useRoute, useRouter} from "vue-router";
import {
  AppstoreOutlined,
  DesktopOutlined,
  InboxOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue';

const store = useUserStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  collapsed: false,
  inlineIndent:24,
  selectedKeys: [route.path] ,
  openKeys: [] as any[] ,
  menuList:[] as any[],

});

const tabStats = reactive({
  activeKey:'',
  panes:[] as any[]
})
const onEdit = (targetKey: string) => {
  if(tabStats.panes.length==1) return
  remove(targetKey);
};

const tabChange = ((e:any)=>{
  router.push(e)
})
const remove = (targetKey: string) => {
  for (let i = 0; i < tabStats.panes.length; i++) {
    if (tabStats.panes[i].text == targetKey) {
      tabStats.panes.splice(i, 1)
      if (targetKey == tabStats.activeKey && targetKey == route.path) {
        router.push(tabStats.panes[0].text)
      } else if (targetKey !== tabStats.activeKey  && targetKey == route.path) {
        if (i == 0) {
          router.push(tabStats.panes[i].text)
        } else {
          router.push(tabStats.panes[i - 1].text)
        }

      }
    }
  }
};
onMounted(()=>{
  store.getUserRole().then(res=>{
    state.menuList = convertMenu(res)

    if(route.path=='/home'){
      router.push(state.menuList[0].children[0].text)
      return
    }
    panesPushHandle()

  })


})
interface IConvertedMenuItem {
  key: string;
  id: string;
  icon: () => VNode;
  label: any;
  title: any;
  text:any;
  children?: IConvertedMenuItem[];
}
type IconName = string;


const getIconComponent = (iconName: IconName): (() => VNode) => {
  const icons: Record<IconName, () => VNode> = {
    PieChartOutlined: () => h(PieChartOutlined),
    MailOutlined: () => h(MailOutlined),
    DesktopOutlined: () => h(DesktopOutlined),
    InboxOutlined: () => h(InboxOutlined),
    AppstoreOutlined: () => h(AppstoreOutlined),
  };

  return icons[iconName] || null;
};
const convertMenu = (menu: any[]): IConvertedMenuItem[] => {
  return menu.map((item) => {
    const convertedItem: IConvertedMenuItem = {
      key: String(item.text),
      icon: getIconComponent(item.icon),
      id:String(item.id),
      label: item.name,
      title: item.name,
      text:item.text
      // 添加 children 属性并初始化为空数组
    };

    if (item.menu && item.menu.length > 0) {
      convertedItem.children = convertMenu(item.menu);
    }

    return convertedItem;
  });
};


const toggleCollapsed =()=> {
  state.collapsed = !state.collapsed;
  if (state.collapsed) {
    state.openKeys = [];
  } else {
    state.openKeys = [
        route.path.substr(0, route.path.lastIndexOf("/"))
      ];

  }
}

const openChange = (openKeys:any) => {
  state.openKeys = openKeys
}


const   routeTo = ({  key }:any)=> {
  router.push(key);
  state.selectedKeys = [key];

}

const panesPushHandle=()=>{
  const extractedChildren = state.menuList.flatMap(item => item.children);
  const newTab = extractedChildren.find((item:any)=>item.text == route.path)
  if(newTab){
    const isPanes = tabStats.panes.find(item=>item.text == newTab.text)
    if(!isPanes){
      tabStats.panes.push(newTab)
    }
    tabStats.activeKey = newTab.text
  }
}

watch(
    () => router.currentRoute.value.path,(toPath) => {
      if(toPath=='/home') return
      state.selectedKeys=[toPath]
      let openKey = toPath.substr(0,toPath.lastIndexOf("/"))
      if(!state.openKeys.includes(openKey)){
        state.openKeys.push(openKey)
      }
      panesPushHandle()

      //要执行的方法
    },{immediate: true,deep: true}
);





</script>

<style scoped>

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}



.antMenu {
  max-height: calc(100% - 106px);
  overflow-y: auto;
}

.antMenu::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.antMenu::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(84, 92, 100, 0.8);
}

.antMenu::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}


.logo {
  cursor: pointer;
}



:deep(.ant-tabs-nav){
    margin: 0 !important;
    padding: 0 16px;
}
:deep(.ant-tabs-nav::before){
  border: none;
}


</style>
