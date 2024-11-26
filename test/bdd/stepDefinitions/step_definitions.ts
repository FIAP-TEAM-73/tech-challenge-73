import { Given, Then, When } from '@cucumber/cucumber'
import { type Customer } from '../../../src/entities/Customer'
import { expect } from 'expect'
import type Order from '../../../src/entities/Order'
import type PaymentStatus from '../../../src/entities/PaymentStatus'

const payloadCustomer =
{
  name: 'Grazi Monica',
  phone: '01197890901',
  cpf: '39991552291'
}

const payloadOrder =
{
  tableNumber: 11,
  orderItems: [
    {
      idItem: 'bf32fb00-7bb2-481d-86ca-336dc5af1d4e',
      price: 35,
      quantity: 1
    }
  ],
  cpf: '39991552291'
}

const payloadStatusPayload =
{
  issueId: 'f0f535c5-d5f5-48f2-90ce-fac0c12068cb',
  status: 'approved'
}

const URL_BASE_ENDPOINT = 'http://localhost:9001'
let statusCode = 0
let category = ''

Given('a new customer', function () {
  const requestBody: Customer = JSON.parse(JSON.stringify(payloadCustomer))
  expect(requestBody).toHaveProperty('cpf')
  expect(requestBody).toHaveProperty('name')
  expect(requestBody).toHaveProperty('phone')
  expect(requestBody.phone).toHaveLength(11)
  expect(requestBody.name.length).toBeGreaterThan(3)
  expect(requestBody.name.length).toBeLessThan(100)
  return 'identificação do usuario válida'
})

When('request for a new account', async function () {
  const retorno = await mensagemHelper('api/v1/customer', 'POST', JSON.stringify(payloadCustomer))
  statusCode = retorno.status
  return 'requisição com sucesso'
})

Then('create a registration sucessfully', function () {
  expect(statusCode).toEqual(204)
  return 'usuário criado'
})

Given('a category', function () {
  category = 'DRINKS'
  return 'categoria set'
})

When('request for items', async function () {
  const retorno = await mensagemHelper(`api/v1/item?page=1&size=10&category=${category}&isActive=true`, 'GET')
  statusCode = retorno.status
  return 'requisição com sucesso'
})

Then('show items avaliable', function () {
  expect(statusCode).toEqual(200)
  return 'consulta com sucesso'
})

Given('a new order', function () {
  const requestBody: Order = JSON.parse(JSON.stringify(payloadOrder))
  expect(requestBody).toHaveProperty('cpf')
  expect(requestBody).toHaveProperty('orderItems')
  expect(requestBody.orderItems.length).toBeGreaterThanOrEqual(1)
  expect(requestBody.orderItems[0].quantity).not.toBeNull()
  expect(requestBody.orderItems[0].price).not.toBeNull()
  expect(requestBody.orderItems[0].itemId).not.toBeNull()
  return 'identificação do pedido válida'
})

When('request for a new order', async function () {
  const retorno = await mensagemHelper('api/v1/order', 'POST', JSON.stringify(payloadOrder))
  statusCode = retorno.status
  return 'requisição com sucesso'
})

Then('create a order sucessfully', function () {
  expect(statusCode).toEqual(200)
  return 'pedido com sucesso'
})

Given('a order', function () {
  const requestBody: PaymentStatus = JSON.parse(JSON.stringify(payloadStatusPayload))
  expect(requestBody).toHaveProperty('issueId')
  expect(requestBody).toHaveProperty('status')
  expect(requestBody.id).not.toBeNull()
  expect(requestBody.status).toEqual('approved')
  return 'status pedido aprovado'
})

When('callback payment', async function () {
  const retorno = await mensagemHelper('api/v1/payment/hook', 'POST', JSON.stringify(payloadStatusPayload))
  statusCode = retorno.status
  return 'requisição com sucesso'
})

Then('update payment sucessfully', function () {
  expect(statusCode).toEqual(204)
  return 'pagamento do pedido atualizado com sucesso'
})

async function mensagemHelper (path: string, methodReq: string, payload?: string): Promise<any> {
  const response = await fetch(`${URL_BASE_ENDPOINT}/${path}`,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      method: methodReq,
      body: payload
    }
  )
  console.log(path)
  console.log(response.status)
  return response
}
