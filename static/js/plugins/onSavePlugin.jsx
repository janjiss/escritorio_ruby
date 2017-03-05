export default function savePlugin(onSave) {
  return {
    onKeyDown: (e, data, state) => {
      if ((data.isCmd || data.isCtrl) && data.key === "s") {
        e.preventDefault()
        onSave()
      }
    }
  }
}
