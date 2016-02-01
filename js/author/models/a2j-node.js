import cuid from 'cuid';
import Map from 'can/map/';
import List from 'can/list/';
import _omit from 'lodash/omit';

import 'can/map/define/';

const omitStateAttrs = [
  'guide', 'answers', 'useAnswers', 'ckeditorInstance',
  'nodeIndex', 'activeNode', 'rootNodeScope', 'editActive',
  'editEnabled', 'variablesList'
];

const NodeState = Map.extend({
  define: {
    editActive: {
      value: false
    }
  }
});

/**
 * @module {Module} author/models/a2j-node A2JNode
 * @parent api-models
 *
 * The A2J Node Map represents an [A2J] node. From its root node
 * out to its branches and leaves, every A2J node is an A2JNode.
 * An A2JNode is a branch if it has child A2JNodes of its own,
 * otherwise it's a leaf.
 */
export default Map.extend({
  define: {
    /**
     * @property {String} A2JNode.prototype.define.id id
     *
     * Node's id
     */
    id: {
      value() {
        return cuid();
      }
    },

    /**
     * @property {String} A2JNode.prototype.define.tag tag
     *
     * A component tag name for an A2J component.
     */
    tag: {
      value: ''
    },

    /**
     * @property {can.Map} A2JNode.prototype.define.state state
     *
     * A node's state is a map of view model properties passed to
     * its component.
     */
    state: {
      Type: NodeState,
      Value: NodeState,
      serialize(current) {
        let serialized = current.serialize();
        return _omit(serialized, ...omitStateAttrs);
      }
    },

    /**
     * @property {can.List} A2JNode.prototype.define.children children
     *
     * If a node has other nodes beneath it then its a branch.
     */
    children: {
      Value: List
    }
  }
});
