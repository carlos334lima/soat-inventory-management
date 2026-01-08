import express from 'express'
import { json } from 'express'
import swaggerUi from 'swagger-ui-express'
import { vehicleRouter } from './vehicles/vehicle.router'
import { inventoryOpenApiSpec } from './docs/openapi'

export const app = express()

app.use(json())
app.use('/vehicles', vehicleRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(inventoryOpenApiSpec))
app.get('/docs-json', (_req, res) => {
  res.json(inventoryOpenApiSpec)
})

