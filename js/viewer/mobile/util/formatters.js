var FormattedValue = can.Control.extend({
  init: function() {
    this.set();
  },

  __format: function() {
    // return formatted version of this.options.value;
  },

  __deformat: function() {
    // return this.element[0].value sans format(keeps your model pristine);
  },

  '{value} change': 'set',

  set: function() {
    if (!this.element) {
      return;
    }

    setTimeout(() => {
      this.element[0].value = this.__format();
    });
  },

  change: function() {
    if (!this.element) {
      return;
    }

    this.options.value(this.__deformat());
  }
});

can.view.attr('can-ssn-value', function(el, data) {
  let attr = removeCurly(el.getAttribute('can-ssn-value'));

  let value = data.scope.computeData(attr, {
    args: []
  }).compute;

  new Value(el, {
    value: value
  });
});
