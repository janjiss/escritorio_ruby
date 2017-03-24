import { DEFAULT_BLOCK, BLOCKS } from '../config'

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

const splitListAndInsertNewBlock = (state, document) => {
  const transform = state.transform()
  const { endBlock } = state
  const nextSibling = document.getNextSibling(endBlock.key)
  const previousSibling = document.getPreviousSibling(endBlock.key)

  if (nextSibling && previousSibling) {
    // If there is a next and previous list-item sibling,
    // we set the current block to default, but the problem
    // is that it adds another list-item block, hence
    // we need to collapse to it and set it to default 
    // as well.
    return state.transform()
      .setBlock(DEFAULT_BLOCK.type)
      .unwrapBlock()
      .collapseToStartOfNextBlock()
      .setBlock(DEFAULT_BLOCK.type)
      .unwrapBlock()
      .apply()
  } else {
    return setCurrentToDefaultBlock(state)
  }
}

export default function enterPlugin() {
  return {
    onKeyDown: (e, data, state) => {
      const { startOffset, focusBlock, isExpanded, document } = state
      const { type } = focusBlock

      // Ignore if key is not enter
      if (data.key != 'enter') return
      // Ignore if the type is paragraph
      if (focusBlock.type === DEFAULT_BLOCK.type) return

      if ([BLOCKS.HEADER_ONE, BLOCKS.HEADER_TWO, BLOCKS.TITLE, BLOCKS.BLOCKQUOTE].includes(type)) {
        return insertDefaultBlock(state)
      } else if (type == BLOCKS.LIST_ITEM)  {
        e.preventDefault()

        if (startOffset != 0) return
        // Ignore if selection is not expanded
        if (isExpanded) return
        // We don't want to remove formatting if the blocks length is bigger than 0
        if (focusBlock.length > 0) return
        // Ignore we are not in 0 position
        return splitListAndInsertNewBlock(state, document)
      } else if (type == BLOCKS.CODE_BLOCK) {
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
