import moment from 'moment';
import Model from 'can/model/';
import A2JNode from './a2j-node';
import comparator from './template-comparator';

import 'can/map/define/';

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
const A2JTemplate = Model.extend({
  id: 'templateId',

  create: '/api/templates',
  update: '/api/templates/{templateId}',
  destroy: '/api/templates/{templateId}',
  findOne: '/api/templates/{templateId}',
  findAll: '/api/guides/{guideId}/templates',

  /**
   * @function A2JTemplate.makeDocumentTree makeDocumentTree
   * @param {can.Map} node
   *
   * Take a rootNode and traverse the tree while making every node an
   * [A2JNode].
   *
   */
  makeDocumentTree: function(node) {
    let branch = new A2JNode(node);
    let children = branch.attr('children');

    if (children.attr('length')) {
      children.forEach((child, index) => {
        branch.attr('children.' + index, this.makeDocumentTree(child));
      });
    }

    return branch;
  },

  makeFindAll: function(findAllData) {
    return function(params, success, error) {

      let dfd = findAllData(params).then((response) => {
        let a2jTemplates = this.models(response);

        a2jTemplates.each((a2jTemplate, index) => {
          // extend template with buildOrder property.
          a2jTemplate.attr('buildOrder', index + 1);

          let documentTree = this.makeDocumentTree(a2jTemplate.attr('rootNode'));
          a2jTemplate.attr('rootNode', documentTree);
        });

        return a2jTemplates;
      });

      return dfd.then(success, error);
    };
  },

  makeFindOne: function(findOneData) {
    return function(params, success, error) {

      let dfd = findOneData(params).then((response) => {
        let a2jTemplate = this.model(response);
        let documentTree = this.makeDocumentTree(a2jTemplate.attr('rootNode'));

        a2jTemplate.attr('rootNode', documentTree);
        return a2jTemplate;
      });

      return dfd.then(success, error);
    };
  }
}, {
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
      value: true
    },

    /**
     * @property {A2JNode} A2JTemplate.prototype.rootNode rootNode
     *
     * The root container for any authoring components.
     */
    rootNode: {
      value: function() {
        return new A2JNode({
          type: 'a2j-template'
        });
      }
    },

    /**
     * @property {moment} A2JTemplate.prototype.updatedAt updatedAt
     *
     * The date of the template's most recent update.
     */
    updatedAt: {
      get(lastVal) {
        return moment(lastVal);
      }
    }
  },

  addNode(node) {
    if (node) {
      const rootNode = this.attr('rootNode');
      const children = rootNode.attr('children');
      children.push(node);
    }
  }
});

A2JTemplate.List = A2JTemplate.List.extend({
  active() {
    return this.filter(template => template.attr('active'));
  },

  deleted() {
    return this.filter(template => !template.attr('active'));
  },

  sortBy(key, direction = 'asc') {
    switch (key) {
      case 'buildOrder':
        this.attr('comparator', comparator.number(key, direction));
        break;

      case 'title':
        this.attr('comparator', comparator.string(key, direction));
        break;

      case 'updatedAt':
        this.attr('comparator', comparator.moment(key, direction));
        break;
    }
  },

  search(token) {
    return this.filter(function(template) {
      token = token.toLowerCase();
      let title = template.attr('title').toLowerCase();
      return title.indexOf(token) !== -1;
    });
  }
});

export default A2JTemplate;
