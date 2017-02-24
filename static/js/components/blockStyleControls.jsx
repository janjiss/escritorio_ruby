import StyleButton from './styleButton'
import React from 'react'

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
export default BlockStyleControls
