import Map from 'can/map/';
import Component from 'can/component/';
import template from './evaluate.stache!';
import $ from 'jquery';

import 'can/map/define/';

/**
 * @property {can.Map} evaluatePanel.ViewModel
 * @parent <author-evaluate-panel>
 *
 * `<author-evaluate-panel>`'s viewModel.
 */
export let EvaluatePanelVM = Map.extend('EvaluatePanelVM',{
    define: {
        traceLogic: {
            value: null
        }
    },

    /**
     * @function authorEvaluatePanel.ViewModel.prototype.evaluateScript evaluateScript
     * @parent authorEvaluatePanel.ViewModel
     *
     * fire A2J script expression
     *
     * Allows the Author to do live testing of expressions based on supplied values or
     * current values for variables in the interview.
     *
     * ex: [User Gender] = "Female" or DOLLARROUND(54332.64)
     */
    evaluateScript() {
        let evalResults;
        let traceLogic = this.attr('traceLogic');
        let scriptText = $('#evaluate-input').val();
        if (scriptText) {
            evalResults = window.gLogic.evalBlock(scriptText);
        }

        if (evalResults.errors.length > 0) {
            evalResults.errors.forEach(function(error) {
                traceLogic.push({
                    expression: [ { format: 'valF', msg: 'ERROR' }, { format: 'code', msg: error.text } ]
                });
            });
        } else if (evalResults.text &&  traceLogic) {
            traceLogic.push({
                expression: [ { format: 'code', msg: scriptText + ' evaluates to: ' }, { format: 'val', msg: evalResults.text } ]
            });
        }
    }
});

export default Component.extend({
    template,
    leakScope: false,
    viewModel: EvaluatePanelVM,
    tag: 'author-evaluate-panel',

    events: {
    '#evaluate-input keyup': function(el, ev) {
        if (ev.keyCode===13) {
            $('#evaluate-button').click();
        }
    },
    }
});
