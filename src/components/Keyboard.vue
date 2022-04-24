<template>
  <div @click.stop="$event.target.matches('button') && $emit('keyboardPress', ($event.target.textContent))">
    <div class="flex flex-row justify-center" :key="`keyboard-row-${index}`" v-for="(keys, index) in keyboards">
      <button
        type="button"
        class="
          bg-[#c5c5c5] rounded mx-0.5 my-1 h-11
          p-1 min-w-[31px] text-sm
          sm:min-w-[40px] sm:p-3
        "
        v-for="(key, index) in keys"
        :key="`keyboard-key-${index}`"
        :class="matchingTileForKey(key)?.status"
      >
        {{key}}
      </button>
    </div>
  </div>
</template>


<script setup>
const emit = defineEmits([
  'keyboardPress'
])
const props = defineProps({
  board: Array
})
const keyboards = [
  'QWERTYUIOP'.split(""),
  'ASDFGHJKL'.split(""),
  ['Enter', ...'ZXCVBNM'.split(""), 'Backspace']
]

function matchingTileForKey(key) {
  return props.board.flat()
    .filter((tile) => tile.status)
    .sort((a, b) => {
      if (b.status === 'correct') {
        return 1
      } else {
        return -1
      }
    })
    .find((tile) => tile.letter === key.toUpperCase())
}
</script>


<style scoped>
button.correct {
  background-color: #47d747;
}
button.present {
  background-color: #f7f749;
}
button.invalid {
  background-color: #ff3f3f;
}
button.absent {
  background-color: #888;
}
</style>