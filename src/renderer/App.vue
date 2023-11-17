<script setup >
import { watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useNotification, useLoadingBar, useMessage } from "naive-ui";
import { useErrorStore } from "./stores/error";
import { useCounterStore } from "./stores/counter";

const loadItem = useCounterStore();
const errorStore = useErrorStore();
const { error, error_text } = storeToRefs(errorStore);
const router = useRouter();
const route = useRoute();
const message = useMessage();
const loadingBar = useLoadingBar();
const notification = useNotification();

router.beforeEach(() => {
	loadingBar.start();
	loadItem.loadAction = true;
});
router.afterEach(() => {
	loadingBar.finish();
	loadItem.loadAction = false;
	let path_val = route.name;
	document.title = path_val + " - Admin" || Default_title;
});
watch(error_text, (val) => {
	if (val != "") {
      notification.error({
        content: "Xatolik",
        meta: val.toString(),
        duration: 4000,
        keepAliveOnHover: true,
      });
    }
    setTimeout(() => {
		errorStore.error_text = "";
    }, 1000);
});
</script>

<template>
	<router-view></router-view>
</template>
