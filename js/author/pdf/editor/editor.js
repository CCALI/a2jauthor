import $ from "jquery";
import Map from "can/map/";
import Component from "can/component/";
import 'can/map/define/';
import template from "./editor.stache";
import { attemptAutofill } from "../autofill";
import {
  getPdfJs,
  uploadTemplatePdf,
  getFonts,
  getTemplatePdfUrl,
  assemblePdf
} from "../index";
import {
  IdGenerator,
  getArea,
  getBoundaryArea,
  getRelativePoint,
  resizeAreaToPoint,
  fitWithinBoundary,
  containArea,
  nudgeAreaWithinBounds,
  moveAreaWithinBounds
} from './area';
import assemble from "../assemble";
import moment from "moment";

const { boxComparator } = assemble;
const getNewVariableBoxId = IdGenerator("vb-");
const getNewGroupId = IdGenerator("gp-");

const getEventPoint = event => ({
  x: event.clientX,
  y: event.clientY
});

function isAreaTooSmall(area) {
  const minSize = 5;
  return area.width < minSize || area.height < minSize;
}

function getDataUrlForPage(page, scale) {
  const viewport = page.getViewport(scale);
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const context = canvas.getContext("2d");
  return page
    .render({
      canvasContext: context,
      viewport: viewport
    })
    .then(() => {
      return canvas.toDataURL("image/jpeg");
    });
}

function rootNodeProperty(propertyName, defaultValue) {
  return {
    get() {
      const rootNode = this.template.rootNode;
      const value = rootNode.attr(propertyName);
      if (value) {
        return value;
      }
      rootNode.attr(propertyName, defaultValue());
      return rootNode.attr(propertyName);
    },
    set(newValue) {
      const rootNode = this.template.rootNode;
      rootNode.attr(propertyName, newValue);
      return rootNode.attr(propertyName);
    }
  };
}

