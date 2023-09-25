// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'

// export const useErrorStore = defineStore('error', () => {
//   const error_text = ref(0);
//   return { error_text }
// })
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
  state: () => {
    return { error: '', error_text: null }
  },
});
