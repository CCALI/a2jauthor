import template2111 from './templates/guide1261-template2111'
import template2112 from './templates/guide1261-template2112'
import template2113 from './templates/guide1261-template2113'
import template2114 from './templates/guide20-template2114'

// emulates a Guide's local templates.json file which has a map like {"guideId":20,"templateIds":[2114]}
// and the api call that returns the template based on guideId/templateId comboId like {20-2114}
let fixtureTemplates = {
  1261: { 2111: template2111, 2112: template2112, 2113: template2113 },
  20: { 2114: template2114 },
  5150: {} // used for 'throw away' tests that don't need templates map to persist
}

let a2jTemplates
let a2jTemplateSequence

export const resetFixtureTemplates = function () {
  a2jTemplates = fixtureTemplates
  a2jTemplateSequence = 3000
}

if (!a2jTemplates) {
  resetFixtureTemplates()
}

export default function (request, response) {
  let requestData = request.data || {}
  let guideId = requestData.guideId || '1261' // TODO: remove 'default' guideId of '1261'
  let templateId = requestData.templateId

  switch (request.type) {
    case 'put': // update
      a2jTemplates[guideId][templateId] = requestData
      response(a2jTemplates[guideId][templateId])
      break

    case 'post': // create
      templateId = a2jTemplateSequence += 1
      // assign new templateId
      requestData.templateId = templateId
      // store in "DB"
      a2jTemplates[guideId][templateId] = requestData
      response(a2jTemplates[guideId][templateId])
      break

    case 'delete': // destroy
      if (a2jTemplates[guideId] == null) {
        response(404)
      } else {
        delete a2jTemplates[guideId][templateId]
        response(200)
      }

      break

    default:
      // findOne template for templateId
      if (templateId) {
        response(a2jTemplates[guideId][templateId])
      } else {
        // findAll templates for guideId
        const templatesList = []
        Object.keys(a2jTemplates[guideId]).forEach((templateId) => {
          templatesList.push(a2jTemplates[guideId][templateId])
        })
        response(templatesList)
      }
  }
}
