import { Given, Then, When } from '@cucumber/cucumber'
import { type Customer } from '../../../src/entities/Customer'
import { expect } from 'expect'

const payloadCustomer =
{
  name: 'Grazi Melina',
  phone: '01197890902',
  cpf: '39999552292'
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
  statusCode = await mensagemHelper('api/v1/customer', 'POST', JSON.stringify(payloadCustomer))
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
  statusCode = await mensagemHelper(`api/v1/item?page=1&size=10&category=${category}&isActive=true`, 'GET')
  return 'requisição com sucesso'
})

Then('show items avaliable', function () {
  expect(statusCode).toEqual(200)
  return 'consulta com sucesso'
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
  return response.status
}
