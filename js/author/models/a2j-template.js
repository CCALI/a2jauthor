import moment from 'moment'
import Model from 'can-model'
import _omit from 'lodash/omit'
import A2JNode from './a2j-node'
import comparator from './template-comparator'
import sort from '../utils/sort'

import 'can-list'
import 'can-map-define'

/**
 * @module {function} A2JTemplate
 * @parent api-models
 *
 * An A2J Template Model represents the structure of a legal document that
 * can be rendered with variables collected during a guided interview.
 *
 * It is made up of [A2JNode]s which are made up of authoring components.
 *
 * A guided interview can have one or more A2J Templates associated to it.
 */
const A2JTemplate = Model.extend(
  {
    init () {
      const update2 = update1 =>
        function _update (id, template) {
          const comboId = template.guideId + '-' + id
          const isPdf = template.rootNode.tag === 'a2j-pdf'
          if (isPdf) {
            return $.ajax({
              url: `/api/template/${comboId}`,
              method: 'put',
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(template)
            })
          }
          this.update = update1
          const res = update1.apply(this, arguments)
          this.update = _update
          return res
        }
      this.update = update2(this.update)
    },

    id: 'templateId',

    create: '/api/template',
    update: '/api/template/{guideId}-{templateId}',
    destroy: '/api/template/{guideId}-{templateId}',
    findOne: '/api/template/{guideId}-{templateId}',
    findAll: '/api/templates/{guideId}',

    /**
   * @function A2JTemplate.makeDocumentTree makeDocumentTree
   * @param {can.Map} node
   *
   * Take a rootNode and traverse the tree while making every node an
   * [A2JNode].
   *
   */
    makeDocumentTree (node) {
      const branch = new A2JNode(node)
      const children = branch.attr('children')

      children.forEach((child, index) => {
        const isTemplate = !!(
          child.attr('tag') == null || child.attr('rootNode')
        )

        if (isTemplate) {
          const template = new A2JTemplate(_omit(child.attr(), 'rootNode'))
          const docTree = this.makeDocumentTree(child.attr('rootNode'))

          template.attr('rootNode', docTree)
          branch.attr(`children.${index}`, template)
        } else {
          branch.attr(`children.${index}`, this.makeDocumentTree(child))
        }
      })

      return branch
    },

    makeFindAll (findAllData) {
      return function (params, success, error) {
        let dfd = findAllData(params).then(response => {
          let a2jTemplates = this.models(response)

          a2jTemplates.forEach((a2jTemplate, index) => {
            // extend template with buildOrder property.
            a2jTemplate.attr('buildOrder', index + 1)

            let documentTree = this.makeDocumentTree(
              a2jTemplate.attr('rootNode')
            )
            a2jTemplate.attr('rootNode', documentTree)
          })

          return a2jTemplates
        })

        return dfd.then(success, error)
      }
    },

    makeFindOne (findOneData) {
      return function (params, success, error) {
        let dfd = findOneData(params).then(response => {
          let a2jTemplate = this.model(response)
          let documentTree = this.makeDocumentTree(
            a2jTemplate.attr('rootNode')
          )

          a2jTemplate.attr('rootNode', documentTree)
          return a2jTemplate
        })

        return dfd.then(success, error)
      }
    },

    makeFromTreeObject (tree) {
      const template = new A2JTemplate(_omit(tree, 'rootNode'))
      const docTree = this.makeDocumentTree(tree.rootNode)

      template.attr('rootNode', docTree)

      return template
    }
  },
  {
    define: {
      /**
     * @property {String} A2JTemplate.prototype.guideId guideId
     *
     * The guided interview that this template is related to.
     */
      guideId: {
        value: ''
      },

      /**
     * @property {String} A2JTemplate.prototype.templateId templateId
     *
     * Unique identifier for this template.
     */
      templateId: {
        value: ''
      },

      /**
     * @property {String} A2JTemplate.prototype.title title
     *
     * A human readable name for this template.
     */
      title: {
        value: 'Untitled Template'
      },

      /**
     * @property {Boolean} A2JTemplate.prototype.active active
     *
     * Whether the template should be rendered.
     */
      active: {
        type: 'boolean',
        value: true
      },

      /**
     * @property {A2JNode} A2JTemplate.prototype.rootNode rootNode
     *
     * The root container for any authoring components.
     */
      rootNode: {
        value: function () {
          return new A2JNode({
            tag: 'a2j-template'
          })
        }
      },

      /**
     * @property {moment} A2JTemplate.prototype.updatedAt updatedAt
     *
     * The date of the template's most recent update.
     */
      updatedAt: {
        get (lastVal) {
          return moment(lastVal)
        }
      },

      /**
     * @property {String} A2JTemplate.prototype.outline outline
     *
     * Short version of contents from the components inside.
     */
      outline: {
        get () {
          const rootNode = this.attr('rootNode')
          return rootNode.attr('outline')
        }
      },

      /**
     * @property {moment} A2JTemplate.prototype.header header
     *
     * The Custom Header for the template.
     */
      header: {
        value: ''
      },

      /**
     * @property {moment} A2JTemplate.prototype.hideHeaderOnFirstPage hideHeaderOnFirstPage
     *
     * Whether the header should be hidden on the first page of the assembled PDF.
     */
      hideHeaderOnFirstPage: {
        type: 'boolean',
        value: false
      },

      /**
     * @property {moment} A2JTemplate.prototype.footer footer
     *
     * The Custom Footer for the template.
     */
      footer: {
        value: ''
      },

      /**
     * @property {moment} A2JTemplate.prototype.hideFooterOnFirstPage hideFooterOnFirstPage
     *
     * Whether the footer should be hidden on the first page of the assembled PDF.
     */
      hideFooterOnFirstPage: {
        type: 'boolean',
        value: false
      }
    },

    addNode (node) {
      if (node) {
        const rootNode = this.attr('rootNode')
        const children = rootNode.attr('children')
        children.push(node)
      }
    }
  }
)

A2JTemplate.List = A2JTemplate.List.extend({
  active () {
    return this.filter(template => template.attr('active'))
  },

  deleted () {
    return this.filter(template => !template.attr('active'))
  },

  sortBy (key, direction = 'asc') {
    switch (key) {
      case 'buildOrder':
        this.attr('comparator', comparator.number(key, direction))
        break

      case 'title':
        this.attr('comparator', comparator.string(key, direction))
        break

      case 'updatedAt':
        this.attr('comparator', comparator.moment(key, direction))
        break
    }

    sort(this, this.attr('comparator'))
  },

  search (token) {
    return this.filter(function (template) {
      token = token.toLowerCase()
      let title = template.attr('title').toLowerCase()
      return title.indexOf(token) !== -1
    })
  }
})

export default A2JTemplate
