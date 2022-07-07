# Where the Weird Stuff Lives
A2J Author contains a legacy JQuery app that is in the process of being refactored into CanJS components as we are able. This involves having some weird globals and event listener files to communicate between the 2 intertwined apps. 

The list of usual suspects for weird things:
- the legacy/ directory contains the jquery app files
- the src/ directory contains the canjs components - not weird, but relates to the above
- different images, images-root, and img directories due to the way some files are referenced
- styles/ directory houses globals styles that should really be moved closer to where they are used in component folders, and restructured to remove the prep-ended `bootstrap-styles` class. This will be challenging.
- jquery-ui is used for some interfaces - datepicker for example, but could and should be refactored out
- docs/ folder is likely fully deprecated, trust the wiki/ instead
- viewer-preview-layout.stache is the bridge between the Author app and the Viewer app being used for preview functions
- src/utils/bind-custom-events.js uses events to bind changes between jquery land and canjs land. same for the proxy-guide-changes.js file in that folder. 
- src/utils/tabs-routing.js is also a bridge for routes between jquery/canjs
- blueimp uploader is used - a jquery/php uploader tool - could and should also be refactored out
- CAJA_WS.php is a Web Services file that talks to the AMP stack/PHP back end
- src/mapper/ is a mini app that wraps [jointjs](https://www.jointjs.com/) diagraming library in canjs components
- the templates tab in Author uses many shared components from [A2J Deps](https://github.com/CCALI/a2jdeps) If you are having a problem in that tab, the fix is likely to be made in code in Deps.