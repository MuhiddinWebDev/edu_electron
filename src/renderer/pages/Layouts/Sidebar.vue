<script setup>
import { ref, h, onMounted, defineEmits, watch, computed } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useRouter } from "vue-router";
import { NIcon } from "naive-ui";
import { useMessage, useDialog } from "naive-ui";
import userImg from "../../assets/images/user.png";
import {
  LineHorizontal320Filled as threeBtn,
  FullScreenMaximize24Regular as MaxScreenIcon,
  Settings24Filled as SettingIcon,
  WeatherSunny24Filled as SunIcon,
  WeatherMoon24Filled as MoonIcon,
  DocumentAdd16Regular as DokumentAdd,
  DocumentSync16Regular as DokumentSync,
  DocumentTableArrowRight24Regular as Dokumentsverka,
  DocumentTableCheckmark20Regular as Dokumentxisobot,
  DesktopSync20Regular as selling_window,
} from "@vicons/fluent";

import {
  PersonCircleOutline as UserIcon,
  Notifications as NoteIcon,
  LogOutOutline as LogoutIcon,
  Home as homeIcon,
  TimerOutline
} from "@vicons/ionicons5";

import { ReportMoney } from "@vicons/tabler";

import SocketInst from "../../socket/socket";

SocketInst.connect();
SocketInst.socket.on("userConnect", (id) => {
  console.log(`${id} shu id bilan`);
});

const { isFullscreen, enter, exit, toggle } = useFullscreen();
const router = useRouter();
const badge = ref("5");
const settingBtn = ref(false);
const message = useMessage();
const dialog = useDialog();

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const userSetting = (e) => {
  if (e == "settings") {
    settingBtn.value = true;
  } else if (e == "logout") {
    dialog.warning({
      title: "Ogohlantirish!",
      content: "Chiqishni hohlaysizmi?",
      positiveText: "Ha",
      negativeText: "Yo'q",
      onPositiveClick: () => {
        message.success("Ha");
        router.push({ name: "Login" });
      },
      onNegativeClick: () => {
        message.error("Chiqilmadi");
      },
    });
  }
};

const saveSetting = (e) => {
  message.success("Save");
  settingBtn.value = false;
};

const menuOptions = [
  {
    label: "Home",
    key: "Home",
    icon: renderIcon(homeIcon),
  },
  {
    id: "1",
    label: "Ma'lumotlar",
    key: "Kirim",
    icon: renderIcon(DokumentAdd),
    children: [
      {
        id: "3",
        label: "Ta'minotchilar",
        name: "suppliers",
      },
      {
        id: "4",
        label: "Xomashyolar",
        name: "raw_materials",
      },
      {
        id: "5",
        label: "O'lchov birliklar",
        name: "measure",
      },
      {
        id: "6",
        label: "Ishchilar",
        name: "worker",
      },
      {
        id: "7",
        label: "Oshpazlar",
        name: "chiefs",
      },
      {
        id: "8",
        label: "Ofitsantlar",
        name: "waiters",
      },
      {
        id: "9",
        label: "Kassirlar",
        name: "caishers",
      },
      {
        id: "19",
        label: "Printerlar",
        name: "printers",
      },
      {
        id: "14",
        label: "Klientlar",
        name: "clients",
      },
      {
        id: "15",
        label: "Xonalar",
        name: "rooms",
      },
      {
        id: "16",
        label: "Stollar",
        name: "tables",
      },
      {
        id: "17",
        label: "Qo'shimcha xizmatlar",
        name: "extra-service",
      },
      {
        id: "13",
        label: "Taom tarqatish bo'limi",
        name: "branches",
      },
      {
        id: "21",
        label: "Taom guruhi",
        name: "food-group",
      },
      {
        id: "22",
        label: "Taom",
        name: "food",
      }
    ],
  },
  {
    id: "12",
    label: "Xujjatlar",
    icon: renderIcon(DokumentSync),
    key: "Savdo",
    children: [      
      {
        id: "11",
        label: "Kirim xujjati",
        name: "kirim",
      },
      {
        id: "23",
        label: "Savdo xujjati",
        name: "orders",
      },
      {
        id: "10",
        label: "Ishchiga to'lov",
        name: "pay_to_work",
      },
      {
        id: "105",
        label: "Xodimlarga oylik",
        name: "employee-salary"
      },
      {
        id: "25",
        label: "Ta'minotchiga to'lov",
        name: "pay-supplier",
      },
      {
        id: "26",
        label: "Ofitsantga to'lov",
        name: "pay-waiter",
      },
      {
        id: "27",
        label: "Oshpazga to'lov",
        name: "pay-chef",
      },
      {
        id: "28",
        label: "Ishchiga to'lov",
        name: "pay-worker",
      },
      {
        id: 101,
        label: "Klientga to'lov",
        name: "pay-client",
      },
      {
        id: 110,
        label: "Kassirga to'lov",
        name: 'pay-caisher'
      }
    ],
  },
  {
    id: "103",
    label: "Hisobotlar",
    key: 'reports',
    icon: renderIcon(Dokumentsverka),
    name: 'reports'
  },
  {
    id: "99",
    label: "Savdo oyna",
    key: "sellingWindow",
    icon: renderIcon(selling_window),
    name: "sellingWindow",
  },
  {
    id: "100",
    label: "Oshpaz",
    key: 'chief-window',
    icon: renderIcon(TimerOutline),
    name: "chief-window"
  },
  {
    id: "150",
    label: "Oshpaz 2",
    key: 'chiefSellWindow',
    icon: renderIcon(TimerOutline),
    name: 'chiefSellWindow'
  },
  {
    id: "202",
    label: "Tablo",
    key: 'tablo',
    icon: renderIcon(TimerOutline),
    name: 'tablo'
  }
];

