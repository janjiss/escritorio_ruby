import { Raw, Plain, State } from 'slate'
import React from 'react'
import HTMLSerializer from '../serializers/htmlSerializer'

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
