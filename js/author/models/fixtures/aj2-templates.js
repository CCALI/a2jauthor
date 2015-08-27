import 'can/util/fixture/';

export default can.fixture('/api/templates/{template_id}', function(request) {
  let data = request.data || {};

  return {
    template_id: data.template_id || 'template-id',
    rootNode: {
      component: 'aj2-template',
      state: {
      },
      children: [
        {
          component: 'element-container',
          state: {
          },
          children: [
            {
              component: 'section-title',
              state: {
                underline: false,
                name: 'World'
              }
            },
            {
              component: 'free-form',
            }
          ]
        }
      ]
    }
  }
});
