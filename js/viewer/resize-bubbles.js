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
  } else if (_inRange(sidewalkHeight, 100, 300)) {
    maxSteps = 2;
  } else if (_inRange(sidewalkHeight, 300, 500)) {
    maxSteps = 3;
  } else if (_inRange(sidewalkHeight, 500, 750)) {
    maxSteps = 4;
  } else {
    maxSteps = 5;
  }

  return interviewSteps < maxSteps ? interviewSteps : maxSteps;
}

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

  let computeStepStyles = function(width) {
    return {
      'margin-right': `-${Math.ceil(width * .1)}px`,
      width: `calc(0% + ${Math.ceil(width + (width * .3))}px)`
    };
  };

  let nextWidth;
  let denominator = Math.tan(angleB * Math.PI / 180);

  nextWidth = (sidewalkHeight * .65) / denominator;
  $('.step-current .app-step').css(computeStepStyles(nextWidth));

  // Next 2
  nextWidth = (sidewalkHeight * .47) / denominator;
  $('#next-2 .app-step').css(computeStepStyles(nextWidth));

  nextWidth = (sidewalkHeight * .35) / denominator;
  $('.steps-2 #next-2 .app-step').css(computeStepStyles(nextWidth));

  // Next 3
  nextWidth = (sidewalkHeight * .33) / denominator;
  $('#next-3 .app-step').css(computeStepStyles(nextWidth));

  nextWidth = (sidewalkHeight * .30) / denominator;
  $('.steps-4 #next-3 .app-step').css(computeStepStyles(nextWidth));

  nextWidth = (sidewalkHeight * .28) / denominator;
  $('.steps-3 #next-3 .app-step').css(computeStepStyles(nextWidth));

  // Next 4
  nextWidth = (sidewalkHeight * .21) / denominator;
  $('#next-4 .app-step').css(computeStepStyles(nextWidth));

  nextWidth = (sidewalkHeight * .17) / denominator;
  $('.steps-4 #next-4 .app-step').css(computeStepStyles(nextWidth));

  // Next 5
  nextWidth = (sidewalkHeight * .13) / denominator;
  $('#next-5 .app-step').css(computeStepStyles(nextWidth));
};
