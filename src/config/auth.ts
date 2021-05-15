export default {
  jwt: {
    secret: process.env.APP_SECRET || 'gobarber',
    expiresIn: '1d',
  },
}
