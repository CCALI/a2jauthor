import CanMap from 'can-map'
import Component from 'can-component'
import template from './avatar.stache'
import joinURIs from 'can-util/js/join-uris/join-uris'
import {
  Face,
  Hair,
  Skin,
  Gender,
  getClassNameForSkin,
  getClassNameForHair
} from './colors'

import 'can-map-define'

function getBaseUrl () {
  return window.System.baseURL
}

function joinBaseUrl () {
  return joinURIs(getBaseUrl(), 'viewer/images/')
}

/**
 * @property {can.Map} avatar.ViewModel
 * @parent <a2j-viewer-avatar>
 *
 * `<a2j-viewer-avatar>`'s viewModel.
 */
export let ViewerAvatarVM = CanMap.extend('ViewerAvatarVM', {
  define: {
    /**
     * @property {String} avatar.ViewModel.prototype.gender gender
     * @parent avatar.ViewModel
     *
     * avatar gender
     */
    gender: {
      type: Gender,
      value: Gender.defaultValue
    },

    /**
     * @property {String} avatar.ViewModel.prototype.skin skin
     * @parent avatar.ViewModel
     *
     * avatar skin tone
     */
    skin: {
      type: Skin,
      value: Skin.defaultValue
    },

    /**
     * @property {String} avatar.ViewModel.prototype.hair hair
     * @parent avatar.ViewModel
     *
     * avatar hair color
     */
    hair: {
      type: Hair,
      value: Hair.defaultValue
    },

    /**
     * @property {String} avatar.ViewModel.prototype.facing facing
     * @parent avatar.ViewModel
     *
     * avatar facing
     */
    facing: {
      type: Face,
      value: Face.defaultValue
    },

    /**
     * @property {String} avatar.ViewModel.prototype.avatarImageName avatarImageName
     * @parent avatar.ViewModel
     *
     * avatar image name is used for loading the svg
     */
    avatarImageName: {
      get () {
        let gender = this.attr('gender')
        let facing = this.attr('facing')

        return `avatar-${gender}-${facing}.svg`
      }
    },

    /**
     * @property {String} avatar.ViewModel.prototype.svgInline svgInline
     * @parent avatar.ViewModel
     *
     * svg text rendered inline in avatar.stache'
     */
    svgInline: {
      value: ''
    },

    svgClassNames: {
      get () {
        const isGuide = this.attr('kind') === 'guide'
        const baseClass = isGuide ? 'avatar-guide' : 'avatar-client'
        const isMale = this.attr('gender') === 'male'
        const genderClass = isMale ? 'avatar-male' : 'avatar-female'
        const skinClass = getClassNameForSkin(this.attr('skin'))
        const hairClass = getClassNameForHair(this.attr('hair'))

        return `${baseClass} ${genderClass} ${skinClass} ${hairClass}`
      }
    },

    /**
     * @property {String} avatar.ViewModel.prototype.svgBasePath svgBasePath
     * @parent avatar.ViewModel
     *
     * base path used with avatarImageName to load avatar svgs
     */
    svgBasePath: {
      get () {
        return joinBaseUrl('viewer/images/')
      }
    }
  },

  /**
   * @property {Function} avatar.ViewModel.prototype.fireAvatarLoaded fireAvatarLoaded
   * @parent avatar.ViewModel
   *
   * fires the avatarLoaded() function passed from steps.js to trigger dom updates
   */
  fireAvatarLoaded () {
    const avatarLoaded = this.attr('avatarLoaded')
    if (avatarLoaded) {
      avatarLoaded()
    }
  }
})

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
  view: template,
  tag: 'a2j-viewer-avatar',
  ViewModel: ViewerAvatarVM,

  events: {
    inserted () {
      this.loadAvatarSvg()
    },

    // when the image name changes, we need to wait for the new svg to be
    // loaded to then make the adjustments to the css class name.
    '{viewModel} avatarImageName': function () {
      this.loadAvatarSvg()
    },

    '{viewModel} svgClassNames': function () {
      this.updateSvgClass()
    },

    updateSvgClass () {
      if (!this.element) {
        return
      }

      const classNames = this.viewModel.attr('svgClassNames')
      const svg = $(this.element).find('.avatar-guide, .avatar-client')
      svg.attr('class', classNames)
    },

    loadAvatarSvg () {
      const vm = this.viewModel
      const svgBasePath = vm.attr('svgBasePath')
      const avatarImageName = vm.attr('avatarImageName')

      $.ajax({
        url: svgBasePath + avatarImageName,
        dataType: 'text'
      }).then(data => {
        vm.attr('svgInline', data)
        this.updateSvgClass()
        vm.fireAvatarLoaded()
      })
    }
  },

  leakScope: true
})
