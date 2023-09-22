<template>
    <div class="numeric-keyboard"></div>
  </template>
  
  <script setup>
  import Keyboard from 'simple-keyboard'
  import 'simple-keyboard/build/css/index.css'
  import { ref, onMounted, defineEmits, defineProps, watch } from 'vue'
  const emit = defineEmits(['onKeyPress', 'onChange'])
  const props = defineProps(['input'])
  const keyboard = ref(null)
  const onKeyPress = (button) => {
    emit('onKeyPress', button)
  }
  function onChange(input) {
    emit('onChange', input)
  }
  watch(
    () => props.input,
    (val) => {
      keyboard.value.setInput(val)
    },
  )
  onMounted(() => {
    keyboard.value = new Keyboard('numeric-keyboard', {
      layout: {
        default: ['1 2 3', '4 6 7', '8 9 0', '{bksp}'],
      },
      onKeyPress: onKeyPress,
      onChange: (input) => onChange(input),
    })
  })
  </script>
  
  <style>
  div.miss {
    @apply bg-gray-500 !important;
    @apply text-white;
  }
  div.found {
    @apply bg-green-600 !important;
    @apply text-white;
  }
  div.hint:not(.found) {
    @apply bg-yellow-500 !important;
    @apply text-white;
  }
  .numeric-keyboard {
    height: 100%;
    align-items: center;
    margin-top:10px;
  }
  </style>