let idNumber = 0

export default function ckeArea (data) { // change handler function, label, value, name
  idNumber++

  // Create the div
  const containerDiv = document.createElement('div')

  // name attribute
  if (data.name) {
    containerDiv.setAttribute('name', data.name)
  }
  // Create the label
  const formLabel = document.createElement('label')
  formLabel.className = 'control-label'
  // Create label text and add to label
  const labelText = document.createTextNode(data.label)
  formLabel.appendChild(labelText)
  if (data.label) {
    containerDiv.appendChild(formLabel)
  }

  // Create the 'textarea'/div for ckeditor to replace
  const id = `tinyCKE_${idNumber}`
  const textArea = document.createElement('div')
  textArea.setAttribute('id', id)
  textArea.setAttribute('rows', 1)
  textArea.setAttribute('contenteditable', true)
  textArea.className = 'htmledit form-control text editable taller'
  textArea.innerHTML = data.value

  // used as focusin handler below
  const replaceWithCKEditor = function (ev) {
    // do not re initialize the current instance
    if (window.CKEDITOR.instances[id]) { return }
    // add the CKEditor
    window.CKEDITOR.replace(document.getElementById(id), {
      // do not escape html entities, except special characters for xml compatibility
      // pasted in characters can cause issues otherwise, example: bullets
      entities: false,
      entities_latin: false,
      entities_greek: false,
      font_defaultLabel: 'Open Sans',
      fontSize_defaultLabel: '14px',
      pasteFilter: 'div, p, br, ul, ol, li, a, b, i, u, blockquote',
      startupFocus: 'end',
      autoGrow_onStartup: true,
      height: 55,
      autoGrow_minHeight: 55,
      linkShowAdvancedTab: false,
      linkShowTargetTab: false,
      extraPlugins: 'indent,a2j-popout,autogrow',
      removePlugins: 'magicline',
      language_list: [
        'sq:Albanian',
        'ar:Arabic:rtl',
        'bn:Bengali',
        'zh-cn:Chinese-Simplified',
        'cld:Chaldean',
        'nl:Dutch',
        'en:English',
        'fr:French',
        'km:Khmer',
        'ko:Korean',
        'pl:Polish',
        'ru:Russian',
        'es:Spanish',
        'vi:Vietnamese'
      ],
      toolbar: [
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Language' ] },
        { name: 'paragraph', items: [ 'Blockquote', 'Indent', 'Outdent', 'BulletedList', 'NumberedList' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'A2j-popout' ] }
      ],
      on: {
        blur: function (event) {
          // destroy triggers update to original div
          const instanceName = event.editor.name
          window.CKEDITOR.instances[instanceName].destroy(true)
        },
        change: function (event) {
          // Update the data when data changes
          const d = event.editor.getData()
          // change function sometimes requires field prop
          data.change(d, data.field)
        },
        destroy: function (event) {
          // update original div html with editor content, and cleanup event listener
          // editor.updateElement() native function was not working
          const editorHTML = event.editor.getData()
          const instanceName = event.editor.name
          const originalEl = document.getElementById(instanceName)
          if (originalEl) {
            originalEl.innerHTML = editorHTML
          }
        }
      }
    })

    // Only add CKEditor once, so once added remove the observation
    observer.disconnect()
  }

  // Mutation observer to listen to when the element is created in the DOM
  const observer = new window.MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const addedNodes = Array.from(mutation.addedNodes)
      addedNodes.forEach(function (node) {
        // only listen to ckeditor nodes
        if (!node.classList.contains('htmledit')) { return }
        // add ckeditor when node is focused
        node.addEventListener('focusin', replaceWithCKEditor)
        // handle event listener cleanup on node removal
        // have to use can.domMutate instead of mutation.removedNodes to target original div
        // because removedNodes targets the ckeditor node that replaces the original div
        window.can.domMutate.onNodeRemoval(node, function () {
          node.removeEventListener('focusin', replaceWithCKEditor)
        })
      })
    })
  })
  // Observer the containerDiv so we can listen to when the element is added
  observer.observe(containerDiv, {
    childList: true
  })

  // Add the form
  containerDiv.appendChild(textArea)

  return containerDiv
}