function setScrollLock(enable) {
  if (enable) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

function setCrosshair(enable) {
  if (enable) {
    document.body.style.cursor = "crosshair";
  } else {
    document.body.style.cursor = "default";
  }
}

export const PdfEditorVm = Map.extend('PdfEditorVm', {
  didInsertElement () {
    if (!this.unbindTemplate) {
      this.unbindTemplate = this.bindTemplate();
    }
    this.loadFonts();
  },

  didDestroyElement () {
    if (this.unbindTemplate) {
      this.unbindTemplate();
      this.unbindTemplate = null;
    }
  },

  define: {
    guideId: {},
    template: {value: null},
    pdfController: {value: null},
    boxes: rootNodeProperty("boxes", () => []),
    documentOptions: rootNodeProperty(
      "documentOptions",
      () =>
        new Map({
          fontName: "Lato",
          fontSize: "12",
          variableOptions: new Map(),
          addendumOptions: new Map()
        })
    ),
    hasPdf: rootNodeProperty("hasPdf", () => false),

    pages: {value: () => []},
    previewBox: {value: null},

    // <Template>
    lastSaveDate: {
      get() {
        const template = this.attr("template");
        const updatedAt = template.attr("updatedAt");
        if (updatedAt) {
          return moment(updatedAt);
        }
        const createdAt = template.attr("createdAt");
        if (createdAt) {
          return moment(createdAt);
        }
      }
    },

    lastSaveDateLongText: {
      get() {
        const date = this.attr("lastSaveDate");
        if (!date) {
          return "Template has not been saved yet.";
        }
        return date.format("LLLL");
      }
    },

    lastSaveDateShortText: {
      get() {
        const date = this.attr("lastSaveDate");
        if (!date) {
          return "Not saved yet";
        }
        const isToday = date.isSame(moment(), "day");
        if (isToday) {
          return `Last saved today at ${date.format("LT")}`;
        }
        return `Last saved ${date.format("LL")}`;
      }
    },

    templatePdfUrl: {
      get() {
        const isViewable = this.attr("hasPdf") && !this.attr("pdfError");
        if (isViewable) {
          const id = this.getComboId();
          return getTemplatePdfUrl(id);
        }
      }
    },
    // </Template>

    // <Conditional logic>
    templateState: {
      get() {
        return this.attr("template.rootNode.state");
      }
    },

    isConditionalLogicEnabled: {
      get() {
        const templateState = this.attr("templateState");

        if (templateState) {
          const value = templateState.attr("hasConditionalLogic");
          return typeof value === "string" ? value === "true" : Boolean(value);
        }

        // default value
        return false;
      },

      set(newVal) {
        const templateState = this.attr("templateState");

        if (templateState) templateState.attr("hasConditionalLogic", newVal);
        return newVal;
      }
    },
    // </Conditional logic>

    // <ThumbnailSidebar>
    thumbnailImageUrls: {
      get() {
        const pages = this.attr("pages");
        if (!pages) {
          return [];
        }
        return pages
          .map(page => page.attr("url"))
          .filter(url => url);
      }
    },
    // </ThumbnailSidebar>

    // <Assignment>
    selectedBoxes: {
      get() {
        return this.attr("boxes")
          .filter(box => box.isSelected)
          .sort(boxComparator);
      }
    }
    // </Assignment>
  },

  // <Template>
  bindTemplate() {
    const startsWith = (str, test) => str.indexOf(test) === 0;
    const handler = (ev, attr) => {
      if (startsWith(attr, "pages")) {
        const newPages = this.attr("pages").map(page => ({
          domSize: page.domSize,
          pdfSize: page.pdfSize
        }));
        this.template.rootNode.attr("pages", newPages);
      }

      const isBoxChange = startsWith(attr, "template.rootNode.boxes");
      const isConditionalLogicChange = startsWith(
        attr,
        "template.rootNode.state"
      );
      const isValidChange = isBoxChange || isConditionalLogicChange;
      if (!isValidChange) {
        return;
      }
      this.scheduleTemplateSave();
    };

    this.bind("change", handler);
    return () => {
      this.unbind('change', handler);
    };
  },

  // isSavingTemplate Boolean
  // saveError Error
  saveTemplate({ title, pdfId, boxes, documentOptions }) {
    const template = this.attr("template");
    const rootNode = template.attr("rootNode");
    if (title) {
      template.attr("title", title);
    }
    if (pdfId) {
      rootNode.attr("pdfId", pdfId);
    }
    if (boxes) {
      rootNode.attr("boxes", boxes);
    }
    if (documentOptions) {
      rootNode.attr("documentOptions", documentOptions);
    }

    this.attr("isSavingTemplate", true);
    return template.save().then(
      () => {
        this.attr("saveError", null);
        this.attr("isSavingTemplate", false);
      },
      error => {
        this.attr("saveError", error);
        this.attr("isSavingTemplate", false);
      }
    );
  },

  saveTemplatePdf() {
    this.saveTemplate({});
  },

  scheduleTemplateSave() {
    const existingTimer = this.attr("isDirtyTimer");
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const waitTime = 3000;
    this.attr(
      "isDirtyTimer",
      setTimeout(() => {
        this.saveTemplatePdf();
        this.removeAttr("isDirtyTimer");
      }, waitTime)
    );
  },

  onTitleChange() {
    this.scheduleTemplateSave();
  },

  onTemplateSave() {
    this.saveTemplatePdf();
  },
  // </Template>

  // <Fonts>
  /*
    fontError: Maybe Error
    isLoadingFonts: Boolean
    supportedFonts: Array String
  */
  loadFonts() {
    this.attr("isLoadingFonts", true);
    return getFonts()
      .then(fonts => {
        this.attr({
          fontError: null,
          supportedFonts: fonts,
          isLoadingFonts: false
        });
      })
      .catch(error => {
        this.attr({
          fontError: error,
          isLoadingFonts: false
        });
      });
  },
  // </Fonts>

  // <Pdf>
  getTemplateId() {
    return `${this.attr("template.templateId")}`;
  },

  getComboId() {
    return `${this.attr("template.guideId")}-${this.attr("template.templateId")}`;
  },

  // pdfController pdfJs.Pdf
  getTemplatePdf(shouldReload) {
    const existingPdf = this.attr("pdfController");
    const isLoaded = !!existingPdf;
    const useExisting = !shouldReload;
    if (isLoaded && useExisting) {
      return Promise.resolve(existingPdf);
    }

    const templatePdfUrl = getTemplatePdfUrl(this.getComboId());
    return getPdfJs()
      .then(pdfJs => pdfJs.getDocument(templatePdfUrl))
      .then(pdf => {
        this.attr({
          pdfController: pdf,
          isPdfLoading: false
        });
        return pdf;
      });
  },

  /*
    type Size = {
      width Number
      height Number
    }

    pages: Array {
      page Number
      domSize Size
      pdfSize Size
      isLoading Boolean
    }
    isPdfLoading: Boolean
    pdfError: Error
  */
  setupPdf() {
    if (!this.attr("hasPdf")) {
      return;
    }

    this.attr("isPdfLoading", true);
    return this.getTemplatePdf()
      .then(pdf => {
        this.attr("isPdfLoading", false);
        const pageCount = pdf.numPages;
        let pagePromises = [];
        for (let i = 0; i < pageCount; i++) {
          const pageNumber = i + 1;
          pagePromises.push(pdf.getPage(pageNumber));
        }

        const initialPages = pagePromises.map((_, index) => ({
          page: index,
          isLoading: true
        }));
        this.attr("pages", initialPages);

        pagePromises = pagePromises.map((promise, index) => {
          const updatePage = fn => {
            const pages = this.attr("pages");
            const newPages = pages.map(
              (page, pageIndex) => (pageIndex === index ? fn(page) : page)
            );
            this.attr("pages", newPages);
          };

          return promise.then(page => {
            const realViewport = page.getViewport(1);
            const pdfSize = {
              width: realViewport.width,
              height: realViewport.height
            };

            const scale = 2.5;
            const viewport = page.getViewport(scale);
            const canvasSize = {
              width: viewport.width,
              height: viewport.height
            };

            const userScale = 2;
            const domSize = {
              width: Math.floor(viewport.width / userScale),
              height: Math.floor(viewport.height / userScale)
            };

            return getDataUrlForPage(page, scale).then(url => {
              updatePage(page => {
                page.attr({
                  url,
                  domSize,
                  pdfSize,
                  canvasSize,
                  canvasScale: scale,
                  isLoading: false
                });
                return page;
              });
            });
          });
        });

        return Promise.all(pagePromises);
      })
      .then(() => {
        setScrollLock(true);
        this.attr({
          pdfError: null,
          isPdfLoading: false
        });
      })
      .catch(error => {
        this.attr({
          pdfError: error,
          isPdfLoading: false
        });
      });
  },

  teardownPdf() {
    const hasPdf = !!this.attr("pdfController");
    if (!hasPdf) {
      return;
    }

    this.removeAttr("pdfController");
    setScrollLock(false);
  },

  constrainBoxes() {
    const boxes = this.attr("boxes");
    const pages = this.attr("pages");
    const newBoxes = [];
    boxes.forEach(box => {
      const page = pages[box.page];
      if (!page) {
        return;
      }
      const bounds = {
        top: 0,
        left: 0,
        width: page.domSize.width,
        height: page.domSize.height
      };
      box.attr("area", fitWithinBoundary(bounds, box.area));
      newBoxes.push(box);
    });
    this.attr("boxes", newBoxes);
  },

  uploadNewPdf() {
    const comboId = this.getComboId();
    const isPdfCorrupted = !!this.attr("pdfError");
    const isWithoutPdf = !this.attr("hasPdf");
    const shouldConfirmImmediately = isPdfCorrupted || isWithoutPdf;
    let uploadTask;
    if (shouldConfirmImmediately) {
      uploadTask = uploadTemplatePdf(comboId, () => true);
    } else {
      uploadTask = uploadTemplatePdf(comboId, newPageCount => {
        const currentPageCount = this.attr("pages").length;
        const hasMorePages = newPageCount > currentPageCount;
        if (hasMorePages) {
          return true;
        }
        return this.promptLesserReplacement({
          currentPageCount,
          newPageCount
        });
      });
    }

    return uploadTask
      .then(() => this.reloadPdf())
      .catch(error => this.attr("pdfError", error));
  },

  reloadPdf() {
    this.teardownPdf();
    this.attr("hasPdf", true);
    this.scheduleTemplateSave();

    return this.setupPdf().then(x => {
      this.constrainBoxes();
      return x;
    });
  },

  promptLesserReplacement({ currentPageCount, newPageCount }) {
    this.attr({
      isReplacing: true,
      currentPageCount,
      newPageCount
    });

    return new Promise(resolve => {
      this.attr("pendingReplacement", choice => {
        this.removeAttr("isReplacing");
        this.removeAttr("newPageCount");
        this.removeAttr("currentPageCount");
        this.removeAttr("pendingReplacement");
        resolve(choice);
      });
    });
  },

  cancelLesserReplacement() {
    this.pendingReplacement(false);
  },

  confirmLesserReplacement() {
    this.pendingReplacement(true);
  },
  // </Pdf>

  addNewBox(area, page) {
    const existingBoxes = this.attr("boxes").serialize();
    const boxId = getNewVariableBoxId(existingBoxes.map(box => box.id));
    const box = {
      id: boxId,
      groupId: '',
      isSelected: true,
      area,
      page
    };
    this.attr("boxes", [...existingBoxes, box]);
  },

  relayOverlayClick() {
    if (this.ignoreNextOverlayClick) {
      this.ignoreNextOverlayClick = false;
      return;
    }
    this.deselectAll();
  },

  // <Auto Boxing>
  relayOverlayDoubleClick(point, pageIndex) {
    this.tryAutofill(point, pageIndex);
  },

  getPageByIndex(index) {
    const pages = this.attr("pages");
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (page.page === index) {
        return page;
      }
    }
  },

  getPageContext(pageIndex) {
    const page = this.getPageByIndex(pageIndex);
    if (!page) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = page.canvasSize.width;
    canvas.height = page.canvasSize.height;

    const context = canvas.getContext("2d");
    const image = new window.Image();
    return new Promise(resolve => {
      image.onload = () => {
        context.drawImage(image, 0, 0);
        resolve(context);
      };
      image.src = page.url;
    });
  },

  tryAutofill(point, pageIndex) {
    const { domSize, canvasSize } = this.getPageByIndex(pageIndex);
    const scaleX = canvasSize.width / domSize.width;
    const scaleY = canvasSize.height / domSize.height;
    const canvasPoint = {
      x: Math.round(point.x * scaleX),
      y: Math.round(point.y * scaleY)
    };

    this.getPageContext(pageIndex).then(context => {
      const canvasArea = attemptAutofill(context, canvasPoint);
      if (!canvasArea) {
        return;
      }

      const area = {
        top: Math.floor(canvasArea.top / scaleY),
        left: Math.floor(canvasArea.left / scaleX),
        width: Math.floor(canvasArea.width / scaleX),
        height: Math.floor(canvasArea.height / scaleY)
      };

      const bounds = this.getPageArea(pageIndex);
      const fitArea = containArea(bounds, point, area);
      if (isAreaTooSmall(fitArea)) {
        return;
      }

      this.addNewBox(fitArea, pageIndex);
    });
  },
  // </Auto Boxing>

  // <Boxing>
  getPagePoint(pageIndex, point) {
    const container = $(`.editor-pdf-page[data-page=${pageIndex}]`).get(0);
    return getRelativePoint(container, point);
  },

  getPageArea(pageIndex) {
    const page = this.getPageByIndex(pageIndex);
    return {
      top: 0,
      left: 0,
      width: page.domSize.width,
      height: page.domSize.height
    };
  },

  getBoxById(id) {
    const boxes = this.attr("boxes");
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (box.id === id) {
        return box;
      }
    }
  },

  onMouseMove(point) {
    this.updatePreviewBox(point);
    this.updateBoxResize(point);
    this.updateBoxMove(point);

    const isInteracting =
      this.isDrawingPreview() || this.isBoxResizing() || this.isBoxMoving();
    return isInteracting;
  },

  onMouseUp(point, isAdditive) {
    this.finishPreviewBox(point, isAdditive);
    this.finishBoxResize(point);
    this.finishBoxMove(point);
  },

  // <Boxing Preview>
  /*
    preview {
      pageIndex Number
      startPoint Point
    }
    previewBox Area
  */
  startPreviewBox(startPoint, pageIndex) {
    this.attr("preview", { startPoint, pageIndex });
    setCrosshair(true);
  },

  isDrawingPreview() {
    return !!this.attr("preview");
  },

  updatePreviewBox(realPoint) {
    if (!this.isDrawingPreview()) {
      return;
    }

    const { startPoint, pageIndex } = this.attr("preview");
    const point = this.getPagePoint(pageIndex, realPoint);
    const bounds = this.getPageArea(pageIndex);
    const fullArea = getArea(startPoint, point);
    const area = containArea(bounds, point, fullArea);
    this.attr("previewBox", area);
  },

  finishPreviewBox(realPoint, isAdditive) {
    if (!this.isDrawingPreview()) {
      return;
    }

    const { startPoint, pageIndex } = this.attr("preview");
    this.removeAttr("preview");
    this.removeAttr("previewBox");
    setCrosshair(false);

    if (!isAdditive) {
      this.deselectAll();
    }

    const endPoint = this.getPagePoint(pageIndex, realPoint);
    const bounds = this.getPageArea(pageIndex);
    const fullArea = getArea(startPoint, endPoint);
    const area = containArea(bounds, endPoint, fullArea);
    if (isAreaTooSmall(area)) {
      return;
    }

    this.addNewBox(area, pageIndex);
    // When the box drag is released, the overlay receives a click
    // event which de-selects this new box. This fix ignores that
    // click so the box stays selected. (TODO: revisit solution)
    this.ignoreNextOverlayClick = true;
  },
  // </Boxing Preview>

  // <Boxing Resizing>
  /*
    resize {
      boxId String
      direction String
    }
  */
  startBoxResize(boxId, direction) {
    this.attr("resize", { boxId, direction });
  },

  isBoxResizing() {
    return !!this.attr("resize");
  },

  updateBoxResize(realPoint) {
    if (!this.isBoxResizing()) {
      return;
    }

    const { boxId, direction } = this.attr("resize");
    const box = this.getBoxById(boxId);
    if (!box) {
      return;
    }

    const { page } = box;
    const latestPoint = this.getPagePoint(page, realPoint);
    const bounds = this.getPageArea(page);
    const fullArea = resizeAreaToPoint(box.area, direction, latestPoint);
    const area = containArea(bounds, latestPoint, fullArea);
    box.attr("area", area);
  },

  finishBoxResize(realPoint) {
    this.updateBoxResize(realPoint);
    this.removeAttr("resize");
  },
  // </Boxing Resizing>

  // <Box Moving>
  /*
    move {
      boxId String
      startPoint Point
    }
  */
  startBoxMove(boxId, startPoint) {
    this.attr("move", { boxId, startPoint });
  },

  isBoxMoving() {
    return !!this.attr("move");
  },

  updateBoxMove(realPoint) {
    if (!this.isBoxMoving()) {
      return;
    }

    const move = this.attr("move");
    const { boxId, startPoint } = move;
    const box = this.getBoxById(boxId);
    if (!box) {
      return;
    }

    const { page } = box;
    const latestPoint = this.getPagePoint(page, realPoint);
    const bounds = this.getPageArea(page);
    const area = moveAreaWithinBounds(
      bounds,
      box.area,
      startPoint,
      latestPoint
    );
    box.attr("area", area);
    move.startPoint = latestPoint;
  },

  finishBoxMove(realPoint) {
    this.updateBoxMove(realPoint);
    this.removeAttr("move");
  },
  // </Box Moving>

  // <Box template helpers>
  isMiniBox(box) {
    const minWidth = 100;
    const width = box.attr('area.width');
    return width && width < minWidth;
  },

  isSmallDimension (size) {
    return size < 30;
  },
  // </Box template helpers>
  // </Boxing>

  relayBoxClick(id, isAdditive) {
    let groupId;
    this.attr("boxes").forEach(box => {
      const isChosen = box.id === id;
      const isSelected = isAdditive ? box.isSelected || isChosen : isChosen;
      box.attr("isSelected", isSelected);
      // command or ctrl click stops auto group select (isAdditive === true)
      if (isChosen && !isAdditive) { groupId = box.groupId; }
    });
    if (groupId) { this.selectGroup(groupId); }
  },

  relayDeleteSelection() {
    const boxes = this.attr("boxes");
    const remainingBoxes = boxes.filter(box => !box.isSelected);
    this.attr("boxes", remainingBoxes);
  },

  relayNudgeSelection(dir) {
    let didNudge = false;
    this.attr("boxes").forEach(box => {
      if (!box.isSelected) {
        return;
      }
      const bounds = this.getPageArea(box.page);
      const newArea = nudgeAreaWithinBounds(bounds, box.area, dir);
      box.attr("area", newArea);
      didNudge = true;
    });

    return didNudge;
  },

  duplicateSelection () {
    const duplicateBoxes = [];
    const existingIds = this.attr('boxes').map(box => box.id);
    const newIds = [];
    this.updateSelections(box => {
      if (box.attr('isSelected')) {
        const bounds = this.getPageArea(box.page);
        const nudgeDelta = 5;
        const area = nudgeAreaWithinBounds(
          bounds,
          nudgeAreaWithinBounds(bounds, box.area, 'right', nudgeDelta),
          'down',
          nudgeDelta
        );
        const id = getNewVariableBoxId([...existingIds, ...newIds]);
        const newBox = $.extend(box.serialize(), {id, area});
        duplicateBoxes.push(newBox);
        newIds.push(id);
      }
      return false;
    });
    const existingBoxes = this.attr('boxes');
    this.attr('boxes', [...existingBoxes, ...duplicateBoxes]);
  },

  updateSelections(fn) {
    this.attr("boxes").forEach(box => {
      box.attr("isSelected", !!fn(box));
    });
  },

  selectGroup(groupId) {
    this.attr("boxes").forEach(box => {
      if(box.attr('groupId') === groupId) {
        box.attr('isSelected', true);
      }
    });
  },

  selectAll() {
    this.updateSelections(() => true);
  },

  deselectAll() {
    this.updateSelections(() => false);
  },

  invertSelection() {
    this.updateSelections(box => !box.isSelected);
  },

  // <Assigment>
  relayBoxRightClick(boxId) {
    // If assigning to a box not yet selected
    //   deselect all boxes but it
    const box = this.getBoxById(boxId);
    if (!box.attr("isSelected")) {
      this.updateSelections(b => b === box);
    }

    this.attr("isAssigning", true);
  },

  endAssignment() {
    this.attr("isAssigning", false);
  },

  onAssignmentCancel() {
    this.endAssignment();
  },

  onAssignmentUnassign() {
    this.attr("selectedBoxes").forEach(box => {
      box.removeAttr("variable");
      box.removeAttr("variableValue");
    });
    this.endAssignment();
  },

  onAssignmentSubmit({
    deleteVariable,
    createVariable,
    variableOptions,
    boxOptions
  }) {
    const vars = this.attr("guide.vars");
    if (deleteVariable) {
      vars.removeAttr(deleteVariable);
    }

    const tVariable = $.extend(new window.TVariable(), createVariable);
    const variableKey = tVariable.name.toLowerCase();
    vars.attr(variableKey, tVariable);

    const variableOptionsDict = this.attr("documentOptions.variableOptions");
    variableOptionsDict.attr(variableKey, variableOptions);

    const existingGroupIds = this.attr('boxes').map(box => box.groupId).filter(groupId => groupId);
    // possibly check for current groupId here and assign to all selected
    const groupId = variableOptions.isGroup ? getNewGroupId(existingGroupIds) : '';

    this.attr("selectedBoxes").forEach((box, index) => {
      box.attr('groupId', groupId);
      box.attr(boxOptions[index]);
    });
    this.endAssignment();
  },
  // </Assigment>

  // <TestAssemble>
  getRealPdfArea(page, area) {
    const { pdfSize, domSize } = this.getPageByIndex(page);
    const scaleX = pdfSize.width / domSize.width;
    const scaleY = pdfSize.height / domSize.height;
    return {
      top: scaleY * area.top,
      left: scaleX * area.left,
      width: scaleX * area.width,
      height: scaleY * area.height
    };
  },

  onTestAssemble() {
    const variables = this.guide.vars.serialize();
    const template = this.template.serialize();
    return assemblePdf({variables, template}).then(pdfUrl => {
      window.open(pdfUrl, '_blank');
    });
  },
  // </TestAssemble>

  // <Thumbnails>
  /*
    isShowingThumbnails Boolean
    thumbnailImageUrls Array String
  */
  onDrawerHandleClick() {
    const isShowingThumbnails = this.attr("isShowingThumbnails");
    this.attr("isShowingThumbnails", !isShowingThumbnails);
  },

  onThumbnailClick(url) {
    const pageIndex = this.attr("thumbnailImageUrls").indexOf(url);
    const page = $(`.editor-pdf-page[data-page=${pageIndex}]`).get(0);
    if (page && page.scrollIntoView) {
      page.scrollIntoView();
    }
  },
  // </Thumbnails>

  // <Addendum>
  showAddendumOptions() {
    this.attr("isAddendumOptionsShowing", true);
  },

  hideAddendumOptions() {
    this.attr("isAddendumOptionsShowing", false);
  },

  getDefaultPageSize() {
    const pages = this.attr("pages");
    if (!pages) {
      return;
    }

    const lastPage = pages[pages.length - 1];
    if (!lastPage) {
      return;
    }

    return {
      width: lastPage.attr("pdfSize.width"),
      height: lastPage.attr("pdfSize.height")
    };
  },

  saveAddendumOptions(options) {
    this.attr("documentOptions").attr("addendumOptions", options);
    this.hideAddendumOptions();
    this.scheduleTemplateSave();
  },
  // </Addendum>

  // <Shortcuts>
  toggleShortcutMenu() {
    const isShortcutMenuShowing = this.attr('isShortcutMenuShowing');
    this.attr('isShortcutMenuShowing', !isShortcutMenuShowing);
  }
  // </Shortcuts>
});

