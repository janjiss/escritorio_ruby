import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Block, Editor, Raw } from 'slate'

const DEFAULT_NODE = 'paragraph'

const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {}
}

const schema = {
  nodes: {
    'image': (props) => {
      const { node, state } = props
      const isFocused = state.selection.hasEdgeIn(node)
      const src = node.data.get('src')
      const className = isFocused ? 'active' : null
      return (
        <img style={{width: "100%"}} src={src} className={className} {...props.attributes} />
        )
    },
    'paragraph': (props) => { return <p {...props.attributes}>{props.children}</p> },
    'code-block': (props) => { return <pre {...props.attributes}>{props.children}</pre> },
    'block-quote': (props) => { return <blockquote {...props.attributes}>{props.children}</blockquote> },
    'bulleted-list': (props) => { return <ul {...props.attributes}>{props.children}</ul> },
    'heading-one': (props) => { return <h1 {...props.attributes}>{props.children}</h1> },
    'heading-two': (props) => { return <h2 {...props.attributes}>{props.children}</h2> },
    'list-item': (props) => { return <li {...props.attributes}>{props.children}</li> },
    'numbered-list': (props) => { return <ol {...props.attributes}>{props.children}</ol> }
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
          const block = Block.create(defaultBlock)
          transform
            .insertNodeByKey(document.key, 0, block)
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
          const block = Block.create(defaultBlock)
          transform
            .insertNodeByKey(document.key, document.nodes.size, block)
        }
    }
  ]
}

const BLOCKSTYLE_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'Blockquote', style: 'block-quote', image: '/admin/assets/images/tools/quote.svg'},
  {label: 'Code', style: 'code-block', image: '/admin/assets/images/tools/file-code-edit.svg'},
  {label: 'UL', style: 'list-item', image: '/admin/assets/images/tools/list-bullets.svg'},
  {label: 'OL', style: 'numbered-list', image: '/admin/assets/images/tools/list-number.svg'},
]

const INLINE_TYPES = [
  {label: 'Bold', style: 'bold', image: "/admin/assets/images/tools/bold.svg"},
  {label: 'Italic', style: 'italic', image: "/admin/assets/images/tools/italic.svg"},
  {label: 'Underline', style: 'underlined', image: "/admin/assets/images/tools/underline.svg"},
  {label: 'Monospace', style: 'code', image: "/admin/assets/images/tools/file-code-1.svg"},
];;

class EscritorioEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {editorState: initialState}
    this.onChange = (editorState) => this._onChange(editorState)
    this.addImage = (state, src) => this._addImage(state, src)
    this.onBlockClick = (e, type) => this._onBlockClick(e, type)
    this.onInlineClick = (e, type) => this._onInlineClick(e, type)
    this.renderBlockButton = (type) => this._renderBlockButton(type)
    this.renderInlineButton = (type) => this._renderInlineButton(type)

    this.hasBlock = (type) => this._hasBlock(type)
  }

  _hasBlock(type) {
    const { editorState } = this.state
    return editorState.blocks.some(node => node.type == type)
  }

  _onBlockClick(e, element) {
    e.preventDefault()
    let type = element.style
    let { editorState } = this.state
    const transform = editorState.transform()
    const { document } = editorState

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
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
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    editorState = transform.apply()
    this.setState({ editorState })
  }

  _onInlineClick(e, element) {
    e.preventDefault()
    let type = element.style
    let { editorState } = this.state

    this.onChange(
      editorState
        .transform()
        .toggleMark(type)
        .apply()
    )
  }


  _renderBlockButton(type) {
    const display = type.image ? <img src={type.image}/> : type.label
    const onMouseDown = e => this.onBlockClick(e, type)

    return (
      <button onMouseDown={onMouseDown}>
        {display}
        <label>{type.label}</label>
      </button>
    )
  }

  _renderInlineButton(type, icon) {
    const display = type.image ? <img src={type.image}/> : type.label
    const onMouseDown = e => this.onInlineClick(e, type)

    return (
      <button onMouseDown={onMouseDown}>
        {display}
        <label>{type.label}</label>
      </button>
    )
  }

  // On change, update the app's React state with the new editor state.
  _onChange(editorState) {
    this.setState({ editorState })
  }

  _addImage(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newState = this.state.editorState
        .transform()
        .insertBlock({
          type: 'image',
          isVoid: true,
          data: { src: reader.result }
        })
      .focus()
        .apply()

      this.onChange(newState)
    }
    reader.readAsDataURL(file)
  }

  // Render the editor.
  render() {
    return (
      <div>
        <div className="toolbar-wrapper">
          <div className="toolbar-block">
            <ul>
              {INLINE_TYPES.map((type) =>
                <li key={type.style}>
                  {this.renderInlineButton(type)}
                </li>
              )}
              {BLOCKSTYLE_TYPES.map((type) =>
                <li key={type.style}>
                  {this.renderBlockButton(type)}
                </li>
              )}
              <ImageControl
                addImage={this.addImage}
              />
            </ul>
          </div>
        </div>
        <div className="editable">
          <Editor
            schema={schema}
            state={this.state.editorState}
            onChange={this.onChange}
            focus={this.focus}
          />
        </div> 
      </div>
    )
  }
}

class ImageControl extends Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }
    this.addImage = (file) => { this.props.addImage(file) }
    this.onClick = () => { this._onClick() }
    this.onFileSelected = (e) => { this._onFileSelected(e) }
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
      <li className="image-upload">
        <input type="file" ref="fileField" value={this.state.value} style={{display: "none"}} onChange={this.onFileSelected} />
        <button onMouseDown={this.onClick}>
          <img src="/admin/assets/images/tools/file-picture-add.svg" />
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
