export default {
  guideId: '1261',
  templateId: '2113',
  updatedAt: '2015-10-24T14:16:23.688Z',
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
