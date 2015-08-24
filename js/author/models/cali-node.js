import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';

/**
 * @module CaliNode
 * @parent api-models
 *
 * The CaliNode Map represents a [CaliDocument] node. From its root node
 * out to its branches and leaves, every CaliDocument node is a CaliNode.
 * A CaliNode is a branch if it has child CaliNodes of its own,
 * otherwise it's a leaf.
 */
export default Map.extend({
  define: {
    /**
     * @property {String} component
     *
     * A component tag name for a cali component.
     *
     * e.g. 'cali-document', 'cali-template', 'section-title'
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
