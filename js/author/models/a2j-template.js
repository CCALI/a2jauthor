import Model from 'can/model/';
import A2JNode from './a2j-node';
import moment from 'moment';
import comparator from './template-comparator';
import 'can/map/define/';

/**
 * @module A2JTemplate
 * @parent api-models
 *
 * An A2J Template Model represents the structure of a legal document that
 * can be rendered with variables collected during a guided interview.
 *
 * It is made up of [A2JNode]s which are made up of authoring components.
 *
 * A guided interview can have one or more A2J Templates associated to it.
 */
let A2JTemplate = Model.extend({
  id: 'template_id',

  findAll: '/api/guides/{guide_id}/templates',
  findOne: '/api/templates/{template_id}',

  /**
   * @function makeDocumentTree
   *
   * Take a rootNode and traverse the tree while making every node an
   * [A2JNode].
   *
   * @param {can.Map} node
   */
  makeDocumentTree: function(node) {
    let scope = this;
    let branch = new A2JNode(node);
    if(branch.attr('children.length')) {
      branch.attr('children').forEach(function(child, index) {
        branch.attr('children.' + index, scope.makeDocumentTree(child));
      });
    }

    return branch;
  },

  makeFindAll: function(findAllData) {
    return function(params, success, error) {
      return findAllData(params).then((response) => {
        let a2jTemplates = this.models(response);

        a2jTemplates.map((a2jTemplate) => {
          a2jTemplate.attr('rootNode',
            this.makeDocumentTree(a2jTemplate.attr('rootNode')))
          }
        );

        return a2jTemplates;
      }).
      then(success, error);
    }
  },

  makeFindOne: function(findOneData) {
    return function(params, success, error) {
      return findOneData(params).then((response) => {
        let a2jTemplate = this.model(response);
        let documentTree = this.makeDocumentTree(
          a2jTemplate.attr('rootNode'));

        a2jTemplate.attr('rootNode', documentTree);

        return a2jTemplate;
      })
      .then(success, error);
    };
  }
}, {
  define: {
    /**
     * @property {String} guide_id
     *
     * The guided interview that this template is related to.
     */
    guide_id: {
      value: ''
    },
    /**
     * @property {String} template_id
     *
     * Unique identifier for this template.
     */
    template_id: {
      value: ''
    },
    /**
     * @property {String} title
     *
     * A human readable name for this template.
     */
    title: {
      value: 'Untitled Template'
    },
    /**
     * @property {Boolean} active
     *
     * Whether the template should be rendered.
     */
    active: {
      value: true
    },
    /**
     * @property {A2JNode} rootNode
     *
     * The root container for any authoring components.
     */
    rootNode: {
      value: function() {
        return new A2JNode({
          type: 'a2j-template'
        });
      }
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

  // overriding filter due to a bug in the base implementation
  filter(predicate) {
    let filtered = new this.constructor();

    this.each((item, index) => {
      if (predicate.call(this, item, index, this)) {
        filtered.push(item);
      }
    });

    return filtered;
  },

  sortBy(key, direction = 'asc') {
    switch (key) {
      case 'buildOrder':
        this.attr('comparator', comparator.number(key, direction));
        break;

      case 'title':
        this.attr('comparator', comparator.string(key, direction));
        break;

      case 'lastModified':
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
