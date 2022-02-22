import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './accordion-checkbox.stache'

// the recursive VM for detail items that can be collapsed/expanded but do not have a value or checkbox
export const AccordionDetailVM = DefineMap.extend('AccordionDetailVM', {
  label: 'string',
  // each details child is an instance of this same detail VM, which are all rendered recursively from the root details array.
  details: {
    type: [{ type: i => new AccordionDetailVM(i) }]
  },

  // aria stuff needs dom to have ids for reference, this just creates a random string prefix for each instance to keep them unique
  // optionally, a value can be provided if it's useful to have a predictable id reference for another part of an app
  idRoot: {
    serialize: false,
    type: 'string',
    default: () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let idRoot = 'accordion-detail-'
      for (let i = 0; i < 16; i++) {
        idRoot += characters.charAt(~~(Math.random() * 62))
      }
      return idRoot
    }
  },

  hasSubDetails: {
    serialize: false,
    get: function () {
      return !!(this.details && this.details.length)
    }
  },

  // are the sub details of this instance visible
  expanded: {
    serialize: false,
    type: 'boolean',
    default: false
  },
  toggleExpanded () {
    this.expanded = !this.expanded
  }
})

// the main recursive VM
export const AccordionCheckboxVM = DefineMap.extend('AccordionCheckboxVM', {
  // only works from the root; removes all checkboxes and related accessibility markup from the render
  checkboxes: {
    type: 'boolean',
    default: true,
    serialize: false
  },
  // the passed in display label for this instance.
  label: 'string',
  // an optional recursive array [{ label, details[] }] that will appear as the first items under this instance without their own checked state.
  details: {
    type: [{ type: i => new AccordionDetailVM(i) }]
  },
  // value can be anything, it's just data to associate with this instance. If this item is checked, you'd get this value back from getCheckedValues()
  value: 'any',
  // The root instance doesn't use the above items, instead root is an array of children.
  // each child is an instance of this same VM, which are all rendered recursively from the root children array.
  children: {
    type: [{ type: i => new AccordionCheckboxVM(i) }]
  },
  get checkedChildrenCount () {
    return (this.children || []).reduce((num, c) => { return num + (c.displayChecked ? 1 : 0) }, 0)
  },
  // aria stuff needs dom to have ids for reference, this just creates a random string prefix for each instance to keep them unique
  // optionally, a value can be provided if it's useful to have a predictable id reference for another part of an app
  idRoot: {
    serialize: false,
    type: 'string',
    default: () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let idRoot = 'accordion-'
      for (let i = 0; i < 16; i++) {
        idRoot += characters.charAt(~~(Math.random() * 62))
      }
      return idRoot
    }
  },

  hasChildren: {
    serialize: false,
    get: function () {
      return !!(this.children && this.children.length)
    }
  },
  hasDetails: {
    serialize: false,
    get: function () {
      return !!(this.details && this.details.length)
    }
  },
  hasChildrenOrDetails: {
    serialize: false,
    get: function () {
      return !!(this.hasDetails || this.hasChildren)
    }
  },

  // is the details and/or children of this instance visible
  expanded: {
    serialize: false,
    type: 'boolean',
    default: false
  },
  toggleExpanded () {
    this.expanded = !this.expanded
  },
  // is this instance explicitly checked
  checked: {
    serialize: true,
    type: 'boolean',
    default: false
  },
  // if this node and all its children recursively are without a value, do not include checkbox or consider checked state
  // ....this is not the right approach for this problem.... hmmmmmmmmmmmm..................
  // valuable: {
  //   serialize: true,
  //   get: function () {
  //     return this.value === undefined ? (this.children || []).some(c => c.valuable) : true
  //   }
  // },
  // recursively determine if any of the children (or their children, recursively) are checked
  anyDecendantChecked: {
    serialize: true,
    get: function () {
      return (this.children || []).some(c => (c.checked || c.anyDecendantChecked))
    }
  },
  // the accordion shows items as checked even when it's not explicitly checked if ANY of their children(recursively) are checked
  displayChecked: {
    serialize: false,
    get: function (x) {
      return this.checked || this.anyDecendantChecked
    }
  },
  // if ALL leaf nodes are checked under a branch, or if this is a leaf and it is explicitly checked, the UI shows it as fully checked
  // Note: this instance does not explicitly need to be checked to still be considered fully checked.
  fullyChecked: {
    serialize: true,
    get: function () {
      return this.hasChildren ? this.children.every(c => c.fullyChecked) : this.checked
    }
  },
  // TODO: the tri-state of soft-checked vs fully checked is not accessible in the stache yet

  // determine what happens when a checkbox is clicked, based on its current state
  checkboxClicked () {
    this.fullyChecked ? this.uncheckAll() : this.checkAll()
  },

  // recursively set the checked state to true at this instance and every node bellow
  checkAll () {
    (this.children || []).forEach(c => c.checkAll())
    this.checked = true
  },

  // recursively set the checked state to false at this instance and every node bellow
  uncheckAll () {
    (this.children || []).forEach(c => c.uncheckAll())
    this.checked = false
  },

  // returns a recurssive array of {value, children[]} objects for any items that display as checked
  // where 'value'is the associated value property that was provided for the specific node initially
  getCheckedValues () {
    return (this.children || []).reduce((acc, c) => {
      if (c.displayChecked) {
        acc.push({
          value: c.value,
          children: c.getCheckedValues()
        })
      }
      return acc
    }, [])
  }
})

export default Component.extend({
  tag: 'accordion-checkbox',
  view: template,
  leakScope: false,
  ViewModel: AccordionCheckboxVM,
  helpers: {
    showCheckboxes () {
      return this.checkboxes
    }
  }
})
