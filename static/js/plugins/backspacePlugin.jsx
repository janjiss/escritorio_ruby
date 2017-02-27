import { DEFAULT_BLOCK } from '../config'

export default function backspacePlugin() {
  return {
    onKeyDown: (e, data, state) => {
      const { startOffset, startBlock, isExpanded } = state
      const previousBlock = state.document.getPreviousBlock(startBlock.key);

      // Ignore if key is not backspace
      if (data.key != 'backspace') return
      // We don't want to continue if selection is expanded (We have selected block of text)
      if (isExpanded) return
      // We only want to continue if we are at 0 position of current block
      if (startOffset != 0) return
      // We don't want to remove formatting if the blocks length is bigger than 0
      if (startBlock.length > 0) return
      // We only want to perform the operation on blocks that are not already default blocks
      if (startBlock.type === DEFAULT_BLOCK.type) return
      if (previousBlock && startBlock.type === previousBlock.type) return

      return state
        .transform()
        .setBlock(DEFAULT_BLOCK)
        .unwrapBlock()
        .focus()
        .apply()
    }
  }
}
