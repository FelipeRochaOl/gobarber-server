import express from 'express';
import routes from '../src/routes'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(routes)

app.listen(3333, () => console.log('Server start on port 3333'))