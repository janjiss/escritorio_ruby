import Portal from 'react-portal'
import React from 'react'
import { DEFAULT_NODE } from '../config'

const INLINE_TYPES = [
  {label: 'Bold', type: 'bold', iconClass: 'fa fa-lg fa-bold'},
  {label: 'Italic', type: 'italic', iconClass: 'fa fa-lg fa-italic'},
  {label: 'Underline', type: 'underlined', iconClass: 'fa fa-lg fa-underline'},
  {label: 'Monospace', type: 'code', iconClass: 'fa fa-lg fa-code'},
]

const BLOCKSTYLE_TYPES = [
  {label: 'H1', type: 'header-one', iconClass: 'fa-lg fa fa-header'},
  {label: 'H2', type: 'header-two', iconClass: 'fa fa-header'},
  {label: 'Blockquote', type: 'block-quote', iconClass: 'fa-lg fa fa-quote-right'},
  {label: 'Code', type: 'code-block', iconClass: 'fa-lg fa fa-file-code-o'},
  {label: 'UL', type: 'unordered-list', iconClass: 'fa-lg fa fa-list'},
  {label: 'OL', type: 'ordered-list', iconClass: 'fa-lg fa fa-list-ol'},
]

class HoverMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { menu: false }
    this.getLatestState = this.props.getLatestState
    this.onChange = this.props.onChange
    this.onOpen = (portal) => this._onOpen(portal)
    this.updateMenu = () => this._updateMenu()
  }

  componentDidMount() {
    this.updateMenu()
  }

  componentDidUpdate() {
    this.updateMenu()
  }

  hasInileSyle(type) {
    return this.getLatestState().marks.some(mark => mark.type == type)
  }

  hasBlockStyle(type) {
    const editorState = this.getLatestState()

    const hasParentOfType = editorState.blocks.some((block) => {
      return !!editorState.document.getClosest(block.key, parent => parent.type == type)
    })

    const isSameType = editorState.blocks.some((block) => {
      return editorState.blocks.some(block => block.type == type)
    })

    return hasParentOfType || isSameType
  }

  onClickInlineButton(e, type) {
    e.preventDefault()

    const state = this.getLatestState()
      .transform()
      .toggleMark(type)
      .focus()
      .apply()

    this.onChange(state)
  }

  onClickBlockButton(e, type) {
    e.preventDefault()
    const editorState = this.getLatestState()
    const { document } = editorState
    const transform = editorState.transform()

    // Handle everything but list buttons.
    if (type != 'unordered-list' && type != 'ordered-list') {
      const isActive = this.hasBlockStyle(type)
      const isList = this.hasBlockStyle('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list')
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlockStyle('list-item')
      const isType = editorState.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type == 'ordered-list' ? 'unordered-list' : 'ordered-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    this.onChange(transform.apply())
  }

  _onOpen(portal) {
    this.setState({ menu: portal.firstChild })
  }

  render() {
    return (
      <div>
        {this.renderMenu()}
      </div>
    )
  }

  renderMenu() {
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="menu hover-menu">
          { INLINE_TYPES.map((type) => { return this.renderInlineButton(type) }) }
          <span style={{paddingLeft: "0px", paddingRight: "5px", fontSize: "20px"}}>|</span>
          { BLOCKSTYLE_TYPES.map((type) => { return this.renderBlockButton(type) }) }
        </div>
      </Portal>
    )
  }

  renderInlineButton(button) {
    const isActive = this.hasInileSyle(button.type)
    const onMouseDown = e => this.onClickInlineButton(e, button.type)

    return (
      <span key={button.type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <i className={button.iconClass} aria-hidden="true"></i>
      </span>
    )
  }

  renderBlockButton(button) {
    const isActive = this.hasBlockStyle(button.type)
    const onMouseDown = e => this.onClickBlockButton(e, button.type)

    return (
      <span key={button.type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <i className={button.iconClass} aria-hidden="true"></i>
      </span>
    )
  }

  _updateMenu() {
    const { menu } = this.state
    const editorState = this.getLatestState()
    if (!menu) return

    if (editorState.isBlurred || editorState.isCollapsed) {
      menu.style = null
      return
    }

    if (editorState.startBlock.key == editorState.document.nodes.first().key) {
      menu.style = null
      return
    }
    // This is a hack that I don't know how to fix at the moment
    // If not for setTimeout, it fails to grab current coordinates
    // of rect
    setTimeout(function(){
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      const top = rect.top
      const left = rect.left
      const width = rect.width

      menu.style.opacity = 1
      menu.style.top = `${top + scrollY - menu.offsetHeight - 15}px`
      menu.style.left = `${left + scrollX - menu.offsetWidth / 2 + width / 2}px`
    }, 100);
  }

}

export default HoverMenu
