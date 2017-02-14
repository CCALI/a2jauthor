
/*
  A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
  All Contents Copyright The Center for Computer-Assisted Legal Instruction

  Mapper
  04/2012

  Current - Uses a simple DOM based map with DIVs for text and lines.
  Future feature - replace with CANVAS/SVG flowcharter.

*/

var gMapperScale = 1.0;
var gMapSize = 1; // 0 is small, 1 is normal

var GRID_MAP = {x: 10, y: 10};
var NODE_SIZE = {w: 150, h: 100};

// Create lines. This is called after generating the map or after a page is moved.
function mapLines() {
  var NW = NODE_SIZE.w;
  var NH = NODE_SIZE.h;

  /** @type TPage */
  var page;
  var $map = $('.map');
  var guidePages = gGuide.pages || {};

  function lineV(left, top, height) {
    return '<div class="line Step' + page.step +
      '" style="left:' + left + 'px; top:' + top + 'px; width:2px; height:' +
      height + 'px;"></div>';
  }

  function lineH(left, top, width) {
    return '<div class="line Step' + page.step +
      '" style="left:' + left + 'px; top:' + top + 'px; width:' + width +
      'px; height:2px;"></div>';
  }

  $map.find('.branch, .line').remove();

  Object.keys(guidePages).forEach(function(pageName) {
    page = guidePages[pageName];

    if (page.mapx != null) {
      
      var nodeLeft = page.mapx;
      var nodeTop = page.mapy;

      // Outgoing branches to show:
      //  A2J - Buttons with Destination, Script GOTOs
      //  CA - Next page, Feedback branches, Script GOTOs
      var pageButtons = page.buttons || [];

      page.mapBranches = pageButtons.map(function(button) {
        return {
          text: button.label,
          dest: guidePages[button.next]
        };
      });

      var nBranches = page.mapBranches.length;
      var boffset = NW / nBranches / 2;

      page.mapBranches.forEach(function(branch, index) {
        var branchX = nodeLeft + index / nBranches * NW + boffset;
        var branchTop = nodeTop + NH;

        if (typeof branch.dest !== 'undefined') {
          var dy = (nBranches - parseInt(index, 10)) * 4;
          var destX = branch.dest.mapx + NW / 2;
          var destTop = branch.dest.mapy;
          var x1 = branchX;
          var y1 = branchTop;
          var x2 = x1;
          var y2 = y1 + 10  + dy;
          var x3;
          var y3;
          var x4;
          var y4;

          if (destTop > nodeTop + NH + 16) {
            x3 = destX;
            y3 = y2;
            x4 = x3;
            y4 = destTop - 10;

            if (destX < x1) {
              x2 = destX;
              x3 = x1;
            } else {
              x2 = x1;
              x3 = destX;
            }

            $map.append(
              lineV(x1, y1, y2 - y1) +
              lineH(x2, y2, x3 - x2) +
              lineV(x4, y3, y4 - y3)
            );

          } else {
            x3 = (x2 + destX) / 2;
            y3 = y2;
            x4 = x3;
            y4 = destTop - 15 ;
            var x5 = destX;

            $map.append(
              lineV(x1, y1, y2 - y1) +
              ((x2 < x3) ?
                lineH(x2, y2, x3 - x2) :
                lineH(x3, y2, x2 - x3)) + lineV(x4, y4, y3 - y4) +
              ((x4 < x5) ?
                lineH(x4, y4, x5 - x4) :
                lineH(x5, y4, x4 - x5))
            );
          }
        }
      });
    }
  });
}

function showPageOnMap() {}

