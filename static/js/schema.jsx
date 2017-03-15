import { Block } from 'slate'
import React from 'react'
import { DEFAULT_BLOCK } from './config'

const schema = {
  nodes: {
    'image': (props) => {
      const { node, state } = props
      const isFocused = state.selection.hasEdgeIn(node)
      const src = node.data.get('src')
      const className = isFocused ? 'active' : null
      return (<img style={{width: "100%"}} src={src} className={className} {...props.attributes} />)
    },
    'link': (props) => {
      const { data } = props.node
      return <a {...props.attributes} href={ data.get('url') }>{props.children}</a>
    },
    'paragraph': (props) => { return <p {...props.attributes}>{props.children}</p> },
    'code-block': (props) => { return <pre {...props.attributes}>{props.children}</pre> },
    'block-quote': (props) => { return <blockquote {...props.attributes}>{props.children}</blockquote> },
    'title': (props) => { return <h1 {...props.attributes}>{props.children}</h1> },
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
        return node.kind === 'document'
      },
        validate: (document) => {
          return document.nodes.size ? null : true
        },
        normalize: (transform, document) => {
          const block = Block.create(DEFAULT_BLOCK)
          transform.insertNodeByKey(document.key, 0, block)
        }
    },

    // Rule to always have first block as title block
    {
      match: (node) => {
        return node.kind === 'document'
      },
      validate: (document) => {
        const firstNode = document.nodes.first()
        return firstNode && firstNode.type == 'title' ? null : firstNode
      },
      normalize: (transform, document, firstNode) => {
        transform.setBlock({type: 'title'})
      }
    },

    // Rule to remove any formatting on the title
    {
      match: (node) => {
        return node.type === 'title' && node.kind === 'block'
      },
      validate: (titleBlock) => {
        const hasMarks = titleBlock.getMarks().isEmpty()
        const hasInlines = titleBlock.getInlines().isEmpty()

        return !(hasMarks && hasInlines)
      },
      normalize: (transform, titleBlock) => {
        transform
          .unwrapInlineByKey(titleBlock.key)

        titleBlock.getMarks().forEach((mark) => {
          titleBlock.nodes.forEach((textNode) => {
            if (textNode.kind === 'text') {
              transform.removeMarkByKey(textNode.key, 0, textNode.text.length, mark)
            }
          })
        })

        return transform
      }
    },

    // Always insert an empty node at the end of the document if last
    // Node is not paragraph
    {
      match: (node) => {
        return node.kind === 'document'
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
        return node.kind === 'document'
      },
      validate: (document) => {
        const joinableNode = document.nodes.find((node, index) => {
          if (!['ordered-list', 'unordered-list'].includes(node.type)) { return false }

          const previousNode = document.nodes.get(index - 1)
          if (!previousNode) { return false }

          return node.type === previousNode.type
        })

        if ( joinableNode ) {
          const previousNode = document.getPreviousSibling(joinableNode.key)
          return { previousNode, joinableNode }
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

export default schema
