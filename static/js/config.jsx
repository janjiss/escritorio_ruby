import { Raw } from 'slate'
const DEFAULT_NODE = 'paragraph'


// TODO: Implement these as keys everywhere
const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  IMAGE: 'image',
  PARAGRAPH: 'paragraph',
  CODE_BLOCK: 'code-block',
  BLOCK_QUOTE: 'block-quote',
  HEADER_ONE: 'header-one',
  HEADER_TWO: 'header-two',
  LIST_ITEM: 'list-item',
  ORDERED_LIST: 'ordered-list',
  UNORDERED_LIST: 'unordered-list',
  BOLD: 'bold',
  CODE: 'code',
  ITALIC: 'italic',
  UNDERLINED: 'underlined',
}

const INITIAL_STATE = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

const DEFAULT_BLOCK = {
  type: 'paragraph',
  isVoid: false,
  data: {}
}

export { DEFAULT_BLOCK, DEFAULT_NODE, INITIAL_STATE }

