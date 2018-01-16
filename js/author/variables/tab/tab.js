import Map from "can/map/";
import Component from "can/component/";
import template from "./tab.stache";

export const VariablesTabVM = Map.extend({
  define: {
    /* variables: List Variable */

    editingVariable: { value: null },
    showVariableModal: { value: false },
    variableList: {
      get() {
        const guide = this.attr("guide");
        if (guide) {
          const vars = guide.attr("vars");
          if (vars) {
            const variables = [];
            vars.each(value => variables.push(value));
            return variables.sort((a, b) =>
              (a.name || "").localeCompare(b.name || "")
            );
          }
        }
        return [];
      }
    }
  },

  openVariableEditor(variableName) {
    const variableList = this.attr("variableList");
    const variable = variableList.filter(
      variable => variable.name === variableName
    )[0];

    this.attr("editingVariable", variable);
    this.attr("showVariableModal", true);
  },

  openVariableCreator() {
    this.attr("editingVariable", null);
    this.attr("showVariableModal", true);
  },

  onVariableChange(variableBuffer) {
    this.attr("variableBuffer", variableBuffer);
  },

  onSelectSuggestion(variableName) {
    const variableList = this.attr("variableList");
    const variable = variableList.filter(
      variable => variable.name === variableName
    )[0];

    this.attr("editingVariable", variable);
  },

  deleteVariable(name) {
    const guide = this.attr("guide");
    guide.vars.removeAttr(name.toLowerCase());
  },

  onDismissVariableEditing({ usedCancelButton }) {
    this.attr("showVariableModal", false);

    // TODO: remove when checkbox delete is implemented
    const isDeleteAction = usedCancelButton;
    if (isDeleteAction) {
      const { name } = this.attr("variableBuffer");
      if (name) {
        this.deleteVariable(name);
      }
    }
  },

  onConfirmVariableEditing() {
    this.attr("showVariableModal", false);
    const guide = this.attr("guide");
    const buffer = this.attr("variableBuffer");
    if (!buffer.name) {
      return;
    }

    const editingVariable = this.attr("editingVariable");
    if (editingVariable) {
      this.deleteVariable(editingVariable.name);
    }

    const variable = new window.TVariable();
    Object.assign(variable, buffer);
    guide.vars.attr(buffer.name.toLowerCase(), variable);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: VariablesTabVM,
  tag: "variables-tab"
});
