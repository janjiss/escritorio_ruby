import Portal from 'react-portal'
import React from 'react'
import { DEFAULT_NODE, BLOCKS, MARKS, INLINES } from '../config'

const MARK_TYPES = [
  {label: 'Bold', type: MARKS.BOLD, iconClass: 'fa fa-lg fa-bold'},
  {label: 'Italic', type: MARKS.ITALIC, iconClass: 'fa fa-lg fa-italic'},
  {label: 'Underline', type: MARKS.UNDERLINED, iconClass: 'fa fa-lg fa-underline'},
  {label: 'Monospace', type: MARKS.CODE, iconClass: 'fa fa-lg fa-code'},
]

const LINK_BUTTON = {label: 'LINK', type: 'link', iconClass: 'fa-lg fa fa-link'}

const BLOCK_TYPES = [
  {label: 'H1', type: BLOCKS.HEADER_ONE, iconClass: 'fa-lg fa fa-header'},
  {label: 'H2', type: BLOCKS.HEADER_TWO, iconClass: 'fa fa-header'},
  {label: 'Blockquote', type: BLOCKS.BLOCKQUOTE, iconClass: 'fa-lg fa fa-quote-right'},
  {label: 'Code', type: BLOCKS.CODE_BLOCK, iconClass: 'fa-lg fa fa-file-code-o'},
  {label: 'UL', type: BLOCKS.UNORDERED_LIST, iconClass: 'fa-lg fa fa-list'},
  {label: 'OL', type: BLOCKS.ORDERED_LIST, iconClass: 'fa-lg fa fa-list-ol'},
]

class HoverMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { menu: false, linkInputActive: false, linkInputValue: "" }
    this.getLatestState = this.props.getLatestState
    this.onChange = this.props.onChange
  }

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  hasMark = (type) => {
    return this.getLatestState().marks.some(mark => mark.type == type)
  }

  hasBlock = (type) => {
    const editorState = this.getLatestState()

    const hasParentOfType = editorState.blocks.some((block) => {
      return !!editorState.document.getClosest(block.key, parent => parent.type == type)
    })

    const isSameType = editorState.blocks.some((block) => {
      return editorState.blocks.some(block => block.type == type)
    })

    return hasParentOfType || isSameType
  }

  hasLinks = () => {
    return this.getLatestState().inlines.some(inline => inline.type == INLINES.LINK)
  }

  onClickMarkButton = (e, type) => {
    e.preventDefault()

    const state = this.getLatestState()
      .transform()
      .toggleMark(type)
      .focus()
      .apply()

    this.onChange(state)
  }

  onClickLinkButton = (e, type) => {
    e.preventDefault()

    const editorState = this.getLatestState()

    if (this.hasLinks()) {
      this.onChange(
        editorState
          .transform()
          .unwrapInline('link')
          .apply()
      )
    } else {
      const blurredState = editorState
        .transform()
        .blur()
        .apply()

      this.onChange(blurredState)

      this.setState({ linkInputActive: true })
      this.refs.menu.style.display = 'none'
      this.refs.linkInput.style.display = 'block'
      this.refs.linkInput.children[0].focus();
    }
  }

  onClickBlockButton = (e, type) => {
    e.preventDefault()
    const editorState = this.getLatestState()
    const { document } = editorState
    const transform = editorState.transform()

    // Handle everything but list buttons.
    if (type != BLOCKS.UNORDERED_LIST && type != BLOCKS.ORDERED_LIST) {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock(BLOCKS.LIST_ITEM)

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock(type == BLOCKS.ORDERED_LIST ? BLOCKS.UNORDERED_LIST : BLOCKS.ORDERED_LIST)
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock(BLOCKS.LIST_ITEM)
      const isType = editorState.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock(BLOCKS.UNORDERED_LIST)
          .unwrapBlock(BLOCKS.ORDERED_LIST)
      } else if (isList) {
        transform
          .unwrapBlock(type == BLOCKS.ORDERED_LIST ? BLOCKS.UNORDERED_LIST : BLOCKS.ORDERED_LIST)
          .wrapBlock(type)
      } else {
        transform
          .setBlock(BLOCKS.LIST_ITEM)
          .wrapBlock(type)
      }
    }

    this.onChange(transform.apply())
  }

  onChangeLinkInput = (e) => {
    this.setState({ linkInputValue: e.target.value })
  }

  onKeyDownLinkInput = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()

      const editorState = this.getLatestState()

      if (e.target.value === '')  {
        this.refs.menu.style.display = 'block'
        this.refs.linkInput.style.display = 'none'
        this.setState({ linkInputActive: false })

        this.onChange(
          editorState
            .transform()
            .focus()
            .collapseToEnd()
            .apply()
        )
        return
      }


      this.refs.menu.style.display = 'block'
      this.refs.linkInput.style.display = 'none'

      const focusState = editorState
        .transform()
        .wrapInline({ type: INLINES.LINK, data: { url: e.target.value } })
        .collapseToEnd()
        .focus()
        .apply()

      this.onChange(focusState)
      this.setState({ linkInputActive: false, linkInputValue: "" })
    }
  }

  onLinkInputBlur = (e) => {
    this.setState({ linkInputActive: false, linkInputValue: "" })
    this.refs.menu.style.display = 'block'
    this.refs.linkInput.style.display = 'none'
  }

  onOpen = (portal) => {
    this.setState({ menu: portal.firstChild })
  }

  render = () => {
    return (
      <div>
        {this.renderMenu()}
      </div>
    )
  }

  renderMenu = () => {
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="menu hover-menu">
          <div ref="menu" style={{display: "block"}}>
            { MARK_TYPES.map((type) => { return this.renderMarkButton(type) }) }
            <span style={{paddingLeft: "0px", paddingRight: "5px", fontSize: "20px"}}>|</span>
            { this.renderLinkButton(LINK_BUTTON) }
            <span style={{paddingLeft: "0px", paddingRight: "5px", fontSize: "20px"}}>|</span>
            { BLOCK_TYPES.map((type) => { return this.renderBlockButton(type) }) }
          </div>
          <div ref="linkInput" style={{display: "none"}} >
            <input placeholder="Enter link URL" className="textInput" onBlur={this.onLinkInputBlur} onKeyDown={ this.onKeyDownLinkInput } onChange={ this.onChangeLinkInput } value={ this.state.linkInputValue }></input> 
          </div>
        </div>
      </Portal>
    )
  }

  renderMarkButton = (button) => {
    const isActive = this.hasMark(button.type)
    const onMouseDown = e => this.onClickMarkButton(e, button.type)

    return (
      <span key={button.type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <i className={button.iconClass} aria-hidden="true"></i>
      </span>
    )
  }

  renderLinkButton = (button) => {
    const isActive = this.hasLinks()
    const onMouseDown = e => this.onClickLinkButton(e, button.type)

    return (
      <span key={button.type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <i className={button.iconClass} aria-hidden="true"></i>
      </span>
    )
  }

  renderBlockButton = (button) => {
    const isActive = this.hasBlock(button.type)
    const onMouseDown = e => this.onClickBlockButton(e, button.type)

    return (
      <span key={button.type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <i className={button.iconClass} aria-hidden="true"></i>
      </span>
    )
  }

  updateMenu = () => {
    const { menu, linkInputActive } = this.state
    const editorState = this.getLatestState()
    if (!menu) return

    if ((editorState.isBlurred || editorState.isCollapsed) && !linkInputActive ) {
      menu.style = null
      return
    }

    if (editorState.startBlock.key == editorState.document.nodes.first().key) {
      menu.style = null
      return
    }

    if (!linkInputActive) {

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
}

export default HoverMenu
