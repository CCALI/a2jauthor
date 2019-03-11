import template2111 from './templates/guide1261-template2111'
import template2112 from './templates/guide1261-template2112'
import template2113 from './templates/guide1261-template2113'
import template2114 from './templates/guide20-template2114'

let fixtureTemplates = {
  2111: template2111,
  2112: template2112,
  2113: template2113,
  2114: template2114
}

let a2jTemplates = JSON.parse(localStorage.getItem('a2jTemplates'))
let a2jTemplateSequence = Number(localStorage.getItem('a2jTemplateSequence'))

let persistTemplates = () => {
  window.localStorage.setItem('a2jTemplates', JSON.stringify(a2jTemplates))
  window.localStorage.setItem('a2jTemplateSequence', a2jTemplateSequence)
}

if (!a2jTemplates) {
  a2jTemplates = fixtureTemplates
  a2jTemplateSequence = 3000

  persistTemplates()
}

export default function (request, response) {
  let requestData = request.data || {}

  switch (request.type) {
    case 'put':
      a2jTemplates[requestData.templateId] = requestData
      persistTemplates()

      response(a2jTemplates[requestData.templateId])
      break

    case 'post':
      a2jTemplateSequence += 1
      requestData.templateId = a2jTemplateSequence
      requestData.guideId = requestData.guideId || '1261'

      a2jTemplates[requestData.templateId] = requestData
      persistTemplates()

      response(a2jTemplates[requestData.templateId])
      break

    case 'delete':
      if (a2jTemplates[requestData.templateId] == null) {
        response(404)
      } else {
        delete a2jTemplates[requestData.templateId]
        persistTemplates()
        response(200)
      }

      break

    default:
      if (requestData.templateId) {
        const templateId = requestData.templateId
        response(a2jTemplates[templateId])
      } else {
        const guideId = requestData.guideId
        const list = []
        Object.keys(a2jTemplates).forEach(k => {
          const template = a2jTemplates[k]
          // only return templates that match the guideId
          if (a2jTemplates[k].guideId === guideId) {
            list.push(template)
          }
        })
        response(list)
      }
  }
}
