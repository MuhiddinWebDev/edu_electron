import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const theme = ref(false);
  const itemsTranslate = ref([]);
  const coursePlan = ref(false);
  const teacherCourse = ref(false);
  const lesson = ref(false);
  const loadAction = ref(true);
  const soft_id = ref("OM0002")
  return {coursePlan, teacherCourse,theme, itemsTranslate, lesson, loadAction, soft_id}
})
// //////// soft_id /////////////////// start /////////////
/// BDM uchun => soft_id = BDM
/// Farg'ona shahar Platon o'quv markaz uchun => soft_id = "OM0002"
/// Farg'ona Yozyavon Leader Learn Center  o'quv markaz uchun => soft_id = "OM0002"
// //////// soft_id /////////////////// end /////////////