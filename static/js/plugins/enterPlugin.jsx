import { DEFAULT_BLOCK } from '../config'

export default function enterPlugin() {
  return {
    onKeyDown: (e, data, state) => {
      const { startOffset, focusBlock, isExpanded } = state
      const { type } = focusBlock

      // Ignore if key is not enter
      if (data.key != 'enter') return
      // Ignore if the type is paragraph
      if (focusBlock.type === DEFAULT_BLOCK.type) return
      // Ignore we are not in 0 position
      if (startOffset != 0) return
      // Ignore if selection is not expanded
      if (isExpanded) return
      // We don't want to remove formatting if the blocks length is bigger than 0
      if (focusBlock.length > 0) return

      return state.transform()
        .unwrapBlock()
        .setBlock(DEFAULT_BLOCK.type)
        .focus()
        .apply()
    }
  }
}
