import React, { Component } from 'react'
import Escritorio from '../api/escritorio'
const Api = new Escritorio

export default class ImageControl extends Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }
    this.getLatestState = this.props.getLatestState
    this.onClick = () => { this._onClick() }
    this.onFileSelected = (e) => { this._onFileSelected(e) }
    this.onChange = this.props.onChange
    this.addImage = (file) => { this._addImage(file) }
  }

  _addImage(file) {
    const reader = new FileReader();
    reader.onloadend = () => {

      const getLatestState = this.getLatestState
      const stateWithTemporaryImage = getLatestState().transform()
        .insertBlock({
          type: 'image',
          isVoid: true,
          data: {
            src: reader.result,
            inProgress: true
          }
        })
        .focus()
        .apply()

      const imageKey = stateWithTemporaryImage.focusBlock.key

      this.onChange(stateWithTemporaryImage)

      Api.upload(file, this.props.postId, (result) => {
        const src = result.file
        const stateWithFinalImage = getLatestState().transform()
          .setNodeByKey(imageKey, { data: { src: src, inProgress: false } })
          .apply()

        this.onChange(stateWithFinalImage)
      })
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
