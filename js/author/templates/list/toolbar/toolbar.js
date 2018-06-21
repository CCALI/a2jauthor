import Map from "can/map/";
import Component from "can/component/";
import template from "./toolbar.stache";

import "can/route/";
import "can/map/define/";
import "bootstrap/js/modal";

import { sharedPdfFlag } from "caja/author/pdf/index";

export let Toolbar = Map.extend({
  define: {
    filter: {
      type: "string"
    },

    searchToken: {
      type: "string",
      value: ""
    },

    showClearButton: {
      get() {
        return this.attr("searchToken").length;
      }
    }
  },

  setFilter(filter) {
    this.attr("filter", filter);
  },

  clearSearchToken() {
    this.attr("searchToken", "");
  },

  openNewTemplate(flag) {
    sharedPdfFlag.set(flag);
    const newTemplateTransition = {
      page: "templates",
      templateId: "new"
    };

    can.route.attr(newTemplateTransition);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: Toolbar,
  tag: "templates-toolbar",
  events: {
    ".search-input keyup": function(target) {
      let newToken = target.val().trim();
      this.viewModel.attr("searchToken", newToken);
    }
  }
});
