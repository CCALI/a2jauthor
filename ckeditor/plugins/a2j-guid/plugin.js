(function() {
  'use strict'

  CKEDITOR.plugins.add('a2j-guid', {
    hidpi: true,
    icons: 'a2j-guid',
    requires: 'widget,dialog',

    onLoad: function() {
      // Register styles for variable widget frame.
      CKEDITOR.addCss(
        'legal-nav-resource-id {' +
          'overflow: hidden;' +
          'text-overflow: ellipsis;' +
          'white-space: nowrap;' +
          'border-radius: 6px;' +
          'padding: 3px 10px;' +
          'display: inline-block;' +
        '}'
      )
    },

    init: function(editor) {
      // Register dialog.
      CKEDITOR.dialog.add('guid', this.path + 'dialogs/guid.js')

      editor.widgets.add('a2j-guid', {
        inline: true,
        dialog: 'guid',
        pathName: 'guid',
        button: 'Insert a GUID',
        template: '<legal-nav-resource-id guid="" name=""></legal-nav-resource-id>',

        upcast: function(element) {
          return element.name === 'legal-nav-resource-id'
        },

        downcast: function(element) {
          // Downcast set the html to be the name of the resource
          element.setHtml(this.data.name)
        },

        init: function() {
          // Set the name of the tag as the content on init
          const id = this.element.getAttribute('guid') || ''
          const name = this.element.getAttribute('name') || ''
          // Set the attributes and the text for the widget within
          // the editor
          this.setData('guid', id)
          this.setData('name', name)
        },

        // callback executed when data changes through setData.
        data: function() {
          // If we have an init value then use this for the
          this.element.setAttribute('guid', this.data.guid)
          this.element.setAttribute('name', this.data.name)
        }
      })
    }
  })
})()
