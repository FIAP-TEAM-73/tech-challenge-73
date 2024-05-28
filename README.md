# Modelo de Fast Food
## Descrição
Este projeto de fast food permite aos clientes se cadastrarem, realizarem pedidos e efetuarem pagamentos. A seguir, descrevemos o fluxo principal:

<b>Pedido</b>: Os clientes são apresentados a uma interface de seleção na qual podem optar por se identificarem via CPF, se cadastrarem com nome, e-mail ou não se identificar, podendo montar o combo na seguinte sequência, sendo todas elas opcionais:
<ol>
<li>Lanche </li>
<li>Acompanhamento</li>
<li>Bebida</li>
<li>Sobremesa</li>
</ol>
Em cada etapa é exibido o nome, descrição e preço de cada produto.
<br/><br/>

<b>Pagamento</b>: O sistema deverá possuir uma opção de pagamento integrada para MVP. A forma de pagamento oferecida será via QRCode do Mercado Pago.

<b>Acompanhamento</b>: Uma vez que o pedido é confirmado e pago, ele é enivado para a cozinha para ser preparado. Simultaneamente deve aparecer em um monitor para o cliente acompanhar o progresso do seu pedido com as seguintes etapas: 
<ol>
<li>Recebido </li>
<li>Em preparação </li>
<li>Pronto </li>
<li>Finalizado </li>
</ol>

<b>Entrega</b>: Quando o pedido estiver pronto, o sistema deverá notificar o cliente que ele está pronto para retirada. Ao ser retirado, o pedido deve ser atualizado para o status finalizado.


Além das etapas do cliente, o estabelecimento precisa de um acesso administrativo para gerenciar clientes e gerenciar produtos e categorias. 

## Documentação Requisitos de Negócio
Sessões de brainstorming e Event Storming [Miro Board](https://miro.com/app/board/uXjVKTJv5nA=/)

Desenho da Solução # draw.io 

## Documentação Técnica

### Arquitetura de Software
O desenho de arquitetura escolhido foi o monolito hexagonal, também conhecida como Arquitetura de Portas e Adaptadores, para garantir que a lógica de negócios seja independente de detalhes técnicos e externos, como banco de dados, interfaces de usuário, e APIs externas.

<ul>
<li><b>Domínio:</b> Contém a lógica de negócios e as regras essencias da aplicação</li>
<li><b>Aplicação:</b> Contém os casos de uso que orquestram as interações entre os componentes do domínio e as portas.</li>
<li><b>Portas (Interfaces):</b> Definem as operações que podem ser realizadas</li>
<li><b>Adaptadores:</b> Impementam as interfaces das portas e interagem com tecnologias externas (banco de dados, interfaces de usuários, APIs externas).</li>
</ul>

### REST APIs

#### Pedidos Endpoints

| Endpoint                    | Request Method       | 
| --------------------------- |:--------------------:| 
| /api/v1/order               | POST, GET            |             
| /api/v1/order/:id           | PUT                  |

>**_NOTE!!!_**
> Status que devem ser enviados no payload são:
> CREATED, CANCELED, AWAITING_PAYMENT, PAYMENT_REFUSED, PAYMENT_ACCEPTED, RECEIVED, IN_PROGRESS, READY, DONE

#### Produtos Endpoints

| Endpoint                       | Request Method      | 
| -------------------------------|:-------------------:| 
| /api/v1/item                   |POST, GET            |                 
| /api/v1/item/:id               |PUT, DELETE          |                 

>**_NOTE!!!_**
> Status que devem ser enviados no payload são:
> BURGERS, SIDES, DRINKS, DESSERTS

#### Clientes Endpoints

| Endpoint                       | Request Method      | 
| -------------------------------|:-------------------:| 
| /api/v1/customer               |POST                 |             
| /api/v1/customer/:cpf          |GET                  |     



### Estrutura do Projeto
A estrutura do projeto segue a organização típica de uma aplicação com arquitetura hexagonal:

    tech-challenge-73/
    │
    ├── src/
    │   ├── adapter/
    │   │   ├── driven/infra/
    │   │   │   └── database
    |   |   |   └── factories
    |   |   |   └── repositories
    │   │   ├── driver/infra/
    │   │   │   └── api
    │   │   │   |   └── controllers
    │   │   │   └── handlers
    |   ├── core/
    │   │   ├── application/
    │   │   │   └── api
    |   |   |   └── use-cases
    │   │   ├── domain
    │   │   │   └── base
    │   │   │   └── database
    │   │   │   └── entities
    │   │   │   └── interfaces
    |   │   │   │   └── factories
    |   │   │   │   └── repositories
    │   │   │   └── value-objects
    |── test/
    |   ├── core/
    │
    ├── compose.yml         # Configuração do Docker 
    ├── Dockerfile          # Dockerfile da aplicação
    └── README.md           # Este arquivo

### Configuração da Aplicação

#### <b>Executando a Aplicação com Docker Compose</b>
Para facilitar a execução da aplicação, utilizamos o Docker Compose. Siga as instruções abaixo para configurar e iniciar a aplicação:

Pré-requisitos :

<ul><li>

[Docker](https://www.docker.com/get-started)

</li>

<li>

[Docker Compose](https://docs.docker.com/compose/install/)
</li></ul>

Passos para execução :

<ol>
<li><b>Clone o repositório:</b></li>

```bash
git clone https://github.com/seu-usuario/FIAP-TEAM-73/tech-challenge-73.git
cd tech-challenge-73/
```

<li><b>Execute o Docker Compose:</b></li>

```bash
docker-compose up
```

<li><b>Acesse a aplicação:</b></li>
A aplicação estará disponivel em 

`http://localhost:9001`

 <li><b>Swagger UI:</b></li>
 A documentação da API pode ser acessada em 

 `http://localhost:9001/swagger/`

</ol>

#### <b> Postgres (`Somente Desenvolvimento`)</b>

<ol>
<li>Setup local</li>

```bash
$ docker run -p 5432:5432 -v /tmp/database:/var/lib/postgresql/data -e POSTGRES_PASSWORD=1234 -d postgres:16-alpine
```

<li>Migrate </li>

Para executar o migration é preciso ter a conexão com o banco em forma de URL em uma variável de ambiente, conforme o exemplo abaixo:
```bash
$ export DATABASE_URL=postgres://postgres:1234@0.0.0.0:5432/postgres
$ npm run migrate up
```