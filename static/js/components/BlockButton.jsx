import React, { Component } from 'react'
import { DEFAULT_NODE } from '../config'

export default class BlockButton extends Component {
  constructor(props) {
    super(props)
    this.onClick = (e, element) => this._onClick(e, element)
    this.buttonProps = this.props.buttonProps
    this.hasBlock = (type) => this._hasBlock(type)
    this.onChange = this.props.onChange
  }

  _hasBlock(type) {
    const { editorState } = this.props

    const hasParentOfType = editorState.blocks.some((block) => {
      return !!editorState.document.getClosest(block.key, parent => parent.type == type)
    })

    const isSameType = editorState.blocks.some((block) => {
      return editorState.blocks.some(block => block.type == type)
    })

    return hasParentOfType || isSameType
  }

  _onClick(e, element) {
    e.preventDefault()
    const { editorState } = this.props
    const { type } = this.buttonProps
    const { document } = editorState
    const transform = editorState.transform()

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
    const { type, iconClass, label } = this.buttonProps
    const selectedClass = this.hasBlock(type) ? "selected" : ""
    const display = iconClass ? <i className={iconClass} aria-hidden="true"></i> : label
    const onMouseDown = e => this.onClick(e, type)
    return (
      <li className={selectedClass}>
        <button onMouseDown={onMouseDown}>
          {display}
          <label>{label}</label>
        </button>
      </li>
    )
  }
}
