import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';

/**
 * @module AJ2Node
 * @parent api-models
 *
 * The AJ2 Node Map represents an [AJ2Template] node. From its root node
 * out to its branches and leaves, every AJ2Template node is an AJ2Node.
 * An AJ2Node is a branch if it has child AJ2Nodes of its own,
 * otherwise it's a leaf.
 */
export default Map.extend({
  define: {
    /**
     * @property {String} component
     *
     * A component tag name for an AJ2 component.
     */
    component: {
      value: ''
    },
    /**
     * @property {can.Map} state
     *
     * A node's state is a map of view model properties passed to
     * its component.
     */
    state: {
      Value: Map
    },
    /**
     * @property {can.List} children
     *
     * If a node has other nodes beneath it then its a branch.
     */
    children: {
      Value: List
    }
  }
});
