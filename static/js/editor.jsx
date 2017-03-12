import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Block, Editor, Raw, Html, Plain } from 'slate'
import enterPlugin from './plugins/enterPlugin'
import backspacePlugin from './plugins/backspacePlugin'
import onSavePlugin from './plugins/onSavePlugin'
import ImageButton from './components/ImageButton'
import HoverMenu from './components/HoverMenu'
import SoftBreak from 'slate-soft-break'
import Escritorio from './api/escritorio'
import { DEFAULT_NODE, DEFAULT_BLOCK, INITIAL_STATE } from './config'

const Api = new Escritorio

const editorElement = document.getElementById('editor')

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
    // Rule to always have first block as header-one element
    {
      match: (node) => {
        return node.kind == 'document'
      },
      validate: (document) => {
        const firstNode = document.nodes.first()
        return firstNode && firstNode.type == 'header-one' ? null : true
      },
      normalize: (transform, document) => {
        transform.setBlock({type: 'header-one'})
      }
    },
    // Always insert an empty node at the end of the document if last
    // Node is no paragraph
    {
      match: (node) => {
        return node.kind == 'document'
      },
      validate: (document) => {
        const lastNode = document.nodes.last()
        return lastNode && lastNode.type == DEFAULT_BLOCK.type ? null : true
      },
      normalize: (transform, document) => {
        const block = Block.create(DEFAULT_BLOCK)
        transform.insertNodeByKey(document.key, document.nodes.size, block)
      }
    },

    // Join together lists that don't have
    // any blocks in-between
    {
      match: (node) => {
        return node.kind == 'document'
      },
      validate: (document) => {
        let previousNodeType = null
        const joinableNode = document.nodes.find((node, key) => {
          if (node.type === 'ordered-list' || node.type === 'unordered-list') {
            if (previousNodeType === node.type) {
              return true
            } else {
              previousNodeType = node.type
              return false
            }
          } else {
            previousNodeType = null
            return false
          }
        })
        if ( joinableNode ) {
          const previousNode = document.getPreviousSibling(joinableNode.key)
          return { previousNode, joinableNode }
        } else {
          return false
        }
      },
      normalize: (transform, document, nodes) => {
        const { joinableNode, previousNode } = nodes
        const joinableNodelistItems = joinableNode.nodes

        joinableNodelistItems.forEach((node, index) => {
          transform.moveNodeByKey(node.key, previousNode.key, previousNode.nodes.size + index)
        })
        return transform.removeNodeByKey(joinableNode.key)
      }
    }
  ]
}

class EscritorioEditor extends Component {
  constructor(props) {
    super(props)
    const postId = editorElement.dataset.postId.length <= 0 ? null : editorElement.dataset.postId

    this.state = { editorState: INITIAL_STATE, postId: postId }
    this.onChange = (editorState) => this._onChange(editorState)
    this.addImage = (state, src) => this._addImage(state, src)
    this.onSave = () => this._onSave()
    this.getLatestState = () => this._getLatestState()
  }

  componentDidMount() {
    if(this.state.postId) {
      Api.fetch(editorElement.dataset.postId, (editorState, post) => {
        this.setState({
          editorState: editorState
        })
        this.onChange(editorState)
      })
    } else {
      Api.create(this.state.editorState, (postId) => {
        window.history.replaceState('Post', 'Hello', `/admin/posts/${postId}`);
        this.setState({ postId: postId })
      })
    }
  }

  _getLatestState() {
    return this.state.editorState
  }

  // On change, update the app's React state with the new editor state.
  _onChange(editorState) {
    this.setState({ editorState })
  }

  _onSave() {
    const { postId, editorState } = this.state
    Api.update(postId, editorState)
  }

  render() {
    return (
      <div>
        <HoverMenu getLatestState={this.getLatestState} onChange={this.onChange} />
        <div className="toolbar-wrapper">
          <div className="toolbar-block">
            <ul>
              <li className="image-upload">
                <ImageButton editorState={this.state.editorState} onChange={this.onChange} getLatestState={this.getLatestState} postId={this.state.postId}/>
              </li>
            </ul>
          </div>
        </div>
        <div className="editable">
          <Editor
            schema={schema}
            plugins={[backspacePlugin(), enterPlugin(), SoftBreak({ onlyIn: ['code-block'] }), onSavePlugin(this.onSave)]}
            state={this.state.editorState}
            onChange={this.onChange}
            focus={this.focus}
          >
          </Editor>
        </div> 
      </div>
    )
  }
}

ReactDOM.render(
  <EscritorioEditor />,
  editorElement
);
