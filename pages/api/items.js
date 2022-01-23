import httpapi from "../../lib/httpapi"

export default function handler(req, res) {
  const { sku } = req.query

  if(sku && sku != '') {
    httpapi.post('/item/search', {sku: sku})
    .then((result) => {
      let data = []

      if(result.data.id) {
        data[0] = result.data
      }
      
      res.status(200).json(data)
    })
    .catch((error) => {
      console.log('Error', error)
      res.status(400).json('Bad Request!')
    })  
  }
  else {
    httpapi.get('/items')
    .then((result) => {
      res.status(200).json(result.data)
    })
    .catch((error) => {
      console.log('Error', error)
      res.status(400).json('Bad Request!')
    })  
  }
}