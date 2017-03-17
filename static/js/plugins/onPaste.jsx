import { Html } from 'slate'
import { BLOCKS, MARKS, INLINES } from '../config'

const BLOCK_TAGS = {
  p:          BLOCKS.PARAGRAPH,
  li:         BLOCKS.LIST_ITEM,
  ul:         BLOCKS.UNORDERED_LIST,
  ol:         BLOCKS.ORDERED_LIST,
  pre:        BLOCKS.CODE_BLOCK,
  h1:         BLOCKS.HEADER_ONE,
  h2:         BLOCKS.HEADER_TWO,
  h3:         BLOCKS.HEADER_TWO,
  h4:         BLOCKS.HEADER_TWO,
  h5:         BLOCKS.HEADER_TWO,
  h6:         BLOCKS.HEADER_TWO,
  blockquote: BLOCKS.BLOCKQUOTE
}

const MARK_TAGS = {
  strong: MARKS.BOLD,
  b:      MARKS.BOLD,
  em:     MARKS.ITALIC,
  u:      MARKS.UNDERLINED,
  code:   MARKS.CODE
}

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName]
      if (!block) return
      return {
        kind: 'block',
        type: block,
        nodes: next(el.children)
      }
    }
  },
  {
    // Special case for images, where we need to grab src
    deserialize(el, next) {
      if (el.tagName != 'img') return
      return {
        kind: 'block',
        type: BLOCKS.IMAGE,
        nodes: next(el.children),
        data: {
          src: el.attribs.src
        }
      }
    }
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName]
      if (!mark) return
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.children)
      }
    }
  },
  {
    // Special case for code blocks, which need to grab the nested children.
    deserialize(el, next) {
      if (el.tagName != 'pre') return
      const code = el.children[0]
      const children = code && code.tagName == 'code'
        ? code.children
        : el.children

      return {
        kind: 'block',
        type: BLOCK.CODE_BLOCK,
        nodes: next(children)
      }
    }
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName != 'a') return
      return {
        kind: 'inline',
        type: INLINES.LINK,
        nodes: next(el.children),
        data: {
          url: el.attribs.href
        }
      }
    }
  }
]

const serializer = new Html({ rules: RULES })

export default function onPaste() {
  return {
    onPaste: (e, data, state) => {
      if (data.type != 'html') return
      if (data.isShift) return

      const { document } = serializer.deserialize(data.html)

      return state
        .transform()
        .insertFragment(document)
        .apply()
    }
  }
}
