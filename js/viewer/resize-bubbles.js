import $ from 'jquery';

export default function resizeBubbles() {
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

  if ($guideBubble.height() > $guideBubble.parent().height()) {
    $guideBubble.addClass('vertical');
    $guideBubble.removeClass('top');
  } else {
    $guideBubble.removeClass('vertical');
    $guideBubble.addClass('top');
  }

  if ($clientBubble.height() > $clientBubble.parent().height()) {
    $clientBubble.addClass('vertical');
    $clientBubble.removeClass('top');
  } else {
    $clientBubble.removeClass('vertical');
    $clientBubble.addClass('top');
  }

  $body.removeClass('steps-1 steps-2 steps-3 steps-4 steps-5');

  let next2Width = (sidewalkHeight * .47) / (Math.tan(angleB * Math.PI / 180));
  $('#next-2 .app-step').css({
    width: 'calc(10% + ' + next2Width + 'px)'
  });

  let next3Width = (sidewalkHeight * .33) / (Math.tan(angleB * Math.PI / 180));
  $('#next-3 .app-step').css({
    width: 'calc(8% + ' + next3Width + 'px'
  });

  let next4Width = (sidewalkHeight * .21) / (Math.tan(angleB * Math.PI / 180));
  $('#next-4 .app-step').css({
    width: 'calc(6% + ' + next4Width + 'px'
  });

  let next5Width = (sidewalkHeight * .13) / (Math.tan(angleB * Math.PI / 180));
  $('#next-5 .app-step').css({
    width: 'calc(4% + ' + next5Width + 'px'
  });

  if (sidewalkHeight < 449) {
    $body.addClass('steps-1');
  } else if (sidewalkHeight > 449 && sidewalkHeight < 500) {
    $body.addClass('steps-2');
  } else if (sidewalkHeight > 499 && sidewalkHeight < 700) {
    $body.addClass('steps-3');
  } else if (sidewalkHeight > 699 && sidewalkHeight < 800) {
    $body.addClass('steps-4');
  } else {
    $body.addClass('steps-5');
  }
};
