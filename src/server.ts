import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import routes from './routes'
import uploadConfig from './config/upload'
import corsConfig from './config/cors'

import './database'
import AppError from './errors/AppError'

const app = express()

app.use(cors(corsConfig))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes)

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      })
    }

    console.error(error.message)

    return response.status(500).json({
      status: error,
      message: 'Internal server error',
    })
  },
)

app.listen(3333, () => console.log('🎸 Server start on port 3333'))
