<template>
  <div class="flex">
      <div @click="askBird" class="-ml-20">
        <img v-if="state === 'cheat'" src="../assets/cheat_bird.png" width="40" alt="">
        <img v-else src="../assets/bird.png" width="40" alt="">
      </div>

      <div :class="bubblePosition" class="absolute -ml-10 text-white text-sm bg-gray-300/25 px-2.5 py-1 rounded">
        <span class="flex items-center" v-html="message"></span>
        <span
          class="absolute bottom-0 left-3 -mb-2.5"
          style="border: 10px solid transparent; border-top-color: rgba(209, 213, 219, 0.25); border-bottom: 0; border-left: 0;">
        </span>
      </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { randomElement, shuffle } from '../js/helper'
const emit = defineEmits([
  'askBird'
])

const props = defineProps({
  currentGuess: String,
  guessAllowed: Number,
  remainingGuesses: Number,
  previousPercentage: Number,
  completePercentage: Number,
  state: String,
  startGameTime: Date,
  word: String,
})

const gameTime = function() {
  let millisec = Math.abs(new Date().getTime() - props.startGameTime.getTime());
  let sec = millisec / 1000;
  let min = Math.round(sec / 60);
  sec = Math.round(sec%60);

  if (min > 0) {
    return `${min}m ${sec}s`
  }
  return `${sec}s`
}

let birdHint = ref('')
function askBird() {
  emit('askBird')
  birdHint.value =  randomElement(
    [
      `Don't ask me, <br> I'm not gonna give you <br> any clues.`,
      `OK la, I will give you a hint. <br> A-Z pick a letter.`
    ]
  )
}

let bubblePosition = computed(function() {
  let count = (message.value.match(/<br>/g) || []).length;
  if (count >= 2) {
    return "-mt-16"
  } else if (count >= 1) {
    return "-mt-12"
  }

  return "-mt-8"
})

let message = computed(() => {
  if (props.state === 'win') {
    if (props.remainingGuesses == props.guessAllowed - 1) {
      return `I'm pretty sure,<br> you are cheating.<br> shame on you !!!`
    }

    return  `
      Congrats, You win! <br>You just wasted <br> ${gameTime()} in birdle.
    `
  }

  if (props.state === 'lose') {
    return  `
      The words is "${props.word}"<br>You just wasted  ${gameTime()} <br> in birdle.
    `
  }

  if (props.state == 'ask-bird') {
    return birdHint.value
  }

  if (props.state === 'invalid_word') {
    return  `
      Why do you not study? <br>
      This is not a word! <br>
      Haiyaa...
    `
  }

  if (props.state.startsWith('typing')) {
    return '...'
  }

  if (props.state === 'cheat') {
    return  `
      Hey! no cheating.<br>
      My eyes are on you!
    `
  }

  if (props.remainingGuesses === 0) {
    return  `
      Last chance! <br> I think you gonna lose.
    `
  }

  if (props.state == 'judge') {
    if (props.completePercentage === 0 ) {
      return randomElement(
        [
          `Oh no!<br>Don't buy TOTO today...`,
          `Haiya, your mom knows <br> you scoring 0 or not ?!!`
        ]
      )
    }

    if (props.previousPercentage === props.completePercentage) {
      return `Haiz...<br> You've no progress at all, <br>just like your pathetic life.`
    }

    if (props.completePercentage <= 49) {
      if (props.remainingGuesses <= 1) {
        return `Hey, You are too slow,<br> you gonna lose the game.`
      }

      return randomElement([
        `OK not bad,<br> You are making some progress,<br> but is not enough.`,
        `OK OK,<br> That helps a little bit,<br> just a little bit...`
      ])
    }

    if (props.completePercentage >= 50 && props.completePercentage <= 69) {
      return randomElement([
        `I think you already have <br>some clues,<br>come on keep thinking.`,
      ])
    }

    if (props.completePercentage >= 70) {
      return `It's close, <br>but not close enough.`
    }
  }

  return `
    Welcome to birdle! <br>
    Try to guess my word.
  `
})
</script>
