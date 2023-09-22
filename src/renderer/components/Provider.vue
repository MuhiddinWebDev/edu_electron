<script setup>
import { computed, ref, onMounted } from "vue";
import SocketInst from '../socket/socket'
import App from "../App.vue";
import { darkTheme, lightTheme } from "naive-ui";
SocketInst.connect()
SocketInst.socket.on('userConnect', (id) => {
  console.log(`${id} shu id bilan`)
})
// const counter = useCounterStore()
const themes = ref(lightTheme);
const uzUz = {
  name: "uz-UZ",
  global: {
    undo: "Bekor qilish",
    redo: "Qayta qiling",
    confirm: "Tasdiqlash",
  },
  Popconfirm: {
    positiveText: "Tasdiqlash",
    negativeText: "Bekor qilish",
  },
  Cascader: {
    placeholder: "Iltimos tanlang",
    loading: "Yuklanmoqda",
    loadingRequiredMessage: (label) =>
      `Belgilashdan oldin ${label} ning barcha ichki elementlarini tanlang.`,
  },
  Time: {
    dateFormat: "dd.MM.yyyy",
    dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
  },
  DatePicker: {
    yearFormat: "yyyy",
    monthFormat: "MM",
    dayFormat: "eeeeee",
    yearTypeFormat: "yyyy",
    monthTypeFormat: "yyyy-MM",
    dateFormat: "yyyy-MM-dd",
    dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
    quarterFormat: "yyyy-qqq",
    clear: "Tozalash",
    now: "Hozir",
    confirm: "Tasdiqlash",
    selectTime: "Vaqtni tanlang",
    selectDate: "Sanani tanlang",
    datePlaceholder: "Sanani tanlang",
    datetimePlaceholder: "Sana va vaqtni tanlang",
    monthPlaceholder: "Oyni tanlang",
    yearPlaceholder: "Yilni tanlang",
    quarterPlaceholder: "Chorakni tanlang",
    startDatePlaceholder: "Boshlanish sanasi",
    endDatePlaceholder: "Tugash sanasi",
    startDatetimePlaceholder: "Boshlanish sanasi va vaqti",
    endDatetimePlaceholder: "Tugash sanasi va vaqti",
    monthBeforeYear: true,
    firstDayOfWeek: 6,
    today: "Bugun",
  },
  DataTable: {
    checkTableAll: "Jadvaldagi barchasini tanlash",
    uncheckTableAll: "Jadvaldagi barcha tanlovni olib tashlash",
    confirm: "Tasdiqlash",
    clear: "Tozalash",
  },
  Transfer: {
    sourceTitle: "Manba",
    targetTitle: "Maqsad",
  },
  Empty: {
    description: "Maʼlumot yoʻq",
  },
  Select: {
    placeholder: "Iltimos tanlang",
  },
  TimePicker: {
    placeholder: "Vaqtni tanlang",
    positiveText: "OK",
    negativeText: "Bekor qilish",
    now: "Hozir",
  },
  Pagination: {
    goto: "O'tish",
    selectionSuffix: "sahifa",
  },
  DynamicTags: {
    add: "Qo'shish",
  },
  Log: {
    loading: "Yuklanmoqda",
  },
  Input: {
    placeholder: "Iltimos, kiriting",
  },
  InputNumber: {
    placeholder: "Iltimos, kiriting",
  },
  DynamicInput: {
    create: "Yaratmoq",
  },
  ThemeEditor: {
    title: "Mavzu muharriri",
    clearAllVars: "Barcha o'zgaruvchilarni tozalash",
    clearSearch: "Qidiruvni tozalash",
    filterCompName: "Filtr komponenti nomi",
    filterVarName: "Filter Variable Name",
    import: "Import",
    export: "Export",
    restore: "Reset to Default",
  },
  // TODO: translation
  Image: {
    tipPrevious: "Oldingi rasm (←)",
    tipNext: "Keyingi rasm (→)",
    tipCounterclockwise: "Soat miliga teskari",
    tipClockwise: "Soat yo'nalishi bo'yicha",
    tipZoomOut: "Kichraytirish",
    tipZoomIn: "Kattalashtirish",
    tipClose: "Yopish (Esc)",
  },
};
const changeTheme = (e) => {
  if (e) {
    themes.value = darkTheme;
  } else {
    themes.value = lightTheme;
  }
};
const themeOverrides = {
    common: {
      primaryColor: '#0073fa',
      primaryColorHover: '#0073fa',
      primaryColorPressed: '#0073fa',
      primaryColorSuppl: '#0073fa',
      textColor2: '#000',
      borderRadius: '7px',
      modalColor: '#eee',
      fontWeight: '700',
      fontSize: '16px',
      lineHeight: '20px',
      textColorDisabled: '#000',
    },
    "Tabs": {
      "tabTextColorActiveBar": "#FDBA81FF",
      "tabTextColorActiveLine": "#FDBA81FF",
      "tabTextColorHoverLine": "#FDBA81FF",
      "tabTextColorHoverBar": "#FDBA81FF",
      "barColor": "#FDBA81FF",
      "tabTextColorActiveCard": "#FDBA81FF",
    },
    "Menu": {
      "color": "#2d364c",
      "itemColorHover": "#0cb754",
      "itemColorActive": "#0cb754",
      "groupTextColorInverted": "rgba(165, 190, 247, 1)",
      "groupTextColor": "rgba(255, 255, 255, 1)",
      "itemTextColor": "rgba(252, 252, 252, 1)",
      "itemTextColorActive": "#FFFFFFFF",
      "itemColorActiveHover": "#0cb754",
      "itemTextColorActiveHover": "#F1FBF6FF",
      "itemTextColorHover": "rgba(255, 255, 255, 1)",
      "dividerColor": "#C7C7F9FF",
      "itemIconColor": "#fff",
      "itemIconColorHover": "#fff",
      "arrowColor": "#fff",
      "arrowColorHover": "#fff",
      "itemIconColorActive": "#fff",
      "itemTextColorChildActive": "#fff",
      "itemIconColorChildActive": "#fff",
      "arrowColorChildActive": "#fff",
      "arrowColorChildActiveHover": "#fff",
      "itemTextColorChildActiveHover": "#fff",
      "itemIconColorChildActiveHover": "#fff",
      "itemIconColorActiveHover": "#fff",
      "itemIconColorCollapsed": "#fff",
      "fontSize":"14px"
    },
    Button: {
      // textColor: '#0922e3',
    },
    Collapse: {
    },
    // ...
  }
</script>
<template>
  <n-config-provider :theme="themes" :theme-overrides="themeOverrides" :locale="uzUz">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-loading-bar-provider>
              <App />
            </n-loading-bar-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
