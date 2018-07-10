import CanMap from "can-map";
import Component from "can-component";
import template from "./assignment-form.stache";

/*
  Assignment = {
    deleteVariable: Maybe String,
    createVariable: {
      name: String,
      type: String,
      comment: String,
      repeating: Boolean
    },
    variableOptions: {
      overflowStyle: Maybe String,
      addendumLabel: Maybe String,
      checkIcon: Maybe String
    },
    boxOptions: Array {
      variable: String,
      variableValue: String
    }
  }
*/

function getBufferVariable(buffer) {
  const { name, type, repeating, comment } = buffer;
  if (name && type) {
    return { name, type, repeating, comment };
  }
}

function fillArray(size, value) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(value);
  }
  return array;
}

function getBufferOptions(buffer, boxCount) {
  const {
    name,
    type,
    overflowStyle,
    addendumLabel,
    checkIcon,
    isGroup,
    isCheck,
    isInverted,
    choices
  } = buffer;

  const variableOptions = {
    overflowStyle,
    addendumLabel,
    checkIcon,
    isGroup,
    isCheck
  };

  const hasChoice = type === "MC";
  const boxes = fillArray(boxCount, 0);
  const boxOptions = boxes.map((_, index) => ({
    variable: name,
    variableValue: hasChoice ? choices[index] : null,
    isInverted
  }));

  return { variableOptions, boxOptions };
}

function makeVariableBuffer(variable, options, boxes) {
  const { name, type, repeating, comment } = variable;
  const { overflowStyle, addendumLabel, checkIcon, isGroup, isCheck } = options;
  return {
    name,
    type,
    repeating,
    comment,
    overflowStyle,
    addendumLabel,
    checkIcon,
    isGroup,
    isCheck,
    isInverted: boxes.reduce((i, box) => i || box.isInverted, false),
    choices: boxes.map(box => box.variableValue)
  };
}

function makeDefaultVariableBuffer() {
  return {
    name: "",
    type: "Text",
    repeating: false,
    comment: "",
    overflowStyle: "overflow-to-addendum",
    checkIcon: "normal-check",
    isGroup: false,
    isCheck: false,
    isInverted: false,
    choices: []
  };
}

function uniq(list) {
  return list.reduce(
    (list, item) => (list.indexOf(item) === -1 ? [...list, item] : list),
    []
  );
}

