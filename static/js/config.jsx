import { Raw } from 'slate'
const DEFAULT_NODE = 'paragraph'

const BLOCKS = {
  PARAGRAPH: DEFAULT_NODE,
  IMAGE: 'image',
  CODE_BLOCK: 'code-block',
  BLOCKQUOTE: 'block-quote',
  TITLE: 'title',
  HEADER_ONE: 'header-one',
  HEADER_TWO: 'header-two',
  LIST_ITEM: 'list-item',
  ORDERED_LIST: 'ordered-list',
  UNORDERED_LIST: 'unordered-list'
}

const INLINES = {
  LINK: 'link',
}

const MARKS = {
  BOLD: 'bold',
  UNDERLINED: 'underlined',
  ITALIC: 'italic',
  CODE: 'code'
}

const INITIAL_STATE = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: DEFAULT_NODE,
      nodes: [
        {
          kind: 'text',
          text: ''
        }
      ]
    }
  ]
}, { terse: true })

const DEFAULT_BLOCK = {
  type: DEFAULT_NODE,
  isVoid: false,
  data: {}
}


export { DEFAULT_BLOCK, DEFAULT_NODE, INITIAL_STATE, BLOCKS, INLINES, MARKS }

