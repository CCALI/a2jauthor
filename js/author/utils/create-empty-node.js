import A2JNode from 'author/models/a2j-node';

let emptyNodes = {
  'section-title': {
    component: '<a2j-section-title state="{.}" />',
    state: {
      underline: true,
      editActive: true,
      title: 'Section title'
    }
  },

  'rich-text': {
    component: '<a2j-rich-text state="{.}" />',
    state: {
      editActive: true,
      userContent: 'Add some text...'
    }
  }
};

export default function createEmptyNode(nodeName) {
  let nodeDefinition = emptyNodes[nodeName];

  if (nodeDefinition) {
    return new A2JNode(nodeDefinition);
  } else {
    console.error('Unknown Node ', nodeName);
  }
};
