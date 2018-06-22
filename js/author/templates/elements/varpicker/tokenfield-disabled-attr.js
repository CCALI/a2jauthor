import $ from 'jquery';

import 'can/view/';

canViewCallbacks.attr('tokenfield-disabled', function(el, attrData) {
  let $el = $(el);
  let attrValue = el.getAttribute('tokenfield-disabled');
  let disabledCompute = attrData.scope.compute(attrValue);

  function onChange(ev, newVal) {
    $el.tokenfield(newVal ? 'disable' : 'enable');
  }

  disabledCompute.bind('change', onChange);

  $el.on('tokenfield:destroyed', function() {
    disabledCompute.unbind(onChange);
  });
});
