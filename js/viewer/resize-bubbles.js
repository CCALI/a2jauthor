import $ from 'jquery';
import _inRange from 'lodash/number/inRange';

export function resizeBubbles() {
  let $guideBubble = $('#guideBubble');
  let $clientBubble = $('#clientBubble');

  if ($guideBubble.height() > $guideBubble.parent().height()) {
    $guideBubble.addClass('vertical').removeClass('top');
  } else {
    $guideBubble.removeClass('vertical').addClass('top');
  }

  if ($clientBubble.height() > $clientBubble.parent().height()) {
    $clientBubble.addClass('vertical').removeClass('top');
  } else {
    $clientBubble.removeClass('vertical').addClass('top');
  }
}

export function getMaxStepsOnScreen(sidewalkHeight, interviewSteps) {
  let maxSteps;

  if (sidewalkHeight < 100) {
    maxSteps = 1;
  } else if (_inRange(sidewalkHeight, 100, 450)) {
    maxSteps = 2;
  } else if (_inRange(sidewalkHeight, 450, 550)) {
    maxSteps = 3;
  } else if (_inRange(sidewalkHeight, 550, 750)) {
    maxSteps = 4;
  } else {
    maxSteps = 5;
  }

  return interviewSteps < maxSteps ? interviewSteps : maxSteps;
}

function computeStepStyles(width) {
  return {
    'margin-right': `-${Math.ceil(width * .1)}px`,
    width: `calc(0% + ${Math.ceil(width + (width * .3))}px)`
  };
};

export function resizeSteps(interviewSteps) {
  let $body = $('body');
  let $html = $('html');
  let $guideBubble = $('#guideBubble');
  let $clientBubble = $('#clientBubble');
  let sidewalkWidth = $('#sidewalk').width();
  let sidewalkHeight = $('#sidewalk').height();

  // Length of the angle of the sidewalk
  let sidewalkLength = Math.sqrt(Math.pow(sidewalkHeight, 2) + Math.pow(sidewalkWidth, 2));

  // Get the angles of the sidewalk
  let angleA = 90 - Math.asin(sidewalkHeight / sidewalkLength) * (180 / Math.PI);
  let angleB = 180 - 90 - angleA;

  // Remove all the step classes first
  $body.removeClass('steps-1 steps-2 steps-3 steps-4 steps-5');

  // Add or remove steps based on sidewalk height
  let maxStepsOnScreen = getMaxStepsOnScreen(sidewalkHeight, interviewSteps);
  $body.addClass(`steps-${maxStepsOnScreen}`);

  let denominator = Math.tan(angleB * Math.PI / 180);

  // calculate @minus-header less variable
  let headerHeight = $body.height() - sidewalkHeight;
  let minusHeader = Math.ceil(headerHeight / 2);

  let bodyHeight = $body.height();

  $('.app-step').each((i, el) => {
    let $parent = $(el).parent();
    let parentBottom;

    if ($parent.hasClass('step-current')) {
      // current step will line up with bottom of avatar
      parentBottom = $parent.offset().top;
    } else {
      // other steps will be positioned based on parent's `bottom` css property
      parentBottom = $parent.css('bottom');
      parentBottom = +parentBottom.slice(0, parentBottom.indexOf('px'));
    }

    // calculate percentage x from less equation `calc(~"x% - " minusHeader) = bodyHeight`
    let parentBottomPercentage = Math.ceil(((parentBottom + minusHeader) / bodyHeight) * 100);

    // calculate percentage remaining from 100%
    let remainingPercentage = (100 - parentBottomPercentage) / 100;

    let nextWidth = (sidewalkHeight * remainingPercentage) / denominator;
    $(el).css(computeStepStyles(nextWidth));
  });
};
