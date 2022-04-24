import { ref, computed } from "vue";

export default function () {
  const count = ref(0);
  const double = computed(() => count.value * 2)
  function endGame() {
    count.value++;
  }
  return {
    startGame,
    endGame,
  }
}