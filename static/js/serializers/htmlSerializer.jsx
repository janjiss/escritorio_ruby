import { Raw, Html, Plain, State } from 'slate'
import React from 'react'
import { BLOCKS, MARKS, INLINES } from '../config'

const SERIALIZE_RULES = [
  {
    serialize(object, children) {
      if (object.kind != 'block') return
      switch (object.type) {
        case BLOCKS.IMAGE: return <img src={object.data.get('src')}></img>
        case BLOCKS.PARAGRAPH: return <p>{ children }</p>
        case BLOCKS.BLOCKQUOTE: return <blockquote>{ children }</blockquote>
        case BLOCKS.CODE_BLOCK: return <pre><code>{ children }</code></pre>
        case BLOCKS.HEADER_ONE: return <h1>{ children }</h1>
        case BLOCKS.HEADER_TWO: return <h2>{ children }</h2>
        case BLOCKS.TITLE: return <h1>{ children }</h1>
        case BLOCKS.LIST_ITEM: return <li>{ children }</li>
        case BLOCKS.UNORDERED_LIST: return <ul>{ children }</ul>
        case BLOCKS.ORDERED_LIST: return <ol>{ children }</ol>
      }
    }
  },
  {
    serialize(object, children) {
      if (object.kind != 'inline') return
      switch (object.type) {
        case INLINES.LINK: return <a href={object.data.get('url')}>{ children }</a>
      }
    }
  },
  {
    serialize(object, children) {
      if (object.kind != 'mark') return
      switch (object.type) {
        case MARKS.BOLD: return <strong>{ children }</strong>
        case MARKS.ITALIC: return <i>{ children }</i>
        case MARKS.UNDERLINED: return <u>{ children }</u>
        case MARKS.CODE: return <code>{ children }</code>
      }
    }
  }
]

export default new Html({ rules: SERIALIZE_RULES })
