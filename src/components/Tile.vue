<template>
  <div :class="{
      'empty' : letter === ''
    }
    "
    class="
      flex justify-center items-center outline outline-1
      font-semibold uppercase
      m-1 rounded w-14 h-14 text-xl
      sm:w-15 sm:h-15 sm:text-2xl
    ">
    <component :is="TileLetter">{{letter}}</component>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  letter: String,
  status: String,
  state: String,
})

const capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

let TileLetter = computed(() => {
  var stat = capitalize(props.status)
  return defineAsyncComponent(() => import(`./Letter${stat}.vue`))
})
</script>