import httpapi from "../../lib/httpapi"

export default function handler(req, res) {
  const data = {
    sku: req.body.sku,
    product_name: req.body.product_name,
    qty: req.body.qty,
    price: req.body.price,
    unit: req.body.unit,
    status: 1,
  }

  httpapi.post('/item/add', data, {
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