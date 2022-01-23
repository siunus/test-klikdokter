import httpapi from "../../lib/httpapi"

export default function handler(req, res) {
  const data = {
    sku: req.body.sku
  }

  console.log(res.body)

  httpapi.post('/item/delete', data, {
    headers: {
      'Authorization': 'Bearer ' + req.body.token
    }
  })
  .then((result) => {
    console.log(result.data)
    res.status(200).json(result.data)
  })
  .catch((error) => {
    console.log('Error', error.response.data)
    res.status(200).json(error.response.data)
  })
}