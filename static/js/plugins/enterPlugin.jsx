import { DEFAULT_BLOCK } from '../config'

export default function enterPlugin() {
  return {
    onKeyDown: (e, data, state) => {
      const { startOffset, startBlock, isExpanded } = state
      const { type } = startBlock

      // Ignore if key is not enter
      if (data.key != 'enter') return
      // Ignore if the type is paragraph
      if (startBlock.type === DEFAULT_BLOCK.type) return
      // Ignore we are not in 0 position
      if (startOffset != 0) return
      // Ignore if selection is not expanded
      if (isExpanded) return
      // We don't want to remove formatting if the blocks length is bigger than 0
      if (startBlock.length > 0) return

      return state
        .transform()
        .insertBlock(DEFAULT_BLOCK)
        .unwrapBlock()
        .focus()
        .apply()
    }
  }
}
