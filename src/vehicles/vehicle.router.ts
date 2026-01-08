import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const vehicleRouter = Router()

const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().gte(1900),
  color: z.string().min(1),
  price: z.number().positive(),
  plate: z.string().min(1)
})

vehicleRouter.post('/', async (req, res) => {
  const parseResult = vehicleSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() })
  }
  const data = parseResult.data
  const vehicle = await prisma.vehicle.create({
    data: {
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      price: data.price,
      plate: data.plate
    }
  })
  return res.status(201).json(vehicle)
})

vehicleRouter.get('/', async (req, res) => {
  const status = req.query.status as string | undefined
  const where = status ? { status } : {}
  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { price: 'asc' }
  })
  return res.json(vehicles)
})

vehicleRouter.put('/:id', async (req, res) => {
  const parseResult = vehicleSchema.partial({ plate: true }).safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() })
  }
  const { id } = req.params
  const existing = await prisma.vehicle.findUnique({ where: { id } })
  if (!existing) {
    return res.status(404).json({ message: 'Veículo não encontrado' })
  }
  if (existing.status === 'SOLD') {
    return res.status(409).json({ message: 'Veículo já vendido' })
  }
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: parseResult.data
  })
  return res.json(vehicle)
})

vehicleRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const vehicle = await prisma.vehicle.findUnique({ where: { id } })
  if (!vehicle) {
    return res.status(404).json({ message: 'Veículo não encontrado' })
  }
  return res.json(vehicle)
})

vehicleRouter.patch('/:id/status', async (req, res) => {
  const schema = z.object({
    status: z.enum(['AVAILABLE', 'SOLD'])
  })
  const parseResult = schema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() })
  }
  const { id } = req.params
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: { status: parseResult.data.status }
  })
  return res.json(vehicle)
})

