import $ from 'jquery'
import parser from '@caliorg/a2jdeps/utils/parser'
import assemble from '@caliorg/a2jdeps/pdf/assemble'
import PDFJS from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.entry'

const { getTemplateOverlay } = assemble
const { parseJSON: parseAnxToJson } = parser

export function getPdfJs () {
  return Promise.resolve(PDFJS)
}

export function promptFile (fileType, fileHumanType) {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    if (fileType) {
      fileInput.accept = fileType
    }
    fileInput.style = 'display: none;'

    document.body.appendChild(fileInput)

    fileInput.onchange = function () {
      if (document.body.contains(fileInput)) {
        document.body.removeChild(fileInput)
      }

      const file = fileInput.files[0]
      if (!file) {
        return reject(new Error('No file selected'))
      }
      if (fileType && file.type !== fileType) {
        return reject(
          new Error(`File must be ${fileHumanType}, not "${file.type}"`)
        )
      }

      resolve(file)
    }

    fileInput.click()
  })
}

function promptPdf () {
  return promptFile('application/pdf', 'PDF')
}

function request (settings) {
  return new Promise((resolve, reject) => {
    $.ajax(settings)
      .done(result => {
        if (!result.ok) {
          return reject(new Error(result.error))
        }
        resolve(result)
      })
      .fail((_, status, error) => {
        reject(new Error(error))
      })
  })
}

export function uploadTemplatePdf (templateId, confirmPdf) {
  return promptPdf().then(file => {
    return getPdfJs()
      .then(pdfJs => {
        const localUrl = window.URL.createObjectURL(file)
        return pdfJs.getDocument(localUrl)
      })
      .then(pdf => confirmPdf(pdf.numPages))
      .then(isConfirmed => isConfirmed && submitTemplatePdf(templateId, file))
  })
}

export function submitTemplatePdf (templateId, file) {
  const data = new window.FormData()
  data.append('pdf', file)
  const settings = {
    type: 'post',
    url: `/api/a2j-doc/storage/${templateId}`,
    contentType: false,
    data,
    dataType: 'json',
    processData: false
  }

  return request(settings).then(({ ok }) => ok)
}

export function createOverlayPdf (guideId, templateId, overlay) {
  const comboId = `${guideId}-${templateId}`
  const settings = {
    url: `/api/a2j-doc/storage/${comboId}/apply-overlay`,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({ overlay })
  }

  return request(settings).then(({ pdfId }) => pdfId)
}

export function assemblePdf ({ variables, template }) {
  return promptFile(null, 'ANX')
    .then(file => {
      return new Promise((resolve, reject) => {
        const reader = new window.FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
      })
    })
    .then(text => parseAnxToJson(text))
    .then(answers => getTemplateOverlay(template, variables, answers))
    .then(overlay => createOverlayPdf(template.guideId, template.templateId, overlay))
    .then(pdfId => getTemporaryPdfUrl(pdfId))
}

export function getTemplatePdfUrl (comboId) {
  return `/api/a2j-doc/storage/${comboId}`
}

export function getTemporaryPdfUrl (pdfId) {
  return `/api/a2j-doc/storage/temp/${pdfId}`
}

export function getFonts () {
  return request({
    method: 'get',
    url: '/api/a2j-doc/overlay/supported-fonts',
    dataType: 'json'
  }).then(({ fonts }) => fonts)
}

export function getCheckmarks () {
  return request({
    method: 'get',
    url: '/api/a2j-doc/overlay/supported-checks',
    dataType: 'json'
  }).then(({ checks }) => checks)
}

export function atom (state) {
  return {
    get () {
      return state
    },
    set (newState) {
      state = newState
    },
    clear () {
      state = undefined
    }
  }
}

/*
  This is for flagging the template creation as PDF.
  This flag is set by the "New PDF Template" button.
  This flag is checked by the author/templates/edit to create a pdf root node.
  This flag is checked by the author/pdf/editor to prompt for pdf upload.
  This flag is cleared by the author/pdf/editor.
*/
export const sharedPdfFlag = atom()
