import 'can/util/fixture/';

export default can.fixture('/api/documents/{id}', function(request) {
  let data = request.data || {};

  return {
    id: data.id || 42,
    rootNode: {
      component: 'cali-document',
      state: {
      },
      children: [
        {
          component: 'cali-template',
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