const deleteKey = 46;
const backspaceKey = 8;
const upKey = 38;
const downKey = 40;
const leftKey = 37;
const rightKey = 39;
const aKey = 65;
const dKey = 68;
const iKey = 73;
const helpKey = 191;

const isAdditive = event =>
  (event.metaKey || event.ctrlKey) && !event.altKey;

function getPageIndex(child) {
  const pageElement = $(child)
    .parents(".editor-pdf-page")
    .get(0);
  if (pageElement) {
    const pageProp = $(pageElement).attr("data-page");
    const pageIndex = parseInt(pageProp, 10);
    if (!isNaN(pageIndex)) {
      return pageIndex;
    }
  }
}

function getPageBounds(child) {
  const pageElement = $(child)
    .parents(".editor-pdf-page")
    .get(0);
  if (!pageElement) {
    return;
  }
  return getBoundaryArea(pageElement);
}

function getPagePoint(child, event) {
  const pageElement = $(child)
    .parents(".editor-pdf-page")
    .get(0);
  if (!pageElement) {
    return;
  }
  const point = getEventPoint(event);
  return getRelativePoint(pageElement, point);
}

// Only handle events fired on the target, not children
function targetAction(handler) {
  return function(target, event) {
    const isTargetEvent = target.is(event.target);
    if (!isTargetEvent) {
      return;
    }
    return handler.apply(this, arguments);
  };
}

