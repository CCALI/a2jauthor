import fixture from 'can-fixture'

export default fixture('GET /api/topics-resources/topics', function (req, res) {
  const state = req.data ? req.data.state : null
  console.log('state', state)
  const alaskaTopics = [
    {name: 'Divorce'},
    {name: 'Moose Issues'}
  ]

  const hawaiiTopics = [
    {name: 'Divorce'},
    {name: 'Surfing Rights'}
  ]

  switch (state) {
    case 'AK':
      res(alaskaTopics)
      break

    case 'HI':
      res(hawaiiTopics)
      break

    default:
      console.error('Missing topics fixture ', req.data)
  }
})
