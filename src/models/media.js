import DefineMap from 'can-define/map/map'

const MediaModel = DefineMap.extend('MediaModel', {
  findAll (gid) {
    return window.fetch('CAJA_WS.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: `cmd=guidemedia&gid=${gid}`
    })
      .then(response => response.json())
      .then(data => {
        return data.mediaDetails
      })
      .catch(err => console.error(err))
  }
})

// TODO: make this a real CanJS model
const Media = new MediaModel()

export default Media
