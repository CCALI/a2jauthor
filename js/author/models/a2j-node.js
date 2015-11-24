import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';

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
     * @property {String} A2JNode.prototype.define.component component
     *
     * A component tag name for an A2J component.
     */
    component: {
      value: ''
    },

    /**
     * @property {can.Map} A2JNode.prototype.define.state state
     *
     * A node's state is a map of view model properties passed to
     * its component.
     */
    state: {
      Value: Map
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
