import _compact from 'lodash/compact'
import _capitalize from 'lodash/capitalize'

const elementTagToPrettyName = {
  'a2j-pdf': 'PDF Document',
  'a2j-rich-text': 'Rich Text',
  'a2j-conditional': 'If / Else',
  'a2j-page-break': 'Page Break',
  'a2j-repeat-loop': 'Repeat Loop',
  'a2j-section-title': 'Section Title'
}

/**
 * @module {{}} author/models/make-node-outline makeNodeOutline
 *
 * Provides a function that given an [A2JNode] instance generates an 'outline'
 * of the node. The outline is just a string with a pretty version of the element
 * name and depending on the node, it might be anotated with the name of nested
 * elements. E.g, an `a2j-template` node that has two children, `a2j-section-title`
 * and `a2j-repeat-loop` should have an outline as follows:
 *
 * Section Title, Repeat Loop (Table)
 *
 * where the text inside the parenthesis is, in this case, what the repeat loop
 * element will output in the final PDF document. If the node has nested elements,
 * which is the case of `a2j-conditional`, its children element outline will be
 * listed inside parenthesis similar to the previous example of the repeat loop, e.g:
 *
 * If / Else (Section Title, Repeat Loop (List))
 *
 */
export default function (node) {
  const tag = node.attr('tag')
  const children = node.attr('children')
  const prettyName = elementTagToPrettyName[tag]
  const emptyTemplateMessage = 'This template is blank'

  let result

  const childrenOutline = function () {
    const outline = children.map(c => c.attr('outline'))
    return _compact(outline)
  }

  switch (tag) {
    case 'a2j-template':
      result = children.attr('length')
        ? childrenOutline().join(', ')
        : emptyTemplateMessage

      break

    case 'a2j-repeat-loop':
      const display = node.attr('state.displayType') || 'table'
      result = `${prettyName} (${_capitalize(display)})`

      break

    case 'a2j-conditional':
      const withoutEmptyMessage = childrenOutline().filter(outline => {
        return outline !== emptyTemplateMessage
      })

      result = children.attr('length') && withoutEmptyMessage.length
        ? `${prettyName} (${withoutEmptyMessage.join(', ')})`
        : prettyName

      break

    default:
      result = prettyName
  }

  return result
}
