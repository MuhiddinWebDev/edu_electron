<script setup>
import { ref, onMounted, h, inject } from "vue";
import { useRouter } from "vue-router";
import ModelService from "../../../services/studentPay.service";
import html2pdf from "html2pdf.js";

import {
  ArrowDownload24Filled as DownloadIcon,
  Print24Filled as PrintIcon,
} from "@vicons/fluent";

const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close", "no-action"]);
const dayJS = inject("dayJS");
const router = useRouter();
const checkData = ref({});
const checkRef = ref("");

onMounted(() => {
  if (props.type == "check") {
    ModelService.getOne(props.id).then((res) => {
      checkData.value = res;
    });
  }
});

const checkPrint = () => {
  let element = document.getElementById("checkID");
  document.body.innerHTML = element.innerHTML;
  print();
  router.go();
};
const allowClick = ref(true)
const pdfConvert = async () => {
  if(allowClick.value){
    let element = document.getElementById("checkID");
    const pdfOptions = {
      margin: 10,
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .from(element)
      .set(pdfOptions)
      .save(
        `${
          checkData.value.user
            ? "№" +
              checkData.value.id +
              " " +
              checkData.value.user.fullname +
              ".pdf"
            : "document.pdf"
        }`
      );
    setTimeout(() => {
      emit("close");
    }, 1500);
    allowClick.value = false
  }
};
</script>
<template>
  <div class="student-check">
    <div class="student-check-content" id="checkID">
      <div class="student-check-header">
        <h1 class="text-center">
          {{ checkData.branch ? checkData.branch.name : "" }}
        </h1>
        <h1 class="text-center">№{{ checkData.id }} Talaba to'lov</h1>
      </div>
      <div class="student-check_item">
        <h3>Sana</h3>
        <h3>
          {{ dayJS(checkData.datetime * 1000).format("YYYY-MM-DD HH:mm:ss") }}
        </h3>
      </div>
      <div class="student-check_item">
        <h3>Talaba</h3>
        <h3>{{ checkData.user ? checkData.user.fullname : "" }}</h3>
      </div>
      <div class="student-check_item">
        <h3>Guruh</h3>
        <h3>{{ checkData.group ? checkData.group.name : "" }}</h3>
      </div>
      <div class="student-check_item">
        <h3>Kurs</h3>
        <h3>{{ checkData.course ? checkData.course.name : "" }}</h3>
      </div>
      <div class="student-check_item">
        <h3>Kurs narxi</h3>
        <h3>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(checkData.course_price)
          }}
        </h3>
      </div>
      <div class="student-check_item">
        <h3>To'lov turi</h3>
        <h3>{{ checkData.pay_type ? checkData.pay_type.name : "" }}</h3>
      </div>
      <div class="student-check_item">
        <h3>Chegirma</h3>
        <h3>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(checkData.discount_sum)
          }}
        </h3>
      </div>
      <div class="student-check_item">
        <h3>To'landi</h3>
        <h3>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(checkData.pay_sum)
          }}
        </h3>
      </div>
      <div class="student-check_item">
        <h3>Jami</h3>
        <h3>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(checkData.pay_sum - checkData.discount_sum)
          }}
        </h3>
      </div>

      <div class="student-check_item">
        <h3>Izoh</h3>
        <h3>{{ checkData.comment }}</h3>
      </div>
    </div>
    <div class="student-check-footer">
      <n-button type="info" @click="checkPrint">
        <n-icon size="24">
          <PrintIcon />
        </n-icon>
        Chop etish
      </n-button>
      <n-button type="warning" @click="pdfConvert">
        <n-icon size="24">
          <DownloadIcon />
        </n-icon>
        Yuklash
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.student-check_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px dotted black;
  padding: 3px 0px;
}
.student-check-footer {
  padding: 4px 0px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
/* #checkID{
  padding: 10px 20px;
} */
</style>
