
'use strict'

CKEDITOR.dialog.add('guid', function(editor) {
  var listItems
  var selectedResource
  var contentElement
  var selectedState
  var addTopic
  var clearTopic

  // load dialog styles
  var plugin = CKEDITOR.plugins.get('a2j-guid')
  CKEDITOR.document.appendStyleSheet(CKEDITOR.getUrl(plugin.path + 'dialogs/guid.css'))

  function setActiveItem(item) {
    if (!listItems) return

    // enable ok button on resource selection.
    var dialog = CKEDITOR.dialog.getCurrent()
    dialog.enableButton('ok')

    listItems.forEach(function(listItem) {
      listItem.removeClass('active')
    })

    selectedResource = item
    item.addClass('active')
  }

  function filterItemsByName(text) {
    if (!listItems) return
    text = text.toLowerCase()

    if (!text) {
      listItems.forEach(function(item) {
        item.removeClass('hidden')
      })
    } else {
      listItems.forEach(function(item) {
        var resourceName = item.getHtml().toLowerCase()

        if (resourceName.indexOf(text) !== -1) {
          item.removeClass('hidden')
        } else {
          item.addClass('hidden')
        }
      })
    }
  }

  function renderListItems(container, resources) {
    listItems = []

    resources.forEach(function(resource) {
      var item = CKEDITOR.dom.element.createFromHtml('<li class="list-group-item"></li>')
      item.setHtml(resource.name)
      item.setAttribute('guid', resource.url)
      item.setAttribute('name', resource.name)

      item.on('click', function() {
        setActiveItem(item)
      })

      container.append(item)
      listItems.push(item)
    })
  }

  function setResources (resources) {
    if (contentElement) {
      contentElement.setHtml('')
      renderListItems(contentElement, resources)
    }
  }

  function setTopics (topics) {
    // Remove existing topics
    clearTopic()
    // Set default
    addTopic(['Please select'])

    topics.forEach(topic => {
      addTopic(topic['topic-name'], topic['topic-id'])
    })
  }

  function setSelectedState (state) {
    // Set the state to a global, so we can use this once a topic is selected
    selectedState = state

    // Set the localStorage so we can remember this
    // on page reload
    if (window.localStorage) {
      window.localStorage.setItem('legalNavSelectedState', selectedState)
    }

    // Clear the html when the state changes
    setResources([])

    // Clear Topics
    setTopics([])

    // Load the topics for this chosen state
    window.$.ajax({
      type: 'GET',
      dataType: 'json',
      url: `https://legalnav.org/wp-json/wp/v2/topics/${state}`
    })
    .then((result) => {
      // Add the topics to the topicSelect
      setTopics(result)
    }, error => {
      console.log('Failed to load topics', error)
    })
  }

  return {
    minWidth: 400,
    minHeight: 300,
    title: 'Select a Resource',

    contents: [{
      id: 'search',
      elements: [{
        id: 'state',
        type: 'select',
        width: '100%',
        style: 'width:100%',
        label: 'Select state:',
        // Each item needs to be an array //-> [['Hawaii', 'hawaii'], ['Alaska', 'alaska']]
        // it produces <option value=“alaska”>Alaska</option>
        items: [['Please select']].concat(window.legalNavStates),
        'default': 'Please select',
        onChange: function() {
          // Set the state to a global, so we can use this once a topic is selected
          setSelectedState(this.getValue())
        },
        onShow: function () {
          // Check if we have a pre-selected state
          if (selectedState) {
            // Set the current/selected select value
            this.setValue(selectedState)
            // We want the setters to happen once all select elements
            // have been run and their onLoad has happened
            setTimeout(() => {
              setSelectedState(selectedState)
            }, 0)
          }
        }
      }, {
        id: 'topic',
        type: 'select',
        width: '100%',
        style: 'width:100%',
        label: 'Select topic:',
        items: [['Please select', 'Please select']],
        'default': 'Please select',
        onChange: function() {
          const topicId = this.getValue()
          // Load the resources for this chosen state and topicId
          window.$.ajax({
            type: 'GET',
            dataType: 'json',
            url: `https://legalnav.org/wp-json/wp/v2/state-topic-resources/${selectedState}/${topicId}`
          })
          .then((result) => {
            // Add results to the html
            setResources(result)
          }, error => {
            console.log('Failed to load resource', error)
          })
        },
        onLoad: function () {
          // Bind the add method for this select to a global
          // So when a state is picked we can AJAX and then insert the data
          // into this select
          addTopic = this.add.bind(this)
          // Clear Topic
          clearTopic = this.clear.bind(this)
        }
      }, {
        id: 'width',
        type: 'text',
        width: '100%',
        label: 'Search for a resource:',
        onKeyup: function() {
          // poor's man throtle
          var _this = this

          setTimeout(function() {
            filterItemsByName(_this.getValue())
          }, 50)
        }
      }, {
        type: 'vbox',
        id: 'listWrapper',
        className: 'list-group-wrapper',
        children: [{
          id: 'guidList',
          type: 'html',
          html: '<ul class="list-group"></ul>',

          commit: function (widget) {
            var dialog = CKEDITOR.dialog.getCurrent()
            var selectedElement = dialog.getSelectedElement()
            var url = selectedResource.getAttribute('guid')
            var name = selectedResource.getAttribute('name')

            if (selectedResource) {
              widget.setData('guid', url)
              widget.setData('name', name)
              // update the original source element's html on commit
              if (selectedElement) {
                // child 0 is the legal-nav-resource custom element
                var sourceElement = selectedElement.getChild(0)
                // sets the display in HTML
                sourceElement.setHtml(name)
              }
            }
          }
        }]
      }]
    }],

    onShow: function() {
      var dialog = CKEDITOR.dialog.getCurrent()
      contentElement = this.getContentElement('search', 'guidList').getElement()

      // disable ok button to avoid insertion of empty resources.
      dialog.disableButton('ok')

      // Clear the html when the state changes
      setResources([])

      if (!window.legalNavStates) {
        console.warn('CKEditor: There are no legalNavStates')
      }
    },

    onLoad: function () {
      if (window.localStorage) {
        selectedState = window.localStorage.getItem('legalNavSelectedState')
      }
    }
  }
})
