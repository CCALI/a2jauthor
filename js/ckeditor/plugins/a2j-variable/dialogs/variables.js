
'use strict';

CKEDITOR.dialog.add('variables', function(editor) {
  var listItems;
  var selectedVariable;

  // load dialog styles
  var plugin = CKEDITOR.plugins.get('a2j-variable');
  CKEDITOR.document.appendStyleSheet(CKEDITOR.getUrl(plugin.path + 'dialogs/variables.css'));

  // takes the `vars` object from `gGuide` and returns an array of variable names.
  function getVarsNames(guideVars) {
    var keys = Object.keys(guideVars);

    return keys.map(function(key) {
      var varData = guideVars[key];
      return varData.name;
    });
  }

  function setActiveItem(item) {
    if (!listItems) return;

    var dialog = CKEDITOR.dialog.getCurrent();

    listItems.forEach(function(listItem) {
      listItem.removeClass('active');
    });

    selectedVariable = item.getHtml();
    item.addClass('active');
  }

  function filterItemsByName(text) {
    if (!listItems) return;
    text = text.toLowerCase();

    if (!text) {
      listItems.forEach(function(item) {
        item.removeClass('hidden');
      });
    } else {
      listItems.forEach(function(item) {
        var varName = item.getHtml().toLowerCase();

        if (varName.indexOf(text) !== -1) {
          item.removeClass('hidden');
        } else {
          item.addClass('hidden');
        }
      });
    }
  }

  function renderListItems(container, variables) {
    listItems = [];

    variables.forEach(function(variable) {
      var item = CKEDITOR.dom.element.createFromHtml('<li class="list-group-item"></li>');
      item.setHtml(variable);

      item.on('click', function() {
        setActiveItem(item);
      });

      container.append(item);
      listItems.push(item);
    });
  }

  return {
    minWidth: 400,
    minHeight: 300,
    title: 'Select a variable',

    contents: [{
      id: 'search',
      elements: [{
        id: 'width',
        type: 'text',
        width: '100%',
        label: 'Search for a variable:',
        onKeyup: function() {
          // poor's man throtle
          var _this = this;

          setTimeout(function() {
            filterItemsByName(_this.getValue());
          }, 50);
        }
      }, {
        type: 'vbox',
        id: 'listWrapper',
        className: 'list-group-wrapper',
        children: [{
          id: 'variablesList',
          type: 'html',
          html: '<ul class="list-group"></ul>',

          commit: function(widget) {
            if (selectedVariable) {
              widget.setData('name', selectedVariable);
            }
          }
        }]
      }]
    }],

    onShow: function() {
      var guide = window.gGuide;

      if (gGuide) {
        var variableNames = getVarsNames(gGuide.vars);
        var list = this.getContentElement('search', 'variablesList').getElement();

        list.setHtml('');
        renderListItems(list, variableNames);
      } else {
        console.warn('CKEditor: There is no guide selected');
      }
    }
  };
});
