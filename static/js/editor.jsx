import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Block, Editor, Raw } from 'slate'
import enterPlugin from './plugins/enterPlugin'
import backspacePlugin from './plugins/backspacePlugin'
import BlockButton from './components/BlockButton'
import InlineButton from './components/InlineButton'
import ImageButton from './components/ImageButton'
import { DEFAULT_NODE, DEFAULT_BLOCK, INITIAL_STATE } from './config'

const schema = {
  nodes: {
    'image': (props) => {
      const { node, state } = props
      const isFocused = state.selection.hasEdgeIn(node)
      const src = node.data.get('src')
      const className = isFocused ? 'active' : null
      return (<img style={{width: "100%"}} src={src} className={className} {...props.attributes} />)
    },
    'paragraph': (props) => { return <p {...props.attributes}>{props.children}</p> },
    'code-block': (props) => { return <pre {...props.attributes}>{props.children}</pre> },
    'block-quote': (props) => { return <blockquote {...props.attributes}>{props.children}</blockquote> },
    'bulleted-list': (props) => { return <ul {...props.attributes}>{props.children}</ul> },
    'header-one': (props) => { return <h1 {...props.attributes}>{props.children}</h1> },
    'header-two': (props) => { return <h2 {...props.attributes}>{props.children}</h2> },
    'list-item': (props) => { return <li {...props.attributes}>{props.children}</li> },
    'ordered-list': (props) => { return <ol {...props.attributes}>{props.children}</ol> },
    'unordered-list': (props) => { return <ul {...props.attributes}>{props.children}</ul> }
  },
  marks: {
    bold: {
      fontWeight: 'bold'
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px'
    },
    italic: {
      fontStyle: 'italic'
    },
    underlined: {
      textDecoration: 'underline'
    }
  },
  rules: [
    // Rule to insert a paragraph block if the document is empty
    {
      match: (node) => {
        return node.kind == 'document'
      },
        validate: (document) => {
          return document.nodes.size ? null : true
        },
        normalize: (transform, document) => {
          const block = Block.create(DEFAULT_BLOCK)
          transform.insertNodeByKey(document.key, 0, block)
        }
    },
    // Rule to insert a paragraph below a void node (the image)
    // if that node is the last one in the document
    {
      match: (node) => {
        return node.kind == 'document'
      },
      validate: (document) => {
        const lastNode = document.nodes.last()
        return lastNode && lastNode.isVoid ? true : null
      },
      normalize: (transform, document) => {
        const block = Block.create(DEFAULT_BLOCK)
        transform.insertNodeByKey(document.key, document.nodes.size, block)
      }
    }
  ]
}
const BLOCKSTYLE_TYPES = [
  {label: 'H1', type: 'header-one'},
  {label: 'H2', type: 'header-two'},
  {label: 'Blockquote', type: 'block-quote', iconClass: 'fa fa-quote-right'},
  {label: 'Code', type: 'code-block', iconClass: 'fa fa-file-code-o'},
  {label: 'UL', type: 'unordered-list', iconClass: 'fa fa-list'},
  {label: 'OL', type: 'ordered-list', iconClass: 'fa fa-list-ol'},
]

const INLINE_TYPES = [
  {label: 'Bold', type: 'bold', iconClass: 'fa fa-bold'},
  {label: 'Italic', type: 'italic', iconClass: 'fa fa-italic'},
  {label: 'Underline', type: 'underlined', iconClass: 'fa fa-underline'},
  {label: 'Monospace', type: 'code', iconClass: 'fa fa-code'},
];;

class EscritorioEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {editorState: INITIAL_STATE}
    this.onChange = (editorState) => this._onChange(editorState)
    this.addImage = (state, src) => this._addImage(state, src)
  }

  // On change, update the app's React state with the new editor state.
  _onChange(editorState) {
    console.log(Raw.serialize(editorState))
    this.setState({ editorState })
  }

  // Render the editor.
  render() {
    return (
      <div>
        <div className="toolbar-wrapper">
          <div className="toolbar-block">
            <ul>
              {INLINE_TYPES.map((buttonProps) =>
                <li key={buttonProps.type}>
                  <InlineButton editorState={this.state.editorState} buttonProps={buttonProps} onChange={this.onChange} />
                </li>
              )}
              {BLOCKSTYLE_TYPES.map((buttonProps) =>
                <li key={buttonProps.type}>
                  <BlockButton editorState={this.state.editorState} buttonProps={buttonProps} onChange={this.onChange} />
                </li>
              )}
              <li className="image-upload">
                <ImageButton editorState={this.state.editorState} onChange={this.onChange} />
              </li>
            </ul>
          </div>
        </div>
        <div className="editable">
          <Editor
            schema={schema}
            plugins={[backspacePlugin(), enterPlugin()]}
            state={this.state.editorState}
            onChange={this.onChange}
            focus={this.focus}
          />
        </div> 
      </div>
    )
  }
}


ReactDOM.render(
  <EscritorioEditor />,
  document.getElementById('editor')
);
