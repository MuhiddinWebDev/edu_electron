<script setup >
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useNotification, useLoadingBar, useMessage } from "naive-ui";
import { useErrorStore } from "./stores/error";
const errorStore = useErrorStore();
const { error, error_code } = storeToRefs(errorStore);
const router = useRouter();
const route = useRoute();
const message = useMessage();
const loadingBar = useLoadingBar();
router.beforeEach(() => {
	loadingBar.start();
});
router.afterEach(() => {
	loadingBar.finish();
	let path_val = route.name;
	document.title = path_val + " - Admin" || Default_title;
});
watch(error, (val) => {
	if (val != "") {
		if (errorStore.error_code == 400) message.error(val[0].param + "  " + val[0].msg);
		else if (errorStore.error_code == 500 || errorStore.error_code == 402) {
			message.error(val);
		} else if (errorStore.error_code == 402) {
			message.error(val);
		}
	}
	setTimeout(() => {
		errorStore.error = "";
	}, 2000);
});
</script>

<template>
	<router-view></router-view>
</template>
