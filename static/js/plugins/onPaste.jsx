import { Html } from 'slate'

const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'unordered-list',
  ol: 'ordered-list',
  blockquote: 'block-quote',
  pre: 'code-block',
  h1: 'header-one',
  h2: 'header-two',
  h3: 'header-two',
  h4: 'header-two',
  h5: 'header-two',
  h6: 'header-two'
}

const MARK_TAGS = {
  strong: 'bold',
  b: 'bold',
  em: 'italic',
  u: 'underlined',
  code: 'code'
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
        type: 'image',
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
        type: 'code',
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
        type: 'link',
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
