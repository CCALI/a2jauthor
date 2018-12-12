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

  'legal-nav': {
    tag: 'a2j-conditional',
    children: [
      A2JTemplate.makeFromTreeObject({
        rootNode: {
          tag: 'a2j-template',
          children: [
            {
              tag: 'a2j-section-title',
              state: {
                underline: true,
                editActive: true,
                title: 'Section title'
              },
              children: []
            },
            {
              tag: 'a2j-rich-text',
              state: {
                editActive: true,
                userContent: 'Add some text...'
              },
              children: []
            }
          ]
        }
      }),
      new A2JTemplate(),
      new A2JNode({
        state: {},
        children: [],
        tag: 'conditional-add-element'
      }),
      new A2JNode({
        state: {},
        children: [],
        tag: 'conditional-add-element'
      })
    ],
    state: {
      editActive: true
    }
  }
}

export default function createEmptyNode (nodeName) {
  const nodeDefinition = emptyNodes[nodeName]

  if (nodeDefinition) {
    return new A2JNode(nodeDefinition)
  } else {
    console.error('Unknown Node: ', nodeName)
  }
}
