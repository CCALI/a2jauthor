import DefineMap from 'can-define/map/map'

const GuideFilesModel = DefineMap.extend('GuideFilesModel', {
  findAll (gid) {
    return window.fetch('CAJA_WS.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: `cmd=guidefiles&gid=${gid}`
    })
      .then(response => response.json())
      .then(data => {
        return data
      })
      .catch(err => console.error(err))
  }
})

// TODO: make this a real CanJS model
const GuideFiles = new GuideFilesModel()

export default GuideFiles
