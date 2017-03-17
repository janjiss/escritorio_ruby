import { MARKS } from '../config'


export default function keboardShortcuts() {
  return {
    onKeyDown: (e, data, state) => {
      if ((data.isCmd || data.isCtrl) && data.key === "b") {
        e.preventDefault()
        return state
          .transform()
          .toggleMark(MARKS.BOLD)
          .focus()
          .apply()
      }

      if ((data.isCmd || data.isCtrl) && data.key === "i") {
        e.preventDefault()
        return state
          .transform()
          .toggleMark(MARKS.ITALIC)
          .focus()
          .apply()
      }

      if ((data.isCmd || data.isCtrl) && data.key === "u") {
        e.preventDefault()
        return state
          .transform()
          .toggleMark(MARKS.UNDERLINED)
          .focus()
          .apply()
      }
    }
  }
}