const userOption = [
  {
    label: "Profile",
    key: "profile",
    icon: renderIcon(UserIcon),
  },
  {
    label: "Settings",
    key: "settings",
    icon: renderIcon(SettingIcon),
  },
  {
    label: "Logout",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
];

const ThemeAction = ref(false);
const collapsed = ref(false);
const selectMenu = ref(null);
const topMenu = ref(false);
const leftMenu = ref(true);
const emits = defineEmits(["themeupdate"]);
const navbarBtn = () => {
  if (collapsed.value) {
    collapsed.value = false;
  } else {
    collapsed.value = true;
  }
};
const userFullname = ref('')
const panels = ref(["Home"]);
const tabName = ref(null);
const updateValue = (e) => {
  router.push({ name: e });
  selectMenu.value = e;
  tabName.value = e;
  const index = panels.value.findIndex((val) => val == e);
  if (index == -1) {
    panels.value.push(e);
  }
};

const topClick = () => {
  topMenu.value = true;
  leftMenu.value = false;
};
const leftClick = () => {
  topMenu.value = false;
  leftMenu.value = true;
};
watch(ThemeAction, (val) => {
  localStorage.setItem("theme", val);
  emits("themeupdate", val);
  if (val) {
    message.info("Dark theme");
  } else {
    message.info("Light theme");
  }
});
watch(collapsed, (val) => {
  localStorage.setItem("collopsed", val);
});
onMounted(() => {
  userFullname.value = localStorage.getItem('full_name')
  if (localStorage.getItem("collopsed") != null) {
    collapsed.value = JSON.parse(
      localStorage.getItem("collopsed").toLowerCase()
    );
  }
  if (localStorage.getItem("theme") != null) {
    ThemeAction.value = JSON.parse(localStorage.getItem("theme").toLowerCase());
  }
});
const name = ref(1);
const handleClose = (val) => {
  const index = panels.value.findIndex((v) => val === v);
  if (panels.value.length == 1) {
    message.error("The last one!");
  }
  if (panels.value[index] != "Home") {
    panels.value.splice(index, 1);
  }
  if (name.value === val) {
    message.info("Close " + val);
    name.value = panels.value[index];
  }
};
const tabFun = (e) => {
  router.push({ name: e });
  selectMenu.value = e;
};
const logoIcon = new URL('../../assets/bmi.png', import.meta.url).href


</script>
<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="leftMenu ? 64 : 0"
      :width="leftMenu ? 240 : 0"
      :collapsed="collapsed"
      :native-scrollbar="true"
      @collapse="collapsed = true"
      :style="{ height: '100vh' }"
      @expand="collapsed = false"
    >
      <div
        class="navbar-header"
        :class="collapsed ? '' : 'navbar-header_active'"
      >
        <n-image style="border-radius: 50%;" :src="logoIcon" preview-disabled width="50"></n-image>
      </div>
      <n-menu
        :collapsed="collapsed"
        v-model:value="selectMenu"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :on-update:value="updateValue"
      >
      </n-menu>
    </n-layout-sider>
    <n-layout-content>
      <div class="header">
        <div class="header-item" v-if="leftMenu">
          <n-icon @click="navbarBtn" size="24">
            <threeBtn />
          </n-icon>
        </div>
        <div class="header-item" v-if="topMenu">
          <n-avatar
            size="small"
            src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
          ></n-avatar>
          <h1>Kafe</h1>
        </div>
        <div class="headar-item">
          <n-layout-sider :width="topMenu ? 'calc(100vw - 420px)' : 0">
            <n-menu
              mode="horizontal"
              v-model:value="selectMenu"
              :collapsed-icon-size="topMenu ? 24 : 0"
              :options="menuOptions"
              :on-update:value="updateValue"
            >
            </n-menu>
          </n-layout-sider>
        </div>
        <div class="header-item">
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon @click="toggle" size="24">
                <MaxScreenIcon />
              </n-icon>
            </template>
            <span>Full screen window</span>
          </n-popover>
          <n-dropdown
            @select="userSetting"
            animated
            :options="userOption"
            :show-arrow="true"
          >
            <div class="user">
              <n-avatar size="small" :src="userImg"> </n-avatar>
              <p>{{userFullname}}</p>
            </div>
          </n-dropdown>
        </div>
      </div>
      <div class="router-save">
        <n-tabs
          @update:value="tabFun"
          v-model:value="tabName"
          type="card"
          closable
          tab-style="min-width: 120px;"
          :style="{ padding: '4px' }"
          @close="handleClose"
        >
          <n-tab-pane
            v-for="panel in panels"
            :key="panel"
            :tab="panel"
            :name="panel"
            :style="{ padding: '0' }"
          >
          </n-tab-pane>
        </n-tabs>
      </div>
      <n-drawer
        resizable
        v-model:show="settingBtn"
        :default-width="520"
        :style="{ height: '100vh' }"
      >
        <n-drawer-content closable>
          <template #header> Settings </template>
          <template #footer>
            <n-button @click="saveSetting" type="success">Saqlash</n-button>
          </template>
          <n-divider title-placement="center"> Theme mode </n-divider>
          <div class="setting">
            <div class="setting-item">
              <p>Theme type</p>
              <n-switch v-model:value="ThemeAction" size="large">
                <template #checked-icon>
                  <n-icon>
                    <moon-icon />
                  </n-icon>
                </template>
                <template #unchecked-icon>
                  <n-icon>
                    <sun-icon />
                  </n-icon>
                </template>
              </n-switch>
            </div>
            <div class="setting-item">
              <p>Menu</p>
              <n-switch v-model:value="collapsed" size="large"></n-switch>
            </div>
          </div>
          <n-divider title-placement="center"> Menu layout mode </n-divider>
          <div class="setting">
            <div class="setting-item">
              <p>Menu postion top</p>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button type="info" @click="topClick"> Top </n-button>
                </template>
                The menu will be placed at the top
              </n-tooltip>
            </div>

            <div class="setting-item">
              <p>Menu postion left</p>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button type="info" @click="leftClick"> Left </n-button>
                </template>
                The menu will be placed at the left
              </n-tooltip>
            </div>
          </div>
          <n-divider title-placement="center"> Theme system color </n-divider>
          <div class="setting-color">
            <div class="setting-color_item"></div>
          </div>
        </n-drawer-content>
      </n-drawer>
      <RouterView />
    </n-layout-content>
  </n-layout>
</template>


<style>
.navbar-header {
  background-color: "#52244d";
  /* border: 1px solid red; */
  /* min-height: 100vh; */
}

</style>