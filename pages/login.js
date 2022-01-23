import { getCsrfToken, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Link from "next/link"
import HeadComponent from "../components/HeadComponent"

export default function Login({ csrfToken }) {
  const router = useRouter()
  const { error } = router.query;

  return (
    <>
      <HeadComponent title="LOGIN"/>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4} className="mb-3">
            <h3 class="mb-3">Login</h3>
            {error && error == 'CredentialsSignin'
              ? <>
                <Alert variant="danger">
                  Login failed!
                </Alert>
               </>
              : <> </>
            }

            <Form action="/api/auth/callback/credentials" method="post">
              <Form.Control name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" />
              </Form.Group>

              <Row className="mt-4">
                <Col>
                  New User?<br/>
                  <Link href="/register">
                    <a>Register</a>
                  </Link>
                </Col>
                <Col>
                  <Button variant="dark" type="submit" className="float-right">
                    Login
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