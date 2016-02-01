import A2JNode from 'caja/author/models/a2j-node';

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
  }
};

export default function createEmptyNode(nodeName) {
  const nodeDefinition = emptyNodes[nodeName];

  if (nodeDefinition) {
    return new A2JNode(nodeDefinition);
  } else {
    console.error('Unknown Node: ', nodeName);
  }
}
