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

const HTMLSerializer = new Html({ rules: SERIALIZE_RULES })

export default class Escritorio {
  fetch = (id, onSuccess) => {
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

  create = (state, onSuccess) => {
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

  update = (postId, state) => {
    fetch(`/api/posts/${postId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: this.prepData(state) })
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      })
  }

  upload = (file, postId, onSuccess) => {
    const data = new FormData()
    data.append('file', file)
    data.append('id', postId)
    fetch('/api/uploads', { method: "POST", body: data })
      .then((response) => {
        if(response.ok) {
          return response.json()
        }
      }).then((body) => {
        onSuccess(body)
      })
  }

  prepData = (state) => {
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

