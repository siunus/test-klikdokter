import { getCsrfToken, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Link from "next/link"
import axios from "axios"
import HeadComponent from "../components/HeadComponent"

export default function Register({ csrfToken }) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    }

    await axios.post('/api/register', data)
    .then((res) => {
      if(res.data.success) {
        setError(null)
        setSuccess(res.data.message)
        e.target.reset()
      } else {
        setSuccess(null)
        setError("Registration failed!")
        
        if(res.data.email) {
          setError(res.data.email[0])
        }
        else if(res.data.password) {
          setError(res.data.password[0])
        }
      }
    })
    .catch((error) => {
      console.log(error)
      setSuccess(null)
      setError("Error!")
    })
  }

  return (
    <>
      <HeadComponent title="REGISTER"/>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4} className="mb-3">
            <h3 class="mb-3">Register</h3>
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
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter email" required="true" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" required="true" />
              </Form.Group>

              <Row className="mt-4">
                <Col>
                  Have an account?<br/>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                </Col>
                <Col>
                  <Button variant="dark" type="submit" className="float-right">
                    Register
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

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { csrfToken },
  }
}