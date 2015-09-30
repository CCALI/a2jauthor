(function() {
  'use strict';

  CKEDITOR.plugins.add('a2j-variable', {
    requires: 'widget',

    onLoad: function() {
      // Register styles for variable widget frame.
      CKEDITOR.addCss('a2j-variable { background-color: #D7ECF5; border-radius: 6px; padding: 3px 10px }');
    },

    init: function(editor) {
      editor.widgets.add('a2j-variable', {
        inline: true,

        template: '<a2j-variable name=""></a2j-variable>',

        upcast: function(element) {
          if (element.name === 'a2j-variable') {
            var name = element.attributes.name;
            var text = new CKEDITOR.htmlParser.text(name);

            element.add(text);
            return element;
          }
        },

        downcast: function(element) {
          return new CKEDITOR.htmlParser.element('a2j-variable', {
            name: this.data.name
          });
        },

        init: function() {
          this.setData('name', this.element.getAttribute('name'));
        }
      });
    }
  });
})();
