import $ from 'jquery'
import CanMap from 'can-map'
import A2JTemplate from 'caja/author/models/a2j-template'
import sort from 'caja/author/utils/sort'

import 'can-map-define'

/**
 * @property {can.Map} templatesPage.ViewModel
 * @parent templatesPage
 *
 * `<templates-page>`'s viewModel.
 */
export default CanMap.extend({
  define: {
    /**
     * @property {CanList?} templatesPage.ViewModel.prototype.define.appState appState
     * @parent templatesPage.ViewModel
     *
     * The application state
     */
    appState: {},

    /**
     * @property {Promise} templatesPage.ViewModel.prototype.define.templatesPromise templatesPromise
     * @parent templatesPage.ViewModel
     *
     * Promise that resolves to the current list of templates
     */
    templatesPromise: {
      get () {
        let appState = this.attr('appState')
        let guideId = appState.attr('guideId')

        return A2JTemplate.findAll({guideId})
      }
    },

    /**
     * @property {Promise} templatesPage.ViewModel.prototype.define.templates templates
     * @parent templatesPage.ViewModel
     *
     * list of current templates
     */
    templates: {
      get (lastSet, resolve) {
        if (lastSet) {
          return lastSet
        }

        this.attr('templatesPromise').then(resolve)
      }
    },

    /**
     * @property {Promise} templatesPage.ViewModel.prototype.define.displayList displayList
     * @parent templatesPage.ViewModel
     *
     * displayList of templates based on filtering
     */
    displayList: {
      get () {
        const templates = this.attr('templates')

        if (templates) {
          return this.performSearch(
            this.sortList(
              this.filterList(templates)
            )
          )
        }
      }
    },

    /**
     * @property {CanList?} templatesPage.ViewModel.prototype.define.deletedTemplates deletedTemplates
     * @parent templatesPage.ViewModel
     *
     * templates that were deleted
     */
    deletedTemplates: {},

    /**
     * @property {CanList?} templatesPage.ViewModel.prototype.define.restoredTemplates restoredTemplates
     * @parent templatesPage.ViewModel
     *
     * templates that were deleted and then restored
     */
    restoredTemplates: {},

    /**
     * @property {String} templatesPage.ViewModel.prototype.define.activeFilter activeFilter
     * @parent templatesPage.ViewModel
     *
     * It holds the value of the state by which the templates list is being
     * filtered, the possible values are `all`, `active` and `deleted`.
     */
    activeFilter: {
      value: 'active'
    },

    /**
     * @property {{}} templatesPage.ViewModel.prototype.define.sortCriteria sortCriteria
     * @parent templatesPage.ViewModel
     *
     * It holds the key and the direction by which the templates list is sorted,
     * by default the list is sorted by `buildOrder` asc.
     */
    sortCriteria: {
      value: {
        key: 'buildOrder',
        direction: 'asc'
      }
    },

    /**
     * @property {String} templatesPage.ViewModel.prototype.define.searchToken searchToken
     * @parent templatesPage.ViewModel
     *
     * It holds the search string typed by the user in the search form.
     */
    searchToken: {
      type: 'string',
      value: ''
    },

    /**
     * @property {Boolen} templatesPage.ViewModel.prototype.define.openDeletedAlert openDeletedAlert
     * @parent templatesPage.ViewModel
     *
     * Each time a template is deleted, a small alert should be displayed to
     * indicate the user that the template is actually being deleted and it
     * also allows the user to restore it back, this property controls whether
     * the alert is visible or not.
     */
    openDeletedAlert: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.openRestoredAlert openRestoredAlert
     * @parent templatesPage.ViewModel
     *
     * Same as `openDeletedAlert` but this one controls the alert shown for
     * templates that are being restored.
     */
    openRestoredAlert: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Number} templatesPage.ViewModel.prototype.define.alertAutoCloseTime alertAutoCloseTime
     * @parent templatesPage.ViewModel
     *
     * The number of miliseconds after which the alert messages when user deletes/restores
     * templates are visible before they hide themselves.
     */
    alertAutoCloseTime: {
      type: 'number',
      value: 5000
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.listIsDraggable listIsDraggable
     * @parent templatesPage.ViewModel
     *
     * Whether the templates list can be sorted using drag & drop. Since drag & drop
     * only makes sense to define the `buildOrder`, the items can't be dragged if the
     * templates are sorted by any other criteria.
     */
    listIsDraggable: {
      get () {
        return this.attr('sortCriteria.key') === 'buildOrder' && this.attr('activeFilter') === 'active'
      }
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.noSearchResults noSearchResults
     * @parent templatesPage.ViewModel
     *
     * Whether the search performed by the user has no matches, this property
     * checks if there is a truthy `searchToken` which means user has performed
     * a search and `displayList`'s length is falsy which indicates there are no
     * matches for that `searchToken`.
     */
    noSearchResults: {
      get () {
        let templates = this.attr('templates')
        let searchToken = this.attr('searchToken')
        let displayList = this.attr('displayList')
        return searchToken.length &&
          templates.attr('length') && !displayList.attr('length')
      }
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.noTemplatesMatchFilter noTemplatesMatchFilter
     * @parent templatesPage.ViewModel
     *
     * Whether the filter selected by the user has no matches, this property
     * checks if the source list (`templates`) has items, if there is no
     * `searchToken` and finally if the `displayList` is empty which means, that
     * there are no matches for `activeFilter`.
     */
    noTemplatesMatchFilter: {
      get () {
        let templates = this.attr('templates')
        let searchToken = this.attr('searchToken')
        let displayList = this.attr('displayList')
        return !searchToken.length &&
          templates.attr('length') && !displayList.attr('length')
      }
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.showTemplatesList showTemplatesList
     * @parent templatesPage.ViewModel
     *
     * Whether there are templates to be shown using the `templates-list`
     * component, this is the case when both the source list (`templates`) and
     * the filtered list (`displayList`) have items.
     */
    showTemplatesList: {
      get () {
        let templates = this.attr('templates')
        let displayList = this.attr('displayList')
        return templates.attr('length') && displayList.attr('length')
      }
    },

    hasSorted: {}
  },

  sortList (templates) {
    let criteria = this.attr('sortCriteria')
    let {key, direction} = criteria.attr()
    templates.sortBy(key, direction)
    return templates
  },

  filterList (templates) {
    let filtered
    let filter = this.attr('activeFilter')

    switch (filter) {
      case 'all':
        filtered = templates.slice()
        break

      case 'active':
        filtered = templates.filter(template => template.attr('active'))
        break

      case 'deleted':
        filtered = templates.filter(template => !template.attr('active'))
        break
    }

    return filtered
  },

  performSearch (templates) {
    let searchToken = this.attr('searchToken')
    return searchToken ? templates.search(searchToken) : templates
  },

  restoreTemplate (template) {
    template.attr({
      deleted: false,
      active: true
    }).save()
    this.attr('openDeletedAlert', false)
  },

  deleteTemplate (template) {
    template.attr({
      restored: false,
      active: false
    }).save()
    this.attr('openRestoredAlert', false)
  },

  /**
   * @function templatesPage.ViewModel.prototype.handleDeletedTemplates handleDeletedTemplates
   * @parent templatesPage.ViewModel
   *
   * This function is executed when the list of templates changes, it observes the
   * templates set as `deleted` in order to show/hide the alert messages.
   */
  handleDeletedTemplates () {
    let templates = this.attr('templates')
    let alreadyDeleted = this.attr('deletedTemplates')
    let beingDeleted = templates.filter(template => template.attr('deleted'))

    // remove the deleted flag from the previously deleted templates, otherwise
    // they will continue to show up in the alert component when other templates
    // are deleted later on.
    if (alreadyDeleted && alreadyDeleted.attr('length')) {
      alreadyDeleted.forEach(template => template.removeAttr('deleted'))
    }

    if (beingDeleted.attr('length')) {
      this.attr('deletedTemplates', beingDeleted)
      this.attr('openDeletedAlert', true)
    }
  },

  /**
   * @function templatesPage.ViewModel.prototype.handleRestoredTemplates handleRestoredTemplates
   * @parent templatesPage.ViewModel
   *
   * Same as `handleDeletedTemplates` but for templates being restored.
   */
  handleRestoredTemplates () {
    let templates = this.attr('templates')
    let alreadyRestored = this.attr('restoredTemplates')
    let beingRestored = templates.filter(template => template.attr('restored'))

    if (alreadyRestored && alreadyRestored.attr('length')) {
      alreadyRestored.forEach(template => template.removeAttr('restored'))
    }

    if (beingRestored.attr('length')) {
      this.attr('restoredTemplates', beingRestored)
      this.attr('openRestoredAlert', true)
    }
  },

  /**
   * @function templatesPage.ViewModel.prototype.updateTemplatesOrder updateTemplatesOrder
   * @parent templatesPage.ViewModel
   *
   * Updates the order of the templates list after dragging in the current displayList
   *
   * @return {Array} The new array of ordered templateIds
   */
  updateTemplatesOrder () {
    let templates = this.attr('templates')
    let currentDisplayList = this.attr('displayList')

    // TODO: build es6 map of template to it's index to remove performance hit of indexOf

    let outTemplates = sort(templates, (a, b) => {
      if (!a.attr('active')) return -1
      if (!b.attr('active')) return 1
      return currentDisplayList.indexOf(a) - currentDisplayList.indexOf(b)
    })

    const templateIds = outTemplates.serialize().map(t => t.templateId)
    return templateIds
  },

  /**
   * @function templatesPage.ViewModel.prototype.saveTemplatesOrder saveTemplatesOrder
   * @parent templatesPage.ViewModel
   *
   * Saves the provided list of templateIds to the templates.json index file
   *
   */
  saveTemplatesOrder (templateIds) {
    const guideId = this.attr('appState.guideId')
    // const templateIds = this.attr('templates').serialize().map(t => t.templateId);
    if (templateIds) {
      return $.ajax({
        url: `/api/templates/${guideId}`,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ templateIds: templateIds }),
        error: function (err, xhr) {
          console.error(err, xhr.responseText)
        }
      })
    }
  }
})
