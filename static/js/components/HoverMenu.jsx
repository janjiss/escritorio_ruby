import Portal from 'react-portal'
import React from 'react'

const INLINE_TYPES = [
  {label: 'Bold', type: 'bold', iconClass: 'fa fa-bold'},
  {label: 'Italic', type: 'italic', iconClass: 'fa fa-italic'},
  {label: 'Underline', type: 'underlined', iconClass: 'fa fa-underline'},
  {label: 'Monospace', type: 'code', iconClass: 'fa fa-code'},
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

  hasMark(type) {
    return this.getLatestState().marks.some(mark => mark.type == type)
  }

  onClickMark(e, type) {
    e.preventDefault()

    const state = this.getLatestState()
      .transform()
      .toggleMark(type)
      .apply()

    this.onChange(state)
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
          { INLINE_TYPES.map((type) => { return this.renderMarkButton(type) }) }
        </div>
      </Portal>
    )
  }

  renderMarkButton(button) {
    const isActive = this.hasMark(button.type)
    const onMouseDown = e => this.onClickMark(e, button.type)

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
      menu.removeAttribute('style')
      return
    }

    if (editorState.startBlock.key == editorState.document.nodes.first().key) { 
      menu.removeAttribute('style')
      return
    }
    // This is a hack that I don't know how to fix at the moment
    // If not for setTimeout, it fails to grab current coordinates
    // of rect
    setTimeout(function(){
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      menu.style.opacity = 1
      menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
      menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
    }, 100);
  }

}

export default HoverMenu
