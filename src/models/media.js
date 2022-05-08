import DefineMap from 'can-define/map/map'

const MediaModel = DefineMap.extend('MediaModel', {
  findAll (gid) {
    window.fetch('CAJA_WS.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: `cmd=guidemedia&gid=${gid}`
    })
      .then(response => response.json())
      .then(data => {
        console.log('media data', data)
      })
      .catch(err => console.error(err))
  }
})

const Media = new MediaModel()

export default Media
