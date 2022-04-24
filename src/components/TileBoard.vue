<template>
  <div class="text-white rounded-2xl relative">
    <span
      class="content-none block absolute -inset-[3px] -z-10 rounded-2xl"
    />
    <div :key="`row-${index}`" v-for="(row, index) in board"
      :class="{
        'row current': currentRowIndex === index,
        'shake': state === 'invalid_word'
      }"
      class="flex flex-row animate-pulse-background w-full"
    >
      <Tile
        v-for="(tile, tileIndex) in row"
        :key="`tile-${tileIndex}`"
        :letter="tile.letter"
        :status="tile.status"
        :class="currentRowOutline(index)"
      />
    </div>
  </div>
</template>

<script setup>
import Tile from './Tile.vue'

const props = defineProps({
  board: Array,
  currentRowIndex: Number,
  state: String,
})

const currentRowOutline = function(index) {
  if (props.currentRowIndex != index) {
    return "outline-[#7cc0d8]/[.5]"
  }

  if (props.state === 'invalid_word') {
    return "outline-[#f87171]/[.5] text-[#ff3f3f]"
  }

  return "outline-[#7cc0d8]/[.5] text-[#496e9e]"
}

</script>

<style scoped>
.row.current .empty:first-child, :not(.empty) + .empty  {
    animation: fade 2s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
}

@keyframes fade {
    50% {
        background: rgba(255, 255, 255, .05)
    }
}

.row.current.shake {
  animation: shake 0.8s;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-3px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(4px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-7px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(6px, 0, 0);
  }
}
</style>