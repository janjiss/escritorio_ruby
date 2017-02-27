import React, { Component } from 'react'
import { DEFAULT_NODE } from '../config'

export default class InlineButton extends Component {
  constructor(props) {
    super(props)
    this.onClick = (e, element) => this._onClick(e, element)
    this.hasBlock = (type) => this._hasBlock(type)
    this.buttonProps = this.props.buttonProps
    this.onChange = this.props.onChange
  }

  _hasBlock(type) {
    const { editorState } = this.props
    return editorState.blocks.some(node => node.type == type)
  }

  _onClick(e, element) {
    e.preventDefault()
    const { editorState } = this.props
    const { type } = this.buttonProps
    const transform = editorState.transform()
    const { document } = editorState

    // Handle everything but list buttons.
    if (type != 'unordered-list' && type != 'ordered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list')
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock('list-item')
      const isType = editorState.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type == 'ordered-list' ? 'unordered-list' : 'ordered-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    this.onChange(transform.apply())
  }

  render() {
    const { type, image, label } = this.buttonProps
    const display = image ? <img src={image}/> : label
    const onMouseDown = e => this.onClick(e, type)
    return (
      <button onMouseDown={onMouseDown}>
        {display}
        <label>{label}</label>
      </button>
    )
  }
}
