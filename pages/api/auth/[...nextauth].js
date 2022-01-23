import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";
import httpapi from "../../../lib/httpapi";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        let response = null

        await httpapi.post('/auth/login', credentials)
          .then((result) => {
            if(result.data.token) {
              const token = result.data.token

              response = {token: token}
            }
          })
          .catch((error) => {
            console.log('Error', error)
          })

          return response
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if(user) {
        token.token = user.token
      }

      return token
    },
    session({ session, token }) {
      if(token) {
        session.user.token = token.token
      }

      return session
    },
    redirect({ url, baseUrl }) {
      return baseUrl
    }
  },
  secret: "test",
  jwt: {
    secret: "test",
    encryption: true
  }
})