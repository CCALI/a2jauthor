export default {
  guide_id: '1261',
  template_id: '2112',
  title: 'Authorization for Medical Treatment of a Minor',
  rootNode: {
    component: 'a2j-template',
    state: {
    },
    children: [
      {
        component: '<free-form state="{.}"/>',
        state: {
          userContent: 'First <a2j-variable name="thing"></a2j-variable>.'
        }
      },
      {
        component: '<free-form state="{.}"/>',
        state: {
          userContent: 'Something completely different.'
        }
      }
    ]
  }
};
