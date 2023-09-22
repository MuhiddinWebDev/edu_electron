<template>
    <div class="simple-keyboard"></div>
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
    if (button === '{shift}') {
      handleShift()
    }
    handleLang(button)
  }
  function onChange(input) {
    emit('onChange', input)
  }
  function handleLang(button) {
    if (button === '{ru}') {
      keyboard.value.setOptions({
        layoutName: 'ru',
      })
    } else if (button === '{eng}') {
      keyboard.value.setOptions({
        layoutName: 'default',
      })
    }
  }
  function handleShift() {
    let currentLayout = keyboard.value.options.layoutName
    if (currentLayout === 'default') {
      keyboard.value.setOptions({
        layoutName: 'shifted_default',
      })
    } else if (currentLayout === 'shifted_default') {
      keyboard.value.setOptions({
        layoutName: 'default',
      })
    } else if (currentLayout === 'ru') {
      keyboard.value.setOptions({
        layoutName: 'shifted_ru',
      })
    } else {
      keyboard.value.setOptions({
        layoutName: 'ru',
      })
    }
  }
  watch(
    () => props.input,
    (val) => {
      keyboard.value.setInput(val)
    },
  )
  onMounted(() => {
    keyboard.value = new Keyboard('simple-keyboard', {
      layout: {
        default: [
          '{ru} ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          '{tab} q w e r t y u i o p [ ] \\',
          "a s d f g h j k l ; ' {enter}",
          '{shift} z x c v b n m , . / {shift}',
          '@ {space}',
        ],
        shifted_default: [
          '{ru} ~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}',
          '{tab} Q W E R T Y U I O P { } |',
          'A S D F G H J K L : " {enter}',
          '{shift} Z X C V B N M &lt; &gt; ? {shift}',
          '@ {space}',
        ],
        ru: [
          '{eng} ё ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          '{tab} й ц у к е н г ш щ з х ъ [ ] \\',
          "ф ы в а п р о л д ж э ; ' {enter}",
          '{shift} я ч с м и т ь б ю , . / {shift}',
          '@ {space}',
        ],
        shifted_ru: [
          '{ru} Ё ~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}',
          '{tab} Й Ц У К Е Н Г Ш Щ З Х Ъ { } |',
          'Ф Ы В А П Р О Л Д Ж Э : " {enter}',
          '{shift} Я Ч С М И Т Ь Б Ю &lt; &gt; ? {shift}',
          '@ {space}',
        ],
      },
      display: {
        '{ru}': 'Ru',
        '{eng}': 'Eng',
        '{shift}': '⇑ Shift',
        '{enter}': '↵ Enter',
        '{bksp}': '← Backspace',
        '{tab}': 'Tab ↹',
        '{space}': ' ',
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
  </style>