import { Raw, Html, Plain, State } from 'slate'
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
  constructor() {
    this.prepData = (state) => this._prepData(state)
  }

  fetch(id, onSuccess) {
    fetch(`/api/posts/${id}`)
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      })
      .then((post) => {
        const editorState = Raw.deserialize(JSON.parse(post.raw), { terse: true })
        onSuccess(editorState, post)
      })
  }

  create(state, onSuccess) {
    fetch('/api/posts', { method: "POST", headers: { "Content-Type": "application/json" }, body: this.prepData(state) })
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      })
      .then((post) => {
        onSuccess(post.id)
      })
  }

  update(state) {
    fetch('/api/posts/1', { method: "PUT", headers: { "Content-Type": "application/json" }, body: this.prepData(state) })
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      })
  }

  _prepData(state) {
    const title = state.document.nodes.first()
    const excerpt = state.document.nodes.get(1)
    const updatedState = state.transform()
      .removeNodeByKey(title.key)
      .apply()

    const raw = Raw.serialize(state)
    const body = HTMLSerializer.serialize(updatedState)

    const payload = {
      title: title.text,
      raw: raw,
      body: body,
      excerpt: excerpt ? excerpt.text : ""
    };

    return JSON.stringify(payload)
  }
}

