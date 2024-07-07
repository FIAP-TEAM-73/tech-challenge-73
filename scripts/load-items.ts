/* eslint-disable @typescript-eslint/no-floating-promises */
import axios from 'axios'

const apiBaseUrl = 'http://localhost:9001/api/v1'

// Dados para os produtos
const products = [
  {
    name: 'Bolinho de Cebola',
    category: 'SIDES',
    description: 'Porção de 500g de Bolinho crocante de cebola',
    price: 18.99,
    base64: 'anybase64'
  },
  {
    name: 'Batata frita simples',
    category: 'SIDES',
    description: 'Aprox. 500g de batatas fritas e sequinhas',
    price: 23.00,
    base64: 'anybase64'
  },
  {
    name: 'Batata rustica',
    category: 'SIDES',
    description: 'Batata assada e crocante',
    price: 25.00,
    base64: 'anybase64'
  },
  {
    name: 'Torta de limão',
    category: 'DESSERTS',
    description: 'Deliciosa torta de limão',
    price: 18.99,
    base64: 'anybase64'
  },
  {
    name: 'Petit gateau',
    category: 'DESSERTS',
    description: 'Delicioso gateau com sorvete da casa',
    price: 25.99,
    base64: 'anybase64'
  },
  {
    name: 'Coca saborizadas',
    category: 'DRINKS',
    description: 'Coca com muito gelo e com diversos sabores',
    price: 12.99,
    base64: 'anybase64'
  },
  {
    name: 'Coca zero',
    category: 'DRINKS',
    description: 'Coca sem açucar',
    price: 5.99,
    base64: 'anybase64'
  },
  {
    name: 'Suco natural',
    category: 'DRINKS',
    description: 'Suco com diversas opções de sabores',
    price: 8.99,
    base64: 'anybase64'
  },
  {
    name: 'Godzilla',
    category: 'BURGERS',
    description: 'Burger Angus de 250g com muito bacon',
    price: 23.99,
    base64: 'anybase64'
  },
  {
    name: 'Kong',
    category: 'BURGERS',
    description: 'Burger Angus de 250g com muito queijo',
    price: 23.99,
    base64: 'anybase64'
  },
  {
    name: 'Scar',
    category: 'BURGERS',
    description: 'Burger Angus de 250g com farofa de bacon e geleira de pimenta',
    price: 24.99,
    base64: 'anybase64'
  },
  {
    name: 'Rodan',
    category: 'BURGERS',
    description: 'Burger Angus de 250g com cebora caramelizada, molho barbecue e salada',
    price: 28.99,
    base64: 'anybase64'
  }
]

// Função para criar produtos
const createProducts = async (): Promise<void> => {
  for (const product of products) {
    try {
      const response = await axios.post(`${apiBaseUrl}/item`, product)
      console.log(`Produto criado: ${response.data.name}`)
    } catch (error) {
      console.error(`Erro ao criar produto: ${JSON.stringify(error)}`)
    }
  }
}

// Executa a carga inicial de dados
const loadData = async (): Promise<void> => {
  await createProducts()
}

loadData().then(() => { console.log('Carga inicial de dados concluída.') })
