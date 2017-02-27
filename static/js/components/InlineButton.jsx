import React, { Component } from 'react'
import { DEFAULT_NODE } from '../config'

export default class InlineButton extends Component {
  constructor(props) {
    super(props)
    this.onClick = (e, element) => this._onClick(e, element)
    this.buttonProps = this.props.buttonProps
    this.onChange = this.props.onChange
  }

  _onClick(e, element) {
    e.preventDefault()
    const { type } = this.buttonProps
    const { editorState } = this.props

    this.onChange(
      editorState
        .transform()
        .toggleMark(type)
        .apply()
    )
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
