import Mobiledoc from 'mobiledoc-kit'
const domParser = new DOMParser()

const imageCard = {
  name: 'image-card',
  type: 'dom',
  render() {
    let el = $('<img src="http://lorempixel.com/1000/600/"></img>')
    return el[0]
  }
};

var simpleMobiledoc = {
  version: "0.3.1",
  markups: [],
  atoms: [],
  cards: [],
  sections: [
    [1, "p", [
      [0, [], 0, "#hello"]
    ]]
  ]
};

const element = document.querySelector('#editor');
const options = { mobiledoc: simpleMobiledoc, cards: [imageCard]};
const editor = new Mobiledoc.Editor(options);

const h1Button            = document.getElementById("h1-button")
const h2Button            = document.getElementById("h2-button")
const h3Button            = document.getElementById("h3-button")
const boldButton          = document.getElementById("bold-button")
const addImageButton      = document.getElementById("add-image-button")
const blockquoteButton    = document.getElementById("blockquote-button")
const unorderedListButton = document.getElementById("unordered-list-button")
const orderedListButton   = document.getElementById("ordered-list-button")

h1Button.addEventListener("click",() => {
  editor.toggleSection('h1');
});

h2Button.addEventListener("click",() => {
  editor.toggleSection('h2');
});

h3Button.addEventListener("click",() => {
  editor.toggleSection('h3');
});

unorderedListButton.addEventListener("click",() => {
  editor.toggleSection('ul');
});

orderedListButton.addEventListener("click",() => {
  editor.toggleSection('ol');
});

boldButton.addEventListener("click",() => {
  editor.toggleMarkup('strong');
});

addImageButton.addEventListener("click",() => {
  editor.insertCard('image-card');
});

blockquoteButton.addEventListener("click",() => {
  editor.toggleSection('blockquote');
});

editor.render(element);
