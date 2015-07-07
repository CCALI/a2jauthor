/**
 * @module {{}} author/app_template app_template
 * @parent api-components
 *
 * This module exposes the author app renderer function and it is needed because
 * this template is loaded dynamically using `System.import` and a bundle was
 * required for a production build; since Steal is not able to bundle stacha files
 * yet, we have to bundle the renderer function instead.
 *
 */
import tpl from './app.stache!';

/**
 * @function template
 * Renderer function that returns a document fragment of the author app markup.
 */
export let template = tpl;
