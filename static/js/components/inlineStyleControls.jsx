import StyleButton from './styleButton'
import React from 'react'

const INLINE_STYLES = [
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
}
export default InlineStyleControls
