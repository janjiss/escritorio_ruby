import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Draft, { RichUtils, Modifier, Editor, Entity, EditorState, AtomicBlockUtils, } from 'draft-js';
import Immutable from 'immutable'

import BlockStyleControls from './components/blockStyleControls'
import InlineStyleControls from './components/inlineStyleControls'

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      element: 'div',
      component: Image,
      editable: false,
      props: ''
    };
  }

  return null;
}

export default class EscritorioEditor extends Component {
  constructor(props) {
    super(props)
    this.state = { editorState: EditorState.createEmpty() }
    this.editorState = this.state.editorState
    this.onChange = (editorState) => { this._onChange(editorState) }
    this.addImage = () => { this._addImage() }
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.focus = () => { this.refs.editor.focus() }
  }

  _onChange(editorState) {
    this.setState({editorState})
  }


  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    return (
      <div>
        <div className="toolbar-wrapper">
          <div className="toolbar-block">
            <ul>
              <InlineStyleControls
                editorState={this.editorState}
                onToggle={this.toggleInlineStyle}
              />
              <BlockStyleControls
                editorState={this.editorState}
                onToggle={this.toggleBlockType}
              />
              <ImageControl
                editorState={this.editorState}
                onChange={this.onChange}
              />
            </ul>
          </div>
        </div>
        <div className="editable">
          <Editor
            blockRendererFn={mediaBlockRenderer}
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

const Image = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();
  const type = entity.getType();
  return <div className="editor-image"><img src={src}></img></div>
}

class ImageControl extends Component {
  constructor(props) {
    super(props)
    this.editorState = props.editorState
    this.onChange = (editorState) => { props.onChange(editorState) }
    this.onClick = () => { this._onClick() }
    this.onFileSelected = (e) => { this._onFileSelected(e) }
    this.addImage = (file) => { this._addImage(file) }
  }

  _onClick() {
    this.refs.fileField.click()
  }

  _onFileSelected(e) {
    this.addImage(e.target.files[0])
  }

  _addImage(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      const contentState = this.editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'image',
        'IMMUTABLE',
        {src: reader.result}
      );

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const newEditorState = EditorState.set(
        this.editorState,
        {currentContent: contentStateWithEntity}
      );

      this.onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
    }
    reader.readAsDataURL(file)
  }

  render() {
    return(
    <span>
      <li className="image-upload">
        <input type="file" ref="fileField" style={{display: "none"}} onChange={this.onFileSelected} />
        <button onMouseDown={this.onClick}>
          <img src="/admin/assets/images/tools/file-code-1.svg" />
          <label>Upload Image</label>
        </button>
      </li>
    </span>
    )
  }
}

ReactDOM.render(
  <EscritorioEditor />,
  document.getElementById('editor')
);
