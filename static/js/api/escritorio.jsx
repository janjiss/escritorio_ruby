import { Raw, Html } from 'slate'
import React from 'react'

const SERIALIZE_RULES = [
  {
    serialize(object, children) {
      if (object.kind != 'block') return
      switch (object.type) {
        case 'image': return <img src={object.data.get('src')}></img>
        case 'paragraph': return <p>{children}</p>
        case 'block-quote': return <blockquote>{children}</blockquote>
        case 'code-block': return <pre><code>{children}</code></pre>
        case 'header-one': return <h1>{children}</h1>
        case 'header-two': return <h2>{children}</h2>
        case 'list-item': return <li>{children}</li>
        case 'unordered-list': return <ul>{children}</ul>
        case 'ordered-list': return <ol>{children}</ol>
      }
    }
  },
  {
    serialize(object, children) {
      if (object.kind != 'mark') return
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>
        case 'italic': return <i>{children}</i>
        case 'underlined': return <u>{children}</u>
        case 'code': return <code>{children}</code>
      }
    }
  }
]

const HTMLSerializer = new Html({ rules: SERIALIZE_RULES })

export default class Escritorio {
  fetch(onSuccess) {
    fetch('/api/posts/1')
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      })
      .then((response) => {
        const editorState = Raw.deserialize(JSON.parse(response.raw), { terse: true })
        onSuccess(editorState)
      })
  }
  update(state) {
    const raw = Raw.serialize(state: state)
    const body = HTMLSerializer.serialize(state: state)

    const payload = {
      title: "Hello World",
      raw: raw,
      body: body
    };

    const data = new FormData();
    data.append( "json", JSON.stringify( payload ) );

    fetch('/api/posts/1', {method: "PUT", body: data})
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      })
  }
}

