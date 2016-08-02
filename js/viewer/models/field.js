import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Answer from 'viewer/models/answer';

import 'can/map/define/';

const Field = Map.extend({
  define: {
    options: {
      value: ''
    },

    emptyAnswer: {
      get() {
        return new Answer({
          values: [null],
          type: this.attr('type'),
          repeating: this.attr('repeating'),
          name: this.attr('name').toLowerCase()
        });
      }
    }
  },

  getOptions() {
    let _this = this;
    let dfd = can.Deferred();

    if (this.attr('listData')) {
      this.attr('options', this.attr('listData'));
      dfd.resolve();
    } else if (this.attr('listSrc')) {
      let req = $.ajax({
        dataType: 'text',
        url: window.gGuidePath+this.attr('listSrc'),
      });

      let onSuccess = function(options) {
        _this.attr('options', options);
        dfd.resolve();
      };

      let onError = function() {
        dfd.reject();
      };

      req.then(onSuccess, onError);
    }

    return dfd;
  }
});

Field.List = List.extend({
  Map: Field
}, {});

export default Field;
