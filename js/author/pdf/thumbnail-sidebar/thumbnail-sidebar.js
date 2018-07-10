import CanMap from "can-map";
import Component from "can-component";
import template from "./thumbnail-sidebar.stache";

export const ThumbnailSidebarVm = CanMap.extend({
  define: {
    isShowingThumbnails: {
      type: 'boolean',
      value: () => false
    },

    onDrawerHandleClick: {
      type: 'function'
    },

    onThumbnailClick: {
      type: 'function'
    },

    thumbnailImageUrls: {
      value: () => []
    },

    numberedThumbnails: {
      get() {
        return this.attr("thumbnailImageUrls").map((url, index) => ({
          url,
          pageNumber: index + 1
        }));
      }
    }
  },

  fireDrawerHandleClick() {
    const handler = this.attr("onDrawerHandleClick");
    if (handler) {
      handler();
    }
  },

  fireThumbnailClick(selectedThumbnailImageUrl) {
    const handler = this.attr("onThumbnailClick");
    if (handler) {
      handler(selectedThumbnailImageUrl);
    }
  }
});

export default Component.extend({
  tag: "thumbnail-sidebar",
  view: template,
  leakScope: false,
  ViewModel: ThumbnailSidebarVm
});
