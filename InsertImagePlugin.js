/***
|Version    |0.2.4|
|Author     |Yakov Litvin|
***/
//{{{
config.macros.attachImage = {
	init: function() {
		const orig_editHandler = config.macros.edit.handler
		config.macros.edit.handler = function() {
			const editor = orig_editHandler.apply(this, arguments)
			editor.addEventListener('paste', config.macros.attachImage.handlePaste)
			return editor
		}
	},
    
	handlePaste: async function(event) {
		const imgItem = Array.from(event.clipboardData.items)
			.find(item => item.type.startsWith('image'))
		if(!imgItem) return

		const file = imgItem.getAsFile()
		const base64Data = await this.fileToBase64(file)
		const imgMarkup = `[img[${base64Data}]]`
		config.macros.attachImage.insertMarkupIntoEditor(imgMarkup, event.target)
	},

	insertMarkupIntoEditor: function(markup, editor) {
		const startPos = editor.selectionStart
		const endPos = editor.selectionEnd
		const textBefore = editor.value.substring(0, startPos)
		const textAfter = editor.value.substring(endPos)

		editor.value = textBefore + markup + textAfter
		const cursorPosition = startPos + markup.length
		editor.selectionStart = editor.selectionEnd = cursorPosition
	},

	fileToBase64: function(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result)
			reader.onerror = error => reject(error)
			reader.readAsDataURL(file)
		})
	}
}
//}}}