## Setup Postgres
- 
```bash
$ docker run -p 5432:5432 -v /tmp/database:/var/lib/postgresql/data -e POSTGRES_PASSWORD=1234 -d postgres:16-alpine
```

## Migrate
Para executar o migration é preciso ter a conexão com o banco em forma de URL em uma variável de ambiente, conforme o exemplo abaixo:
```bash
$ export DATABASE_URL=postgres://postgres:1234@0.0.0.0:5432/postgres
$ npm run migrate up
```