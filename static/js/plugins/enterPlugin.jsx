import { DEFAULT_BLOCK } from '../config'

const insertDefaultBlock = (state) => {
  return state.transform()
    .insertBlock(DEFAULT_BLOCK.type)
    .focus()
    .apply()
}

const setCurrentToDefaultBlock = (state) => {
  return state.transform()
    .unwrapBlock()
    .setBlock(DEFAULT_BLOCK.type)
    .focus()
    .apply()
}

export default function enterPlugin() {
  return {
    onKeyDown: (e, data, state) => {
      const { startOffset, focusBlock, isExpanded } = state
      const { type } = focusBlock

      // Ignore if key is not enter
      if (data.key != 'enter') return
      // Ignore if the type is paragraph
      if (focusBlock.type === DEFAULT_BLOCK.type) return

      if (type.startsWith('header') || type == 'block-quote' ) {
        return insertDefaultBlock(state)
      } else if (type == 'list-item' || type == 'code-block')  {
        if (startOffset != 0) return
        // Ignore if selection is not expanded
        if (isExpanded) return
        // We don't want to remove formatting if the blocks length is bigger than 0
        if (focusBlock.length > 0) return
        // Ignore we are not in 0 position
        return setCurrentToDefaultBlock(state)
      }
    }
  }
}
