(function() {
  'use strict';

  CKEDITOR.plugins.add('a2j-variable', {
    hidpi: true,
    icons: 'a2j-variable',
    requires: 'widget,dialog',

    onLoad: function() {
      // Register styles for variable widget frame.
      CKEDITOR.addCss('a2j-variable { background-color: #D7ECF5; border-radius: 6px; padding: 3px 10px }');
    },

    init: function(editor) {
      // Register dialog.
      CKEDITOR.dialog.add('variables', this.path + 'dialogs/variables.js');

      editor.widgets.add('a2j-variable', {
        inline: true,
        dialog: 'variables',
        pathName: 'variables',
        button: 'Insert a Variable',
        template: '<a2j-variable name=""></a2j-variable>',

        upcast: function(element) {
          return element.name === 'a2j-variable';
        },

        downcast: function(element) {
          return new CKEDITOR.htmlParser.element('a2j-variable', {
            name: this.data.name
          });
        },

        init: function() {
          this.setData('name', this.element.getAttribute('name'));
        },

        // callback executed when data changes through setData.
        data: function() {
          this.element.setAttribute('name', this.data.name);
          this.element.setText(this.data.name);
        }
      });
    }
  });
})();
