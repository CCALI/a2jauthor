/**
 * @module {{}} author/app_template app_template
 * @parent api
 *
 * This module exposes the author app renderer function and it is needed because
 * this template is loaded dynamically using `System.import` and a bundle was
 * required for a production build; since Steal is not able to bundle stacha files
 * yet, we have to bundle the renderer function instead.
 *
 * @option {function} template Renderer function that returns a document fragment
 * of the author app markup.
 *
 */
import tpl from './app.stache!';

export let template = tpl;
