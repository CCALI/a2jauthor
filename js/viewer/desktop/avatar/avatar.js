import Map from 'can/map/';
import Component from 'can/component/';
import template from './avatar.stache!';
import _includes from 'lodash/includes';

import 'can/map/define/';

const genderEnum = ['female', 'male'];
const facingEnum = ['front', 'right', 'left'];
const skinEnum = ['light', 'lighter', 'medium', 'dark', 'darker'];

const enumType = function(enumColl) {
  return function(value) {
    return _includes(enumColl, value) ?
      value :
      enumColl[0];
  };
};

export let ViewerAvatarVM = Map.extend({
  define: {
    gender: {
      value: 'female',
      type: enumType(genderEnum)
    },

    skin: {
      value: 'light',
      type: enumType(skinEnum)
    },

    facing: {
      value: 'front',
      type: enumType(facingEnum)
    },

    avatarImageName: {
      get() {
        let gender = this.attr('gender');
        let facing = this.attr('facing');

        return `avatar-${gender}-${facing}.svg`;
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-viewer-avatar',
  viewModel: ViewerAvatarVM,

  events: {
    inserted() {
      this.element.find('object').one('load', () => {
        let skin = this.viewModel.attr('skin');
        this.setSkinClassName(skin);
      });
    },

    // When the skin changes, there is no need to wait for the svg
    // to load since its data property does not change.
    '{viewModel} skin': function() {
      let skin = this.viewModel.attr('skin');
      this.setSkinClassName(skin);
    },

    // when the image name changes, we need to wait for the new svg to be
    // loaded to then make the adjustments to the css class name.
    '{viewModel} avatarImageName': function() {
      this.element.find('object').one('load', () => {
        let skin = this.viewModel.attr('skin');
        this.setSkinClassName(skin);
      });
    },

    setSkinClassName(skin) {
      // get the raw object element
      let obj = this.element.find('object').get(0);

      // get the document inside object and then the svg.
      let objDoc = obj.contentDocument;
      let $svg = $(objDoc.getElementsByTagName('svg'));

      // do nothing if svg not in the DOM (e.g lack of browser support)
      if (!$svg) return;

      // space separated list of class names.
      let svgClasses = $svg.attr('class');

      // remove any skin-* class already set
      svgClasses = svgClasses.replace(/skin-\S*/g, '').trim();

      // apply the updated classes list.
      $svg.attr('class', `${svgClasses} skin-${skin}`);
    }
  }
});
