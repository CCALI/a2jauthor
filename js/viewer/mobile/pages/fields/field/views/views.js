import text from './text.stache!';
import radio from './radio.stache!';
import number from './number.stache!'
import gender from './gender.stache!';
import datemdy from './datemdy.stache!';
import textpick from './textpick.stache!';
import textlong from './textlong.stache!';
import checkbox from './checkbox.stache!';
import numberpick from './numberpick.stache!';

export default {
  checkbox, number, text,
  gender, datemdy, textlong,
  radio, numberpick, textpick,

  numberphone: text,
  numberssn: number,
  numberzip: number,
  numberdollar: number,
  checkboxNOTA: checkbox
};
