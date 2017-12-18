import Map from 'can/map/';
import Component from 'can/component/';
import template from './text-stats.stache';

/**
 * @property {can.Map} text-stats.ViewModel
 * @parent `<text-stats>`
 *
 * `<text-stats>`'s viewModel.
 *
 */
export const TextStatsVM = Map.extend('TextStatsVM', {
  define: {
    stats: {}
  }
});

/**
 * @module {Module} viewer/author/report/text-stats <text-stats>
 * @parent api-components
 *
 * This component is used to render text statistics in page-partial.stache and popup-partial.stache
 * The incomingStats below is either textStats, learnStats, or helpStats from the current page being rendered
 *
 * ## Use
 *
 * @codestart
 *   <text-stats {stats}="incomingStats"></text-stats>
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'text-stats',
  viewModel: TextStatsVM
});
