import { DEFAULT_BLOCK } from '../config'

export default function backspacePlugin() {
  return {
    onKeyDown: (e, data, state) => {
      const { startOffset, focusBlock, isExpanded } = state
      const previousBlock = state.document.getPreviousBlock(focusBlock.key);

      // Ignore if key is not backspace
      if (data.key != 'backspace') return
      // We don't want to continue if selection is expanded (We have selected block of text)
      if (isExpanded) return
      // We only want to continue if we are at 0 position of current block
      if (startOffset != 0) return
      // We don't want to remove formatting if the blocks length is bigger than 0
      if (focusBlock.length > 0) return
      // We only want to perform the operation on blocks that are not already default blocks
      if (focusBlock.type === DEFAULT_BLOCK.type) return
      // If the previous block is of the same type, we don't want to change the type
      if (previousBlock && focusBlock.type === previousBlock.type) return

      return state.transform()
        .unwrapBlock()
        .setBlock(DEFAULT_BLOCK.type)
        .focus()
        .apply()
    }
  }
}