export const AssignmentFormVm = CanMap.extend('AssignmentFormVm', {
  define: {
    onAssign: {
      type: 'function',
    },

    onUnassign: {
      type: 'function'
    },

    onCancel: {
      type: 'function'
    },

    variableDict: {
      value: () => ({})
    },

    variableOptionsDict: {
      value: () => ({})
    },

    selectedBoxes: {
      value: () => []
    },

    selectedVariable: {
      value: () => ''
    },

    initialVariable: {
      get() {
        const variableName = this.attr("selectedVariable");
        if (!variableName) {
          return;
        }

        const variableKey = variableName.toLowerCase();
        return this.attr(`variableDict.${variableKey}`);
      }
    },

    variableBuffer: {
      value: makeDefaultVariableBuffer
    },

    // computed props
    variableSuggestions: {
      get() {
        const dict = this.attr("variableDict");
        if (!dict) {
          return [];
        }

        const names = [];
        dict.each(variable => {
          names.push(variable.name);
        });
        return names;
      }
    },

    hasOptions: {
      type: 'boolean',
      get() {
        return (
          this.attr("hasOverflowOption") ||
          this.attr("hasCheckmarkOption") ||
          this.attr("hasPassValueOption") ||
          this.attr("hasChoicesOption")
        );
      }
    },

    hasOverflowOption: {
      type: 'boolean',
      get() {
        const type = this.attr("variableBuffer.type");
        return type === "Text";
      }
    },

    hasCheckmarkOption: {
      type: 'boolean',
      get() {
        const type = this.attr("variableBuffer.type");
        const isCheck = this.attr('variableBuffer.isCheck');
        return (isCheck && type === "MC") || type === "TF";
      }
    },

    hasInvertOption: {
      type: 'boolean',
      get() {
        const type = this.attr("variableBuffer.type");
        return type === "TF";
      }
    },

    hasPassValueOption: {
      type: 'boolean',
      get() {
        const type = this.attr("variableBuffer.type");
        return type === "MC";
      }
    },

    hasChoicesOption: {
      type: 'boolean',
      get() {
        const type = this.attr("variableBuffer.type");
        const isMultipleChoice = type === "MC";
        const isCheck = this.attr('variableBuffer.isCheck');
        return isMultipleChoice && isCheck;
      }
    }
  },

  didInsertElement () {
    this.updateBufferWithBoxes();
  },

  updateBufferWithVariable () {
    const variableName = this.attr('selectedVariable');
    const variableKey = variableName.toLowerCase();
    const variable = this.attr(`variableDict.${variableKey}`);
    if (variable) {
      const options = this.attr(`variableOptionsDict.${variableKey}`);
      const boxes = this.attr("selectedBoxes");
      const toJs = x => (x && x.serialize ? x.serialize() : x);
      this.attr(
        "variableBuffer",
        makeVariableBuffer(
          toJs(variable),
          toJs(options || new CanMap()),
          toJs(boxes || [])
        )
      );
    }
  },

  updateBufferWithBoxes () {
    const selectedBoxes = this.attr('selectedBoxes');
    const variableNames = uniq(
      selectedBoxes
        .serialize()
        .map(b => b.variable)
        .filter(name => !!name)
    );

    const isConflicting = variableNames.length > 1;
    if (isConflicting) {
      this.attr("conflictingVariables", variableNames);
    } else {
      this.removeAttr("conflictingVariables");
    }

    if (variableNames.length === 1) {
      const [variableName] = variableNames;
      this.attr("selectedVariable", variableName);
      this.updateBufferWithVariable();
    }

    const buffer = this.attr("variableBuffer");
    buffer.attr(
      "choices",
      selectedBoxes.map(box => box.variableValue || "")
    );

    const groupNames = uniq(
      selectedBoxes.serialize().map(b => b.groupId)
    );
    const isGroup = groupNames.length === 1 && !!groupNames[0];
    buffer.attr('isGroup', isGroup);

  },

  onOverflowStyleChange(event) {
    const { value: style } = event.target;
    this.attr("variableBuffer.overflowStyle", style);
  },

  onGroupChange (event) {
    const isChecked = event.target.checked;
    this.attr('variableBuffer.isGroup', isChecked);
  },

  onVariableChange(variable) {
    this.attr("variableBuffer").attr(variable);
  },

  onSelectSuggestion(variableName) {
    this.attr("selectedVariable", variableName);
    this.updateBufferWithVariable();
  },

  onCheckIcon(checkIcon) {
    this.attr("variableBuffer.checkIcon", checkIcon);
  },

  onPassValueChange (event) {
    const {value: passValue} = event.target;
    const isCheck = passValue === 'pass-check';
    this.attr('variableBuffer.isCheck', isCheck);
  },

  onInvertChange(event) {
    const isInverted = event.target.checked;
    this.attr('variableBuffer.isInverted', isInverted);
  },

  onChoiceChange(event, index) {
    const { value } = event.target;
    this.attr("variableBuffer.choices").attr(index, value);
  },

  fireCancel() {
    const handler = this.attr("onCancel");
    if (handler) {
      handler();
    }
  },

  fireUnassign() {
    const handler = this.attr("onUnassign");
    if (handler) {
      handler();
    }
  },

  fireAssign() {
    const handler = this.attr("onAssign");
    if (handler) {
      const buffer = this.attr("variableBuffer").serialize();
      const variable = getBufferVariable(buffer);
      if (!variable) {
        return;
      }

      const { variableOptions, boxOptions } = getBufferOptions(
        buffer,
        this.selectedBoxes.length || 0
      );

      handler({
        deleteVariable: this.attr("selectedVariable.name"),
        createVariable: variable,
        variableOptions,
        boxOptions
      });
    }
  }
});

export default Component.extend({
  tag: "assignment-form",
  view: template,
  leakScope: false,
  ViewModel: AssignmentFormVm,
  events: {
    inserted () {
      this.viewModel.didInsertElement();
    }
  }
});
