# API Documentation

This is a package of an application providing a REST API to a FastFood model.
The entire application is contained within the `src.core` file.

## REST API Clients

Where to use?<br/>

<ul>
<li>Onboarding</li>
<li>Sign-up</li>
<li>Notifications</li>
</ul> <br/>

Identification ID

**Brazil** 
CPF/CNPJ 
**Foreign**
CGI 

### Routes

`GET /clients/{id}`
--
**no query parameters**
--

`POST /clients`

### Payload

´´
---

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

´´
---

## REST API Products

Where to use?

<ul>
<li>Order</li>
<li>Delivery</li>
</ul> 

### Routes

`GET | PATCH | DELETE /products/{id}`

--
**query parameters**
category-id
--

`POST /products`

### Payload

´´
---

{
    "id": 1111,
    "name": "",
    "price": "",
    "category-id": ""
}

´´
---

## REST API Orders

Where to use? <br/>

<ul><li>Delivery</li>
</ul> 

### Routes

`GET /orders/{id}`

--
**no query parameters**
--

### Payload

´´
---
{
    "id": 1111,
    "name": "",
    "client-id": "",
    "products": [],
    "date": "05/15/2024 21:48:00Z"
}
---
´´

## StatusCode

´´
---

201 - created 
400 - error payload 
422 - invalid resource 
500 - error fatal 
---
´´