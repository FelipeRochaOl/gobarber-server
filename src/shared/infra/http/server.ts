import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import routes from '@shared/infra/http/routes'

import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(cors())
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

    return response.status(500).json({
      status: error,
      message: 'Internal server error',
    })
  },
)

app.listen(3333, () => console.log('🎸 Server start on port 3333'))
