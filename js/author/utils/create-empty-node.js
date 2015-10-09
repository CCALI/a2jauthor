import A2JNode from 'author/models/a2j-node';

let emptyNodes = {
  'section-title': {
    component: '<section-title state="{.}"></section-title>',
    state: {
      underline: true,
      editActive: true,
      title: 'Section title'
    }
  },

  'rich-text': {
    component: '<free-form state="{.}"/>',
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
