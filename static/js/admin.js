import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';

class EscritorioEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
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
    const {editorState} = this.state;

    return (
      <div className="editor {className}">
        <div className="toolbar-wrapper">
          <div className="toolbar-block">
            <ul>
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
            </ul>
          </div>
        </div>
        <div className="editable" onClick={this.focus}>
          <Editor
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = '';
    let display = null;
    if (this.props.active) {
      className += ' selected';
    }

    if (this.props.image) {
      display = <img src={this.props.image}/>
    } else {
      display = this.props.label
    }

    return (
      <li className={className}>
        <button onMouseDown={this.onToggle}>
          {display}
          <label>{this.props.label}</label>
        </button>
      </li>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'Blockquote', style: 'blockquote', image: '/admin/assets/images/tools/quote.svg'},
  {label: 'UL', style: 'unordered-list-item', image: '/admin/assets/images/tools/list-bullets.svg'},
  {label: 'OL', style: 'ordered-list-item', image: '/admin/assets/images/tools/list-number.svg'},
  {label: 'Code Block', style: 'code-block', image: '/admin/assets/images/tools/file-code-edit.svg'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
        key={type.label}
        active={type.style === blockType}
        label={type.label}
        onToggle={props.onToggle}
        style={type.style}
        image={type.image}
          />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD', image: "/admin/assets/images/tools/bold.svg"},
  {label: 'Italic', style: 'ITALIC', image: "/admin/assets/images/tools/italic.svg"},
  {label: 'Underline', style: 'UNDERLINE', image: "/admin/assets/images/tools/underline.svg"},
  {label: 'Monospace', style: 'CODE', image: "/admin/assets/images/tools/file-code-1.svg"},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <span>
      {INLINE_STYLES.map(type =>
          <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          image={type.image}
          style={type.style}
            />
      )}
    </span>
  );
};

ReactDOM.render(
  <EscritorioEditor />,
  document.getElementById('editor')
);
