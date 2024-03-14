import jwt from 'jsonwebtoken'
import dbConnect from '@/utils/db/dbConnect'
import User from '@/models/User'

export default async function handler (req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  // get token and email from query
  const token = req.query.token
  const email = req.query.email

  // verify token is valid or not
  const isValid = await new Promise((resolve) => {
    jwt.verify(token, process.env.NEXTAUTH_SECRET + email, (err) => {
      if (err) resolve(false)
      if (!err) resolve(true)
    })
  })

  if (!isValid) {
    res.status(401).json({ message: 'Invalid Token' })
    return
  }

  // Connect to database
  const client = await dbConnect('auth')

  // check if user is already verified
  const user = await User.findOne({ email, authType: 'credentials' })

  if (user.emailVerified) {
    res.status(400).json({ message: 'Email already verified' })
    return
  }

  // update user emailVerified field in database
  const updateRes = await User.updateOne(
    { email, authType: 'credentials' },
    { emailVerified: new Date() }
  )

  if (updateRes.modifiedCount !== 1) {
    res.status(500).json({ message: 'Something went wrong - DB' })
    return
  }

  // redirect to login page
  res.redirect('/login')
}
