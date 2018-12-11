(function() {
  'use strict'

  CKEDITOR.plugins.add('a2j-popout', {
    hidpi: true,
    icons: 'a2j-popout',

    onLoad: function() {
      // Register styles for variable widget frame.
      CKEDITOR.addCss(
        'a2j-popout {' +
          'max-width: 170px;' +
          'max-width: 10rem;' +
          'overflow: hidden;' +
          'text-overflow: ellipsis;' +
          'white-space: nowrap;' +
          'background-color: #D7ECF5;' +
          'border-radius: 6px;' +
          'padding: 3px 10px;' +
          'display: inline-block;' +
        '}'
      )
    },

    init: function (editor) {
      editor.addCommand('popout', {
        exec: function (editor) {
          // Get highlighted text so we can use this as the anchor text
          // if not fallback to the popup name
          const mySelection = editor.getSelection()
          let selectedText
          if (window.CKEDITOR.env.ie) {
              mySelection.unlock(true)
              selectedText = (mySelection.getNative().createRange().text).toString()
          } else {
              selectedText = (mySelection.getNative()).toString()
          }

          // Open the form pickPopupDialog and then save the data
          // into a hyperlink
          window.form.pickPopupDialog('', { value: '' }, (d) => {
            const url = `POPUP://${d}`
            editor.insertHtml(`<a href="${url}" taget="_blank">${selectedText || d}</a>`)
          })
        }
      })

			// Create and register toolbar button if possible.
			if (editor.ui.addButton) {
				editor.ui.addButton('A2j-popout', {
					label: 'Popup',
					command: 'popout'
				})
			}
    }
  })
})()
