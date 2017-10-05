import Map from 'can/map/';
import Component from 'can/component/';
import template from './avatar.stache!';
import _includes from 'lodash/includes';
import canUtil from 'can/util/';

import 'can/map/define/';

const genderEnum = ['female', 'male'];
const facingEnum = ['front', 'right', 'left'];
const skinEnum = ['light', 'lighter', 'medium', 'dark', 'darker'];

// helper function to set type
const enumType = function(enumColl) {
  return function(value) {
    return _includes(enumColl, value) ?
      value :
      enumColl[0];
  };
};

function getBaseUrl () {
  // Source: https://github.com/canjs/canjs/blob/432c9b0c0f9f8ace62788cf7c8258998673856b9/view/stache/mustache_helpers.js#L204
  return (
    canUtil.baseURL ||
    typeof System !== 'undefined' && (System.renderingLoader && System.renderingLoader.baseURL || System.baseURL) ||
    location.pathname
  );
}

function joinBaseUrl () {
  return canUtil.joinURIs(getBaseUrl(), 'viewer/images/');
}

/**
 * @property {can.Map} avatar.ViewModel
 * @parent <a2j-viewer-avatar>
 *
 * `<a2j-viewer-avatar>`'s viewModel.
 */
export let ViewerAvatarVM = Map.extend('ViewerAvatarVM', {
  define: {
    /**
     * @property {String} avatar.ViewModel.prototype.gender gender
     * @parent avatar.ViewModel
     *
     * avatar gender
     */
    gender: {
      value: 'female',
      type: enumType(genderEnum)
    },

    /**
     * @property {String} avatar.ViewModel.prototype.skin skin
     * @parent avatar.ViewModel
     *
     * avatar skin tone
     */
    skin: {
      value: 'light',
      type: enumType(skinEnum)
    },

    /**
     * @property {String} avatar.ViewModel.prototype.facing facing
     * @parent avatar.ViewModel
     *
     * avatar facing
     */
    facing: {
      value: 'front',
      type: enumType(facingEnum)
    },

    /**
     * @property {String} avatar.ViewModel.prototype.avatarImageName avatarImageName
     * @parent avatar.ViewModel
     *
     * avatar image name is used for loading the svg
     */
    avatarImageName: {
      get() {
        let gender = this.attr('gender');
        let facing = this.attr('facing');

        return `avatar-${gender}-${facing}.svg`;
      }
    },

    /**
     * @property {String} avatar.ViewModel.prototype.svgInline svgInline
     * @parent avatar.ViewModel
     *
     * svg text rendered inline in avatar.stache
     */
    svgInline: {
      value: ''
    },

    /**
     * @property {String} avatar.ViewModel.prototype.svgBasePath svgBasePath
     * @parent avatar.ViewModel
     *
     * base path used with avatarImageName to load avatar svgs
     */
    svgBasePath: {
      get() {
        return joinBaseUrl('viewer/images/');
      }
    }
  },

  /**
   * @property {Function} avatar.ViewModel.prototype.fireAvatarLoaded fireAvatarLoaded
   * @parent avatar.ViewModel
   *
   * fires the avatarLoaded() function passed from steps.js to trigger dom updates
   */
  fireAvatarLoaded() {
    const avatarLoaded = this.attr('avatarLoaded');
    if (avatarLoaded) {
      avatarLoaded();
    }
  }
});

/**
 * @module {Module} viewer/desktop/avatar/ <a2j-viewer-avatar>
 * @parent api-components
 *
 * this component displays an interview's avatar
 *
 * ## Use
 *
 * @codestart
 *   <a2j-viewer-avatar
 *    class="avatar-guide"
 *    {@avatar-loaded}="@avatarLoaded"
 *    {skin}="avatarSkinTone"
 *    {gender}="interview.guideAvatarGender"
 *    {facing}="guideAvatarFacingDirection" />
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-viewer-avatar',
  viewModel: ViewerAvatarVM,

  events: {
    inserted() {
      this.loadAvatarSvg();
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
        this.loadAvatarSvg();
    },

    setSkinClassName(skin) {
      let $svg;
      if (this.element) {
        var isGuide = this.element.attr('class').indexOf('guide') !== -1;
        var avatarSelector = isGuide ? '.avatar-guide' : '.avatar-client';
        // get the raw object element
        $svg = this.element.find(avatarSelector);
      }

      // do nothing if svg not in the DOM (e.g lack of browser support)
      if (!$svg) return;

      // space separated list of class names.
      let svgClasses = $svg.attr('class');

      // remove any skin-* class already set
      svgClasses = svgClasses.replace(/skin-\S*/g, '').trim();

      // apply the updated classes list.
      $svg.attr('class', `${svgClasses} skin-${skin}`);
    },

    loadAvatarSvg() {
      let vm =  this.viewModel;
      let svgBasePath = vm.attr('svgBasePath');
      let avatarImageName = vm.attr('avatarImageName');
      let skin = vm.attr('skin');
      let self = this;

      $.ajax({
        url: svgBasePath + avatarImageName,
        dataType: 'text'
      })
      .then(function(data) {
        vm.attr('svgInline', data);
        self.setSkinClassName(skin);
        vm.fireAvatarLoaded();
      });
    }
  }
});
