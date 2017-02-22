import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import { Entity, EditorState, AtomicBlockUtils, } from 'draft-js';

import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'
import createImagePlugin from 'draft-js-image-plugin'

const inlineToolbarPlugin = createInlineToolbarPlugin()
const { InlineToolbar } = inlineToolbarPlugin

const sideToolbarPlugin = createSideToolbarPlugin()
const { SideToolbar } = sideToolbarPlugin

const imagePlugin = createImagePlugin();

const plugins = [imagePlugin, inlineToolbarPlugin, sideToolbarPlugin]

const text = 'In this editor a toolbar shows up once you select part of the text …';


export default class EscritorioEditor extends Component {

  constructor(props) {
    super(props)
    this.state = { editorState: createEditorStateWithText(text) }
    this.onChange = (editorState) => { this._onChange(editorState) }
    this.addImage = () => { this._addImage() }
    this.focus = () => { this.editor.focus() }
  }

  _onChange(editorState) {
    this.setState({editorState})
  }

  _addImage() {
    this.onChange(imagePlugin.addImage(this.state.editorState, "http://lorempixel.com/500/500"))
  }

  render() {
    return (
      <div className="editable" onClick={this.focus}>
        <button onClick={this.addImage}></button>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <EscritorioEditor />,
  document.getElementById('editor')
);
