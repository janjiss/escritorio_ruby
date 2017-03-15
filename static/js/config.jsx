import { Raw } from 'slate'
const DEFAULT_NODE = 'paragraph'

const INITIAL_STATE = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
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
  type: 'paragraph',
  isVoid: false,
  data: {}
}

export { DEFAULT_BLOCK, DEFAULT_NODE, INITIAL_STATE }

