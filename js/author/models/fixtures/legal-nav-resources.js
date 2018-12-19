import fixture from 'can-fixture'

export default fixture('GET /api/topics-resources/resource', function (req, res) {
  const topic = req.data ? req.data.topic : null

  const divorceResources = [
    {name: 'How to file uncontested divorce', guid: '1q2w3e4r'},
    {name: 'Dividing properties and vehicles', guid: '5t6y7u8i'}
  ]

  const mooseResources = [
    {name: 'Do not approach a wild moose!', guid: 'p1p3p5p7'},
    {name: 'Moose and the art of leaving them alone', guid: '0f9cv7sd'}
  ]

  const surfingResources = [
    {name: 'Gnarly waves and how to navigate them', guid: 'n6kd8vj4'},
    {name: 'Staying in the Green Room', guid: 'j69s65jb3'}
  ]

  switch (topic) {
    case 'Divorce':
      res(divorceResources)
      break

    case 'Moose Issues':
      res(mooseResources)
      break

    case 'Surfing Rights':
      res(surfingResources)
      break

    default:
      console.error('Missing resource fixture ', req.data)
  }
})
