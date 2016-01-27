import A2JNode from 'caja/author/models/a2j-node';

const emptyNodes = {
  'section-title': {
    tag: 'a2j-section-title',
    state: {
      underline: true,
      editActive: true,
      title: 'Section title'
    }
  },

  'rich-text': {
    tag: 'a2j-rich-text',
    state: {
      editActive: true,
      userContent: 'Add some text...'
    }
  },

  'page-break': {
    tag: 'a2j-page-break',
    state: {
      editActive: true
    }
  },

  'repeat-loop': {
    tag: 'a2j-repeat-loop',
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
