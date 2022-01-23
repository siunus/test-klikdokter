import httpapi from "../../lib/httpapi"

export default function handler(req, res) {
  httpapi.post('/register', req.body)
  .then((result) => {
    res.status(200).json(result.data)
  })
  .catch((error) => {
    console.log('Error', error.response.data)
    res.status(200).json(error.response.data)
  })
}