// Construct mapper flowcharts.
function buildMap() {
  
  var page;
  var $map = $('.map');
  var guidePages = gGuide.pages || {};

  $map.empty();

  // Snap to grid
  // NOTE: This is causing the map to shift on every load.
  // Causing part of the issue described in issue #936
  // Object.keys(guidePages).forEach(function(pageName) {
  //   page = guidePages[pageName];

  //   if (page.mapx != null) {
  //     page.mapx = Math.round(1 + page.mapx / GRID_MAP.x) * GRID_MAP.x;
  //     page.mapy = Math.round(1 + page.mapy / GRID_MAP.y) * GRID_MAP.y;
  //   }
  // });

  // Full size boxes with question names and simple lines connecting boxes.
  Object.keys(guidePages).forEach(function(pageName) {
    page = guidePages[pageName];

    if (page.mapx != null) {
      var nodeLeft = page.mapx;
      var nodeTop = page.mapy;
      var stepc = page.step; //stepcolor

      var nodeStyle = 'z-index: 1; left:' + nodeLeft + 'px; top:' + nodeTop + 'px;';

      $map.append(
        '<div class="node bg-step' + (stepc) + '" pagename="' + page.name.asHTML() + '" style="' + nodeStyle + '">' +
          (page.type === CONST.ptPopup ? '' : '<div class="mapper icon arrow"></div>') +
          (page.name == gGuide.firstPage ? '<div class="mapper icon start">Start</div>' : '') +
          (page.name == gGuide.exitPage ? '<div class="mapper icon exit">Exit</div>' : '') +
          '<div class="text">' + page.name + '</div>' +
          '<div class="taglist">' + page.tagList() + '</div>' +
        '</div>'
      );
    }
  });

  $map.find('.node').dblclick(function() {
    var target = $(this).attr('pagename');
    gotoPageEdit(target);
  });

  mapLines();

  $map.traggable({
    grid: [GRID_MAP.x, GRID_MAP.y],

    start: function() {},

    /*** @param {{node,position}} ui */
    stop: function(event, ui) {
      // After moving a page map node, redraw lines.
      var node = ui.node;
      var page = gGuide.pages[$(node).attr('pagename')];
      page.mapx = ui.position.left;
      page.mapy = ui.position.top;
      mapLines();
    }
  });
}

// JPM if showing/hiding page list, do that and zoom to fit
function mapZoomSlide() {

  if ($('#tabsMap .col-4').hasClass('isHidden')) {
    $('#tabsMap .col-4').removeClass('isHidden');
    $('#tabsMap .col-4').animate({width: '30%'}, function(element) {});
    $('#tabsMap .col-8').css('width', '70%');
    $('.tabsMapPages').css('display', 'block');
    $('#MapperToolbar button')
      .first()
      .button({
        disabled: false,
        label: '<span class="glyphicon-left-thin"></span> Hide Page List'
      });
  } else {
    $('#tabsMap .col-4').addClass('isHidden');
    $('#tabsMap .col-4').animate({width: '0%'}, function(element) {});
    $('#tabsMap .col-8').css('width', '100%');
    $('.tabsMapPages').css('display', 'none');
    $('#MapperToolbar button')
      .first()
      .button({
        disabled: false,
        label: '<span class="glyphicon-right-thin"></span> Show Page List'
      });
  }
}

// Zoom in or out or fit.
function mapZoomClick() {
  var zoom = $(this).attr('zoom');
  var $mapperPanel = $('#MapperPanel');

  // make sure the #MapperPanel has height, otherwise the Fit button
  // won't work propertly https://github.com/bitovi/CAJA/issues/25.
  var $mapperPanelParent = $mapperPanel.parents('.col-8').first();
  $mapperPanel.height($mapperPanelParent.height() - 34);

  if (zoom === 'fit') {
    // TODO must be an easy function to get map's true width,height (children bounds).
    var minx;
    var miny;
    var maxx;
    var maxy;
    var p;
    var guidePages = gGuide.pages || {};

    minx = miny = 999;
    maxx = maxy = 0;

    Object.keys(guidePages).forEach(function(pageName) {
      // Get bounds of all pages
      var page = gGuide.pages[pageName];

      if (page.mapx !== null) {
        minx = Math.min(minx, page.mapx);
        miny = Math.min(miny, page.mapy);
        maxx = Math.max(maxx, page.mapx + 500);
        maxy = Math.max(maxy, page.mapy + 500);
      }
    });

    kMINY = 200; // let no node be less than 200 (so our Start icon is visible)

    // If left or top is less than 0, push all down/right since our scrollbars don't go negative.
    if (minx < 0 || miny < kMINY) {
      // Keeps questions from disappearing too.
      p = null;
      miny -= kMINY;

      for (p in gGuide.pages) {
        var page = gGuide.pages[p];

        if (page.mapx !== null) {
          page.mapx -= minx;
          page.mapy -= miny;
        }
      }

      buildMap();
    }

    var scalex = $mapperPanel.width()  / (maxx - minx);
    var scaley = $mapperPanel.height() / (maxy - miny);
    gMapperScale = Math.min(scalex, scaley);// scale to fit

  } else {
    zoom = parseFloat(zoom);
    gMapperScale = gMapperScale * zoom;
  }

  if (gMapperScale >= 0.9) {
    gMapperScale = 1;
  }

  // traggable lets us drag things around.
  $('.map').traggable('changeScale', gMapperScale);
}
