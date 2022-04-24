const randomElement = function (elements) {
  return elements[Math.floor(Math.random() * elements.length)]
}

const shuffle = function (elements) {
  for (let i = elements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [elements[i], elements[j]] = [elements[j], elements[i]];
  }

  return elements
}
export {
  randomElement,
  shuffle
}