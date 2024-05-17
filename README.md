# Documentation 

This is a package of an application providing a REST API to a FASTFOOD model.
The entire application is contained within the `src.core` file.

| Folder    | Type        | Description |
|-----------|-------------|-------------|
|application|useCase      |Orchestration|
|domain     |entities     |Business     |
|domain     |value-objects|Key          |
|adapter    |interfaces   |Abstraction  |

<br/>

## REST API Clients

Where to use?<br/>

<ul>
<li>Onboarding</li>
<li>Sign-up</li>
<li>Notifications</li>
</ul> 
<br/>
How user´s identification ?<br/>
<b>Brazil</b> 
CPF/CNPJ 
<b>Foreign</b>
CGI 
<br/>

## Routes

` [GET] ../clients/{id}`

no query parameters


`POST /client`

### Payload

```
{
    "id": 00039923395811,
    "name": "",
    "nickname": "",
    "phone": 5511998881214,
    "email": "cliente@gmail.com",
    "token-push":"",
    "email-notification": true,
    "sms-notification": true,
    "push-notification": false
}
```

## REST API Products

Where to use?

<ul>
<li>Order</li>
<li>Delivery</li>
</ul> 

## Routes

`GET | PATCH | DELETE /products/{id}`

query parameters | category-id     


`POST /product`

## Payload

```
{
    "id": 1111,
    "name": "",
    "price": "",
    "category-id": ""
}

```

## REST API Orders

Where to use? <br/>

<ul><li>Delivery</li>
</ul> 

## Routes

`GET /orders/{id}`

no query parameters

## Payload

```
{
    "id": 1111,
    "name": "",
    "client-id": "",
    "products": [],
    "date": "05/15/2024 21:48:00Z"
}

```

## StatusCode

<ul><li>
201 - created</li>
<li>  
400 - error payload</li>
<li> 
422 - invalid resource</li>
<li> 
500 - error fatal</li>
</ul> 
