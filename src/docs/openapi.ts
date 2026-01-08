export const inventoryOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Inventário de Veículos',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3001'
    }
  ],
  paths: {
    '/vehicles': {
      get: {
        summary: 'Listar veículos',
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de veículos'
          }
        }
      },
      post: {
        summary: 'Cadastrar veículo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  brand: { type: 'string' },
                  model: { type: 'string' },
                  year: { type: 'integer' },
                  color: { type: 'string' },
                  price: { type: 'number' },
                  plate: { type: 'string' }
                },
                required: ['brand', 'model', 'year', 'color', 'price', 'plate']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Veículo criado'
          }
        }
      }
    },
    '/vehicles/{id}': {
      get: {
        summary: 'Buscar veículo por id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Veículo encontrado' },
          '404': { description: 'Veículo não encontrado' }
        }
      },
      put: {
        summary: 'Editar veículo',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  brand: { type: 'string' },
                  model: { type: 'string' },
                  year: { type: 'integer' },
                  color: { type: 'string' },
                  price: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Veículo atualizado' },
          '404': { description: 'Veículo não encontrado' },
          '409': { description: 'Veículo já vendido' }
        }
      }
    },
    '/vehicles/{id}/status': {
      patch: {
        summary: 'Atualizar status do veículo',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['AVAILABLE', 'SOLD'] }
                },
                required: ['status']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Status atualizado' },
          '400': { description: 'Payload inválido' }
        }
      }
    }
  }
}

