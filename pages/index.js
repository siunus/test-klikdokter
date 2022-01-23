import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap'
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import axios from 'axios'
import HeadComponent from "../components/HeadComponent"

export default function Component() {
  const { data: session } = useSession()

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    getItems()
  }, [])

  const getItems = async () => {
    setLoading(true)
    
    await axios.get('/api/items')
    .then((res) => {
      console.log(res)
      setData(res.data)
      setLoading(false)
    })
    .catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }

  const handleChange = (e) => {
    setTimeout(function() {
      const value = e.target.value.trim()

      axios.get('/api/items?sku=' + value)
      .then((res) => {
        console.log(res)
        if(res.data.length > 0) {
          setData(res.data)
        }  else {
          setData(null)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
    }, 500)
  }

  const handleDelete = (e) => {
    e.preventDefault();
    const data = {
      sku: e.target.sku.value,
      token: session.user.token
    }

    axios.post('/api/product-delete', data)
      .then((res) => {
        console.log(res)
        getItems()
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <HeadComponent title="HOME"/>
      <Container className="mt-5">
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Control type="text" name="sku" placeholder="Search by SKU" onChange={handleChange}/>
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3" align="right">
            {session
              ? <>
                <Link href="/product/add">
                  <Button variant="dark">Add Product</Button>
                </Link>
                {' '}
                  <Button variant="dark" onClick={() => signOut()}>Logout</Button>
                </>
              : <>
                <Link href="/login">
                  <Button variant="dark">Login</Button>
                </Link>
                {' '}
                <Link href="/register">
                  <Button variant="dark">Register</Button>
                </Link>
                </>
            }
          </Col>
        </Row>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Unit</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>{' '}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ?
                  <tr>
                    <td colSpan={7}>Loading...</td>
                  </tr>
                :
                !data ?
                  <tr>
                    <td colSpan={7}>No item!</td>
                  </tr>
                : <></>
              }

              {data && data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.sku}</td>
                    <td>{item.product_name}</td>
                    <td>{item.unit}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    {session
                      ? <>
                        <td>
                          <Link href={"/product/edit?sku=" + item.sku}>
                            <a>Edit</a>
                          </Link>
                          {' '}
                          <a href="#" onClick={handleShow}>
                            Delete
                          </a>

                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Delete Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure?</Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Form onSubmit={handleDelete}>
                                <Form.Control name="sku" type="hidden" defaultValue={item.sku} />
                                <Button variant="danger" type="submit">
                                  Delete
                                </Button>
                              </Form>
                            </Modal.Footer>
                          </Modal>
                        </td>
                        </>
                      : <td></td>
                    }
                  </tr>
                  )
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  )
}