import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Answer from 'viewer/models/answer';

import 'can/map/define/';

let Field = Map.extend({
  define: {
    answer: {
      get: function() {
        var answer = this.page.interview.attr('answers').attr(this.attr('name'));

        if (answer) {
          return answer;
        } else {
          answer = new Answer({
            name: this.attr('name').toLowerCase(),
            type: this.attr('type'),
            repeating: this.attr('repeating'),
            values: [null]
          });

          this.page.interview.attr('answers').attr(this.attr('name').toLowerCase(), answer);
          return answer;
        }
      }
    },

    options: {
      value: ''
    }
  },

  getOptions: function() {
    let _this = this;
    let dfd = new can.Deferred();

    if (this.attr('listData')) {
      this.attr('options', this.attr('listData'));
      dfd.resolve();
    }
    else if (this.attr('listSrc')) {
      let req = $.ajax({
        dataType: 'text',
        url: this.attr('listSrc'),
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
