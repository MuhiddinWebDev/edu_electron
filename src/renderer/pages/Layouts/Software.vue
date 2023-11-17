<script setup>
import { ref } from "vue";
import {
  TelegramFilled as telegramIcon,
  LocalPhoneSharp as phoneIcon,
} from "@vicons/material";
import { CheckmarkCircle24Filled as checkIcon } from "@vicons/fluent";
import { useNotification } from "naive-ui";
import { useRouter } from "vue-router";
// import SoftwareService from "../../services/softwarePayment.service";
import PaymentService from "../../services/softwarePayment.service";
import { useCounterStore } from "../../stores/counter";

const counter = useCounterStore();
const router = useRouter();
const notification = useNotification();

const checkPermission = async () => {
  let data = {
    soft_id: counter.soft_id,
  };
  PaymentService.checkDate(data).then((res) => {
    console.log(res)
    if (res.live) {
      router.push({ path: "Login" });
    }
  });
};
</script>
<template>
  <div class="software-page">
    <n-result
      status="info"
      title="Dastur amal qilish muddati tugadi."
      description="Dasturchi bilan bog'lanish +998 90 778 87 69"
    >
      <template #footer>
        <div class="connect-devoloper">
          <a href="tel:+998907788769">
            <n-icon size="20">
              <phoneIcon />
            </n-icon>
            Telefon
          </a>
          <a href="https://t.me/xazratqulov_muhiddin">
            <n-icon size="20">
              <telegramIcon />
            </n-icon>
            Telegram
          </a>
        </div>
        <n-button type="success" @click="checkPermission">
          <n-icon>
            <checkIcon />
          </n-icon>
          Tekshirish
        </n-button>
      </template>
    </n-result>
  </div>
</template>
<style scoped>
.software-page {
  width: 100%;
  height: 100vh;
  display: grid;
  align-items: center;
}

.connect-devoloper a {
  text-decoration: none;
  margin: 8px;
  padding: 8px 12px;
  border-radius: 7px;
  color: #fff;
}

.connect-devoloper a:nth-last-child(1) {
  background: #2080f0;
}

.connect-devoloper a:nth-child(1) {
  background: #f7a603;
}

.connect-devoloper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.connect-devoloper a {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
