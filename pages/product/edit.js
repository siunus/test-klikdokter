import { useSession, getCsrfToken, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Link from "next/link"
import axios from "axios"
import HeadComponent from "../../components/HeadComponent"

export default function ProductAdd({ csrfToken }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { data: session } = useSession()
  const router = useRouter()
  const { sku } = router.query

  useEffect( async () => {
    await axios.post('/api/product-detail', {sku: sku})
    .then((res) => {
      console.log(res.data)
      setData(res.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      sku: e.target.sku.value,
      product_name: e.target.product_name.value,
      qty: e.target.qty.value,
      price: e.target.price.value,
      unit: e.target.unit.value,
      token: session.user.token
    }

    await axios.post('/api/product-update', data)
    .then((res) => {
      console.log(res.data)

      if(res.data.id) {
        setError(null)
        setSuccess("Product updated successfully")
        setData(res.data)
        e.target.reset()
      }
      else {
        if(res.data.message) {
          setSuccess(null)
          setError(res.data.message)
        }
      }
    })
    .catch((error) => {
      console.log(error)
      setSuccess(null)
      setError("Error!")
    })
  }

  console.log(data)

  return (
    <>
      <HeadComponent title="EDIT PRODUCT"/>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4} className="mb-3">
            <h3 class="mb-3">Edit Product</h3>
            {error
              ? <>
                <Alert variant="danger">
                  {error}
                </Alert>
               </>
              : <> </>
            }

            {success
              ? <>
                <Alert variant="success">
                  {success}
                </Alert>
               </>
              : <> </>
            }

            <Form onSubmit={handleSubmit}>
              <Form.Control name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" defaultValue={data && data.sku ? data.sku : ""} name="sku" readOnly/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" name="product_name" defaultValue={data && data.product_name ? data.product_name : ""} required="true" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Unit</Form.Label>
                <Form.Control type="text" name="unit" defaultValue={data && data.unit ? data.unit : ""} required="true" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Qty.</Form.Label>
                <Form.Control type="number" name="qty" defaultValue={data && data.qty ? data.qty : ""} required="true" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" defaultValue={data && data.price ? data.price : ""} required="true" />
              </Form.Group>

              <Row className="mt-4">
                <Col>
                  <Link href="/">
                    <Button variant="link" type="button">
                      &laquo; Back
                    </Button>
                  </Link>
                </Col>
                <Col>
                  <Button variant="dark" type="submit" className="float-right">
                    Update
                  </Button>
                </Col>
              </Row>
            </Form>

          </Col>
        </Row>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { csrfToken },
  }
}