export default Component.extend({
  template,
  leakScope: false,
  viewModel: PdfEditorVm,
  tag: "pdf-editor",
  events: {
    inserted() {
      const container = this.element.find(".editor-pdf-view")[0];
      this.viewModel.setupPdf(container);
      this.viewModel.didInsertElement();

      const handleKeyboardEvent = event => {
        const isTopLevel = event.target === document.body;
        if (!isTopLevel) {
          return;
        }
        const modifed = isAdditive(event);
        switch (event.keyCode) {
          case deleteKey:
            event.preventDefault();
            this.viewModel.relayDeleteSelection();
            break;
          case backspaceKey:
            event.preventDefault();
            this.viewModel.relayDeleteSelection();
            break;
          case upKey:
            const didNudgeUp = this.viewModel.relayNudgeSelection("up");
            if (didNudgeUp) {
              event.preventDefault();
            }
            break;
          case downKey:
            const didNudgeDown = this.viewModel.relayNudgeSelection("down");
            if (didNudgeDown) {
              event.preventDefault();
            }
            break;
          case leftKey:
            const didNudgeLeft = this.viewModel.relayNudgeSelection("left");
            if (didNudgeLeft) {
              event.preventDefault();
            }
            break;
          case rightKey:
            const didNudgeRight = this.viewModel.relayNudgeSelection("right");
            if (didNudgeRight) {
              event.preventDefault();
            }
            break;
          case aKey:
            if (modifed) {
              this.viewModel.selectAll();
              event.preventDefault();
            }
            break;
          case dKey:
            if (modifed) {
              this.viewModel.duplicateSelection();
              event.preventDefault();
            }
            break;
          case iKey:
            if (modifed) {
              this.viewModel.invertSelection();
              event.preventDefault();
            }
            break;
          case helpKey:
            if (modifed) {
              this.viewModel.toggleShortcutMenu();
              event.preventDefault();
            }
            break;
        }
      };

      const handleMouseDone = event => {
        this.viewModel.onMouseUp(getEventPoint(event), isAdditive(event));
      };

      const handleMouseMove = event => {
        const isInteracting = this.viewModel.onMouseMove(getEventPoint(event));
        if (isInteracting) {
          // This removes weird dragging ghosts and glitches
          event.preventDefault();
        }
      };

      $(document.body)
        .on("keydown", handleKeyboardEvent)
        .on("mouseup", handleMouseDone)
        .on("mousemove", handleMouseMove)
        .on("mouseleave", handleMouseDone);
      this.removeGlobalListeners = () => {
        $(document.body)
          .off("keydown", handleKeyboardEvent)
          .off("mouseup", handleMouseDone)
          .off("mousemove", handleMouseMove)
          .off("mouseleave", handleMouseDone);
      };
    },
    removed() {
      this.viewModel.didDestroyElement();
      this.viewModel.teardownPdf();
      this.removeGlobalListeners();
    },
    ".editor-pdf-overlay mousedown": targetAction(function(target, e) {
      const point = getPagePoint(e.target, e);
      const page = getPageIndex(e.target);
      this.viewModel.startPreviewBox(point, page);
    }),
    ".editor-pdf-overlay click": targetAction(function(target, e) {
      const page = getPageIndex(e.target);
      const point = getPagePoint(e.target, e);
      const bounds = getPageBounds(e.target);
      this.viewModel.relayOverlayClick({ page, point, bounds });
    }),
    ".editor-pdf-overlay dblclick": targetAction(function(target, e) {
      const page = getPageIndex(e.target);
      const point = getPagePoint(e.target, e);
      this.viewModel.relayOverlayDoubleClick(point, page);
    }),
    ".box-resize-handle mousedown"(target) {
      const id = target.parent(".variable-box").attr("data-id");
      const dir = target
        .attr("class")
        .split("--")
        .pop();
      this.viewModel.startBoxResize(id, dir);
    },
    ".box-content mousedown"(target, e) {
      const id = target.parent(".variable-box").attr("data-id");
      const point = getPagePoint(e.target, e);
      this.viewModel.startBoxMove(id, point);
    },
    ".box-content click"(target, event) {
      const boxId = target.parent(".variable-box").attr("data-id");
      this.viewModel.relayBoxClick(boxId, isAdditive(event));
    },
    ".box-content contextmenu"(target, e) {
      e.preventDefault();
      const id = target.parent(".variable-box").attr("data-id");
      this.viewModel.relayBoxRightClick(id);
    }
  }
});
