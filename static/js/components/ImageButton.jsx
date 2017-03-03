import React, { Component } from 'react'
export default class ImageControl extends Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }
    this.onClick = () => { this._onClick() }
    this.onFileSelected = (e) => { this._onFileSelected(e) }
    this.onChange = this.props.onChange
    this.addImage = (file) => { this._addImage(file) }
  }

  _addImage(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.onChange(
        this.props.editorState
          .transform()
          .insertBlock({
            type: 'image',
            isVoid: true,
            data: { src: reader.result }
          })
          .focus()
          .apply()
      )
    }
    reader.readAsDataURL(file)
  }

  _onClick() {
    this.refs.fileField.click()
  }

  _onFileSelected(e) {
    this.addImage(e.target.files[0])
    this.setState({value: ""})
  }

  render() {
    return(
    <span>
      <input type="file" ref="fileField" value={this.state.value} style={{display: "none"}} onChange={this.onFileSelected} />
      <button onMouseDown={this.onClick}>
        <i className="fa fa-file-image-o" aria-hidden="true"></i>
        <label>Upload Image</label>
      </button>
    </span>
    )
  }
}
