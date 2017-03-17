import { Raw, Html, Plain, State } from 'slate'
import React from 'react'

const SERIALIZE_RULES = [
  {
    serialize(object, children) {
      if (object.kind != 'block') return
      switch (object.type) {
        case 'image': return <img src={object.data.get('src')}></img>
        case 'paragraph': return <p>{ children }</p>
        case 'block-quote': return <blockquote>{ children }</blockquote>
        case 'code-block': return <pre><code>{ children }</code></pre>
        case 'header-one': return <h1>{ children }</h1>
        case 'header-two': return <h2>{ children }</h2>
        case 'title': return <h1>{ children }</h1>
        case 'list-item': return <li>{ children }</li>
        case 'unordered-list': return <ul>{ children }</ul>
        case 'ordered-list': return <ol>{ children }</ol>
      }
    }
  },
  {
    serialize(object, children) {
      if (object.kind != 'inline') return
      switch (object.type) {
        case 'link': return <a href={object.data.get('url')}>{ children }</a>
      }
    }
  },
  {
    serialize(object, children) {
      if (object.kind != 'mark') return
      switch (object.type) {
        case 'bold': return <strong>{ children }</strong>
        case 'italic': return <i>{ children }</i>
        case 'underlined': return <u>{ children }</u>
        case 'code': return <code>{ children }</code>
      }
    }
  }
]

export default new Html({ rules: SERIALIZE_RULES })
