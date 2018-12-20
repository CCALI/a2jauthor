import A2JNode from 'caja/author/models/a2j-node'
import A2JTemplate from 'caja/author/models/a2j-template'

const emptyNodes = {
  'section-title': {
    tag: 'a2j-section-title',
    children: [],
    state: {
      underline: true,
      editActive: true,
      title: 'Section title'
    }
  },

  'rich-text': {
    tag: 'a2j-rich-text',
    children: [],
    state: {
      editActive: true,
      userContent: 'Add some text...'
    }
  },

  'page-break': {
    tag: 'a2j-page-break',
    children: [],
    state: {
      editActive: true
    }
  },

  'repeat-loop': {
    tag: 'a2j-repeat-loop',
    children: [],
    state: {
      editActive: true
    }
  },

  'if-else': {
    tag: 'a2j-conditional',
    children: [],
    state: {
      editActive: true
    }
  },

  // create a "legal nav", which is just an if/else with a section title and
  // rich text block in its if body
  //
  // issues:
  // - if created like the elements above, it either wouldn't create the child
  //   elements, OR
  // - if you used `new A2JNode', it would create the elements /once/, and they
  //   would be linked by a common A2JTemplate, which would mean they would
  //   share child elements (i.e. editing one child would edit another
  //   conditional's child; see #2199 for details on this bug)
  // good to know: see the a2j-conditional view model for how its children are
  // laid out. The fact that its if and else body are a2j-template elements has
  // led to a couple of bugs and can be confusing to work with (though obviously
  // is powerful and useful and greatly reduces duplication)
  'legal-nav': function constructNewLegalNav () {
    const conditional = new A2JNode({
      tag: 'a2j-conditional',
      children: [],
      state: {
        editActive: true
      }
    })

    const richTextNode = new A2JNode({
      tag: 'a2j-rich-text',
      children: [],
      state: {
        editActive: true,
        userContent: 'Add some text...'
      }
    })

    const sectionTitleNode = new A2JNode({
      tag: 'a2j-section-title',
      children: [],
      state: {
        underline: true,
        editActive: true,
        title: 'Section title'
      }
    })

    const addElementNode = {
      state: {},
      children: [],
      tag: 'conditional-add-element'
    }

    conditional.attr('children').replace([
      new A2JTemplate(),
      new A2JTemplate(),
      new A2JNode(addElementNode),
      new A2JNode(addElementNode)
    ])

    const ifBodyA2JTemplateRootNode =
          conditional.attr('children').attr(0).attr('rootNode').children

    ifBodyA2JTemplateRootNode.push(sectionTitleNode)
    ifBodyA2JTemplateRootNode.push(richTextNode)

    return conditional
  }
}

export default function createEmptyNode (nodeName) {
  const nodeDefinitionOrConstructor = emptyNodes[nodeName]

  if (typeof nodeDefinitionOrConstructor === 'function') {
    return nodeDefinitionOrConstructor()
  } else if (nodeDefinitionOrConstructor) {
    return new A2JNode(nodeDefinitionOrConstructor)
  } else {
    console.error('Unknown Node: ', nodeName)
  }
}
