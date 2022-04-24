export default class Tile {
  letter = '';
  status = '';

  fill(letter) {
    this.letter = letter.toLowerCase()
  }

  empty() {
    this.letter = ''
  }
}