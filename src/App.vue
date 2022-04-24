<template>
  <Message
    class="mt-16"
    @ask-bird="askBird"
    :current-guess="currentGuess"
    :complete-percentage="completePercentage"
    :guess-allowed="guessAllowed"
    :previous-percentage="previousPercentage"
    :remaining-guesses="remainingGuesses"
    :state="state"
    :word="word"
    :start-game-time="startGameTime"
  />
  <TileBoard
    class="mt-3"
    :board="board"
    :current-row-index="currentRowIndex"
    :state="state"
  />
  <Keyboard
    class="mt-3"
    @keyboard-press="play"
    :board="board"
  />

  <div class="fixed right-2 bottom-1 text-white text-xs">Icon created by <a href="https://icons8.com/">icon8</a></div>
</template>

<script setup>
// component setup
import Keyboard from './components/Keyboard.vue'
import Message from './components/Message.vue'
import TileBoard from './components/TileBoard.vue'

// library
import { ref, reactive, computed } from 'vue'
import { secret, words } from './js/word'
import Tile from './js/tile'
import { randomElement } from './js/helper'

// game setup
// Grab a random word from secret list
const word = randomElement(secret);
const guessAllowed = word.length

let board = reactive(
  Array.from({length: guessAllowed}, () => {
    return Array.from({length: word.length}, () => new Tile)
  })
)
let startGameTime = reactive(new Date)
let currentRowIndex = ref(0)
let currentIndex = computed(function() {
  let index = currentRow.value.findIndex(r => r.letter == '')
  return index === -1 ? word.length : index
})
let state = ref('welcome')
let previousPercentage = ref(0)
let completePercentage = ref(0)
let currentRow = computed(() => board[currentRowIndex.value])
let currentGuess = computed(() => currentRow.value.map(tile => tile.letter).join(''))
let remainingGuesses = computed(() => guessAllowed - currentRowIndex.value - 1)

function play (key) {
  if (state.value === 'win' || state.value === 'lose') {
    return
  }

  if (key === 'Enter' && currentGuess.value.length === word.length) {
    submitGuess()
    return
  }

  // Delete a letter from tile
  if (key === 'Backspace' && currentIndex.value) {
    state.value = 'typing'
    currentRow.value[currentIndex.value - 1].letter = ''
  }

  // No tile to fill in in this row
  if (currentIndex.value == word.length) {
    return
  }

  // Fill a letter to the tile
  if (/^[A-Za-z]$/.test(key)) {
    state.value = 'typing'

    // Reset data on every new guess
    if (currentIndex.value === 0) {
      previousPercentage.value = completePercentage.value
      completePercentage.value = 0
    }

    // Game started when player fill in the first key
    if (currentRowIndex == 0 && currentIndex.value === 0) {
      startGameTime = new Date()
    }

    // Convert all to uppercase for comparision
    currentRow.value[currentIndex.value].letter = key.toUpperCase()
  }
}

function submitGuess() {
  // not a valid word
  if (!words.includes(currentGuess.value)) {
    state.value = 'invalid_word'
    return
  }

  // update tile status (absend, present, correct)
  updateTileStatus()

  if (currentGuess.value === word) {
    state.value = 'win'
    return
  }

  if (remainingGuesses.value === 0) {
    state.value = 'lose'
    return
  }

  // judge for answer
  state.value = 'judge'
  currentRowIndex.value++
}

function updateTileStatus () {
  let tword = [...word]
  currentRow.value.forEach(function(tile, index) {
    if (tile.letter === tword[index]) {
      tile.status = 'correct'
      completePercentage.value += 20;
      tword[index] = ''
    }
  })

  currentRow.value.forEach(function(tile, index) {
    if (!tile.status) {
      if (tword.includes(tile.letter)) {
        tile.status = 'present'
        completePercentage.value += 10;
      } else {
        tile.status = 'absent'
      }
    }
  })
}

function askBird() {
  state.value = 'ask-bird'
}

window.addEventListener("keydown", (e) => play(e.key))
window.onresize = function(){
  if((window.outerHeight - window.innerHeight) > 100) {
    state.value = 'cheat'
  }
}
</script>
