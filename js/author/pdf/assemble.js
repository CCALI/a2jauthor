/*
  SYNTAX WARNING
  ===
  This file is written in CommonJS because it is also used on the server for
    the unified test assembly.
  This file is also written in ES5 syntax because Steal cannot parse ES6+
    syntax unless the file utilitizes import/export.
  This file cannnot use import/export because Node (V <= 8) currently does
    not support ESM import/export.
*/

(function () {
  "use strict";
  function areaComparator(areaA, areaB) {
    return areaA.top - areaB.top || areaA.left - areaB.left;
  }

  function boxComparator(a, b) {
    return a.page - b.page || areaComparator(a.area, b.area);
  }

  function getBoxPdfArea(pages) {
    return function _getBoxPdfArea(box) {
      var page = pages[box.page];
      var pdfSize = page.pdfSize;
      var domSize = page.domSize;
      var scaleX = pdfSize.width / domSize.width;
      var scaleY = pdfSize.height / domSize.height;
      var area = box.area;
      return {
        top: scaleY * area.top,
        left: scaleX * area.left,
        width: scaleX * area.width,
        height: scaleY * area.height
      };
    };
  }

  function getTemplateOverlayData(template) {
    var rootNode = template.rootNode;
    var pages = rootNode.pages;
    var boxes = rootNode.boxes;
    var documentOptions = rootNode.documentOptions;
    return {
      pages: pages,
      boxes: boxes,
      documentOptions: documentOptions
    };
  }

  function readInteger(value, defaultValue) {
    if (typeof value !== "number") {
      value = parseInt(value, 10);
    }
    if (isNaN(value)) {
      return defaultValue;
    }
    return value;
  }

  function getDocumentGlobals(pages, documentOptions) {
    var margins = documentOptions.addendumOptions.margins || {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    var lastPageSize = pages[pages.length - 1].pdfSize;
    var pageSize = documentOptions.addendumOptions.pageSize || lastPageSize;
    return {
      addendum: {
        margins: margins,
        pageSize: pageSize,
        labelStyle: {
          fontSize: documentOptions.fontSize - 2,
          fontName: documentOptions.fontName,
          textAlign: "left",
          textColor: "000000"
        }
      }
    };
  }

  function getOverlay(templateData) {
    var boxes = templateData.boxes;
    var pages = templateData.pages;
    var answers = templateData.answers;
    var variables = templateData.variables;
    var customDocumentOptions = templateData.documentOptions;

    var documentOptions = $.extend({ fontName: 'Lato' }, customDocumentOptions, { fontSize: readInteger(customDocumentOptions.fontSize, 12) });
    var documentGlobals = getDocumentGlobals(pages, documentOptions);

    var defaultTextOptions = {
      fontSize: documentOptions.fontSize,
      fontName: documentOptions.fontName,
      textAlign: "left",
      textColor: "000000"
    };

    var variableBoxesMap = boxes.filter(function (box) {
      return !!box.variable;
    }).reduce(function (map, box) {
      var key = box.groupId || box.id;
      map[key] = map[key] || [];
      map[key].push(box);

      return map;
    }, {});

    var getBoxArea = getBoxPdfArea(pages);
    var patches = Object.keys(variableBoxesMap).reduce(function (patches, boxKey) {
      var variableKey = variableBoxesMap[boxKey][0].variable.toLowerCase();
      var variable = variables[variableKey];
      var answer = answers[variableKey];
      var hasVariableToPatch = variable && answer;
      if (!hasVariableToPatch) {
        return patches;
      }

      var boxes = variableBoxesMap[boxKey];
      var answerValue = answer.values[1];
      var defaultVariableOptions = {
        overflowStyle: 'overflow-to-addendum',
        addendumLabel: variable.name,
        checkIcon: 'normal-check',
        isCheck: false
      };
      var customVariableOptions = documentOptions.variableOptions[variableKey] || {};
      var variableOptions = $.extend({}, defaultVariableOptions, customVariableOptions);
      var patcher = getPatcher(variable.type);
      var newPatches = patcher({
        boxes: boxes,
        getBoxArea: getBoxArea,
        answer: answer,
        answerValue: answerValue,
        variable: variable,
        variableOptions: variableOptions,
        documentOptions: documentOptions,
        defaultTextOptions: defaultTextOptions
      });

      return [].concat(patches, newPatches);
    }, []);

    return $.extend({}, documentGlobals, { patches: patches });
  }

  function getTextPatches(options) {
    var boxes = options.boxes;
    var getBoxArea = options.getBoxArea;
    var variable = options.variable;
    var answer = options.answer;
    var answerValue = options.answerValue;
    var variableOptions = options.variableOptions;
    var defaultTextOptions = options.defaultTextOptions;

    var style = variableOptions.overflowStyle;
    var addendumLabel = variableOptions.addendumLabel;

    var isTableColumn = variable.repeating;
    if (isTableColumn) {
      var values = answer.values.slice(1);
      var columnBoxes = boxes.sort(boxComparator).slice(0, values.length);
      var column = columnBoxes.map(function (box, index) {
        return {
          type: "text",
          page: box.page,
          content: values[index],
          area: getBoxArea(box),
          text: defaultTextOptions
        };
      });
      var tablePatch = {
        type: "table-text",
        columns: [column],
        addendumLabel: addendumLabel,
        addendumColumns: []
      };
      return [tablePatch];
    }

    var isSingleLine = boxes.length === 1;
    if (isSingleLine) {
      var box = boxes[0];
      var textPatch = {
        type: "text",
        page: box.page,
        content: answerValue,
        area: getBoxArea(box),
        text: defaultTextOptions
      };
      return [textPatch];
    }

    var multilinePatch = {
      type: "multiline-text",
      content: answerValue,
      overflow: {
        style: style,
        addendumLabel: addendumLabel
      },
      addendumText: defaultTextOptions,
      lines: boxes.sort(boxComparator).map(function (box) {
        return {
          page: box.page,
          area: getBoxArea(box),
          text: defaultTextOptions
        };
      })
    };
    return [multilinePatch];
  }

  function getTrueFalsePatches(options) {
    var boxes = options.boxes;
    var getBoxArea = options.getBoxArea;
    var answerValue = options.answerValue;
    var variableOptions = options.variableOptions;

    return boxes
      .filter(function (box) {
        var shouldInclude = box.isInverted ? !answerValue : answerValue;
        return shouldInclude;
      })
      .map(function (box) {
        return {
          type: "checkmark",
          page: box.page,
          icon: variableOptions.checkIcon,
          area: getBoxArea(box)
        };
      });
  }

  function getMultipleChoicePatches(options) {
    var boxes = options.boxes;
    var getBoxArea = options.getBoxArea;
    var answerValue = options.answerValue;
    var variableOptions = options.variableOptions;
    var defaultTextOptions = options.defaultTextOptions;
    return boxes
      .filter(function (box) {
        var shouldMatch = variableOptions.isCheck;
        if (!shouldMatch) {
          return true;
        }
        var isMatch = box.variableValue === answerValue;
        var shouldInclude = box.isInverted ? !isMatch : isMatch;
        return shouldInclude;
      })
      .map(function (box) {
        if (variableOptions.isCheck) {
          return {
            type: "checkmark",
            page: box.page,
            icon: variableOptions.checkIcon,
            area: getBoxArea(box)
          };
        }

        return {
          type: 'text',
          page: box.page,
          content: answerValue,
          area: getBoxArea(box),
          text: defaultTextOptions
        };
      });
  }

  function getDatePatches(options) {
    var boxes = options.boxes;
    var answer = options.answer;
    var getBoxArea = options.getBoxArea;
    var answerValue = options.answerValue;
    var defaultTextOptions = options.defaultTextOptions;
    var variable = options.variable;
    var variableOptions = options.variableOptions;
    var addendumLabel = variableOptions.addendumLabel;

    var isTableColumn = variable.repeating;
    if (isTableColumn) {
      var values = answer.values.slice(1);
      var columnBoxes = boxes.sort(boxComparator).slice(0, values.length);
      var column = columnBoxes.map(function (box, index) {
        return {
          type: "text",
          page: box.page,
          content: '' + values[index],
          area: getBoxArea(box),
          text: defaultTextOptions
        };
      });
      var tablePatch = {
        type: "table-text",
        columns: [column],
        addendumLabel: addendumLabel,
        addendumColumns: []
      };
      return [tablePatch];
    }

    return boxes.map(function (box) {
      return {
        type: "text",
        page: box.page,
        content: '' + answerValue,
        area: getBoxArea(box),
        text: defaultTextOptions
      };
    });
  }

  function getNumberPatches(options) {
    var boxes = options.boxes;
    var getBoxArea = options.getBoxArea;
    var answer = options.answer;
    var answerValue = options.answerValue;
    var defaultTextOptions = options.defaultTextOptions;
    var variable = options.variable;
    var variableOptions = options.variableOptions;
    var addendumLabel = variableOptions.addendumLabel;

    var isTableColumn = variable.repeating;
    if (isTableColumn) {
      var values = answer.values.slice(1);
      var columnBoxes = boxes.sort(boxComparator).slice(0, values.length);
      var column = columnBoxes.map(function (box, index) {
        return {
          type: "text",
          page: box.page,
          content: '' + values[index],
          area: getBoxArea(box),
          text: defaultTextOptions
        };
      });
      var tablePatch = {
        type: "table-text",
        columns: [column],
        addendumLabel: addendumLabel,
        addendumColumns: []
      };
      return [tablePatch];
    }

    return boxes.map(function (box) {
      return {
        type: "text",
        page: box.page,
        content: '' + answerValue,
        area: getBoxArea(box),
        text: defaultTextOptions
      };
    });
  }

  var patcherTypeMap = {
    text: getTextPatches,
    date: getDatePatches,
    number: getNumberPatches,
    mc: getMultipleChoicePatches,
    tf: getTrueFalsePatches
  };

  function getPatcher(variableType) {
    var type = variableType.toLowerCase();
    return patcherTypeMap[type];
  }

  function getTemplateOverlay(template, variables, answers) {
    return getOverlay($.extend(getTemplateOverlayData(template), {
      variables: variables,
      answers: answers
    }));
  }

  module.exports = {
    areaComparator: areaComparator,
    boxComparator: boxComparator,
    readInteger: readInteger,
    getTemplateOverlay: getTemplateOverlay,
    testing: {
      getPatcher: getPatcher,
      getTextPatches: getTextPatches,
      getDatePatches: getDatePatches,
      getNumberPatches: getNumberPatches,
      getTrueFalsePatches: getTrueFalsePatches,
      getMultipleChoicePatches: getMultipleChoicePatches,

      getBoxPdfArea: getBoxPdfArea,
      getDocumentGlobals: getDocumentGlobals,
      getTemplateOverlayData: getTemplateOverlayData
    }
  };
})();
