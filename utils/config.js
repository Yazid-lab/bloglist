require('dotenv').config()

const PORT = process.env.PORT
const MONOGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
  MONOGODB_URI,
  PORT,
}
