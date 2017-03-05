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
    const { type, iconClass, label } = this.buttonProps
    const selectedClass = this.props.editorState.marks.some(mark => mark.type == type) ? "selected" : ""
    const display = iconClass ? <i className={iconClass} aria-hidden="true"></i> : label
    const onMouseDown = e => this.onClick(e, type)
    return (
      <li key={type} className={selectedClass}>
        <button onMouseDown={onMouseDown}>
          {display}
          <label>{label}</label>
        </button>
      </li>
    )
  }
}
