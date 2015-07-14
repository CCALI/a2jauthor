import Model from 'can/model/';

import 'can/map/define/';

let Guide = Model.extend({
  findAll: 'POST CAJA_WS.php',

  makeFindAll: function(findAllData) {
    return function(params, success, error) {
      params = (params == null) ? {} : params;
      params.cmd = 'guides';

      let dfd = findAllData(params).then((data) => {
        data = (data == null) ? {} : data;
        let guides = data.guides || [];
        return this.models(guides);
      });

      return dfd.then(success, error);
    };
  }
}, {
  define: {
    title: {
      type: 'string',
      value: 'Untitled'
    },

    fileSize: {
      type: 'number',
      get() {
        return this.attr('details.size');
      }
    },

    lastModified: {
      type: 'string',
      get() {
        return this.attr('details.modified');
      }
    }
  }
});

Guide.List = Guide.List.extend({
  owned: function() {
    return this.filter(guide => guide.attr('owned'));
  },

  samples: function() {
    return this.filter(guide => !guide.attr('owned'));
  }
});

export default Guide;
