export default {
  guide_id: '1261',
  template_id: '2113',
  title: 'General Counsel Opening Statement',
  rootNode: {
    component: 'a2j-template',
    state: {
    },
    children: [
      {
        component: '<free-form state="{.}"/>',
        state: {
          userContent: 'Hello, <a2j-variable name="Client first name TE"></a2j-variable>.'
        }
      },
      {
        component: '<section-title state="{.}"></section-title>',
        state: {
          title: 'This is a Section Title',
          underline: true
        }
      }
    ]
  }
};
