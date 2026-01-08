import request from 'supertest'
import { app } from '../src/server'

jest.mock('@prisma/client', () => {
  const vehicle = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn()
  }
  return {
    PrismaClient: jest.fn(() => ({ vehicle }))
  }
})

const mockedPrisma = new (jest.requireMock('@prisma/client').PrismaClient as any)()

describe('Vehicle routes', () => {
  it('retorna 400 para payload inválido no cadastro', async () => {
    const response = await request(app).post('/vehicles').send({})
    expect(response.status).toBe(400)
  })

  it('cria veículo com sucesso', async () => {
    mockedPrisma.vehicle.create.mockResolvedValueOnce({
      id: 'v1',
      brand: 'Ford',
      model: 'Fiesta',
      year: 2020,
      color: 'Preto',
      price: 50000,
      plate: 'ABC1234',
      status: 'AVAILABLE'
    })

    const response = await request(app).post('/vehicles').send({
      brand: 'Ford',
      model: 'Fiesta',
      year: 2020,
      color: 'Preto',
      price: 50000,
      plate: 'ABC1234'
    })

    expect(response.status).toBe(201)
    expect(mockedPrisma.vehicle.create).toHaveBeenCalled()
  })

  it('não permite editar veículo inexistente', async () => {
    mockedPrisma.vehicle.findUnique.mockResolvedValueOnce(null)

    const response = await request(app)
      .put('/vehicles/nao-existe')
      .send({
        brand: 'Ford',
        model: 'Fiesta',
        year: 2020,
        color: 'Preto',
        price: 50000
      })

    expect(response.status).toBe(404)
  })

  it('lista veículos ordenados por preço', async () => {
    mockedPrisma.vehicle.findMany.mockResolvedValueOnce([
      { id: '1', price: 10000 },
      { id: '2', price: 20000 }
    ])

    const response = await request(app).get('/vehicles?status=AVAILABLE')

    expect(response.status).toBe(200)
    expect(mockedPrisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { status: 'AVAILABLE' },
      orderBy: { price: 'asc' }
    })
    expect(response.body[0].price).toBe(10000)
  })

  it('atualiza status do veículo', async () => {
    mockedPrisma.vehicle.update.mockResolvedValueOnce({
      id: 'v1',
      status: 'SOLD'
    })

    const response = await request(app)
      .patch('/vehicles/v1/status')
      .send({ status: 'SOLD' })

    expect(response.status).toBe(200)
    expect(mockedPrisma.vehicle.update).toHaveBeenCalled()
  })

  it('retorna 409 ao editar veículo vendido', async () => {
    mockedPrisma.vehicle.findUnique.mockResolvedValueOnce({
      id: 'v1',
      brand: 'Ford',
      model: 'Fiesta',
      year: 2020,
      color: 'Preto',
      price: 50000,
      plate: 'ABC1234',
      status: 'SOLD'
    })

    const response = await request(app)
      .put('/vehicles/v1')
      .send({
        brand: 'Ford',
        model: 'Fiesta',
        year: 2020,
        color: 'Preto',
        price: 50000
      })

    expect(response.status).toBe(409)
  })

  it('retorna 404 ao buscar veículo inexistente por id', async () => {
    mockedPrisma.vehicle.findUnique.mockResolvedValueOnce(null)

    const response = await request(app).get('/vehicles/inexistente')

    expect(response.status).toBe(404)
  })

  it('retorna 400 ao atualizar status com payload inválido', async () => {
    const response = await request(app)
      .patch('/vehicles/v1/status')
      .send({ status: 'OUTRO' })

    expect(response.status).toBe(400)
  })

  it('retorna 400 ao editar veículo com payload inválido', async () => {
    const response = await request(app)
      .put('/vehicles/v1')
      .send({})

    expect(response.status).toBe(400)
  })

  it('edita veículo existente com sucesso', async () => {
    mockedPrisma.vehicle.findUnique.mockResolvedValueOnce({
      id: 'v1',
      brand: 'Ford',
      model: 'Fiesta',
      year: 2020,
      color: 'Preto',
      price: 50000,
      plate: 'ABC1234',
      status: 'AVAILABLE'
    })
    mockedPrisma.vehicle.update.mockResolvedValueOnce({
      id: 'v1',
      brand: 'Ford',
      model: 'Fiesta SE',
      year: 2021,
      color: 'Branco',
      price: 52000,
      plate: 'ABC1234',
      status: 'AVAILABLE'
    })

    const response = await request(app)
      .put('/vehicles/v1')
      .send({
        brand: 'Ford',
        model: 'Fiesta SE',
        year: 2021,
        color: 'Branco',
        price: 52000
      })

    expect(response.status).toBe(200)
    expect(mockedPrisma.vehicle.update).toHaveBeenCalled()
  })

  it('retorna 200 ao buscar veículo existente por id', async () => {
    mockedPrisma.vehicle.findUnique.mockResolvedValueOnce({
      id: 'v1',
      brand: 'Ford',
      model: 'Fiesta',
      year: 2020,
      color: 'Preto',
      price: 50000,
      plate: 'ABC1234',
      status: 'AVAILABLE'
    })

    const response = await request(app).get('/vehicles/v1')

    expect(response.status).toBe(200)
  })

  it('lista veículos sem filtro de status', async () => {
    mockedPrisma.vehicle.findMany.mockResolvedValueOnce([
      { id: '1', price: 15000 },
      { id: '2', price: 25000 }
    ])

    const response = await request(app).get('/vehicles')

    expect(response.status).toBe(200)
    expect(mockedPrisma.vehicle.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { price: 'asc' }
    })
  })
})

