## Setup Postgres
- 
```bash
$ docker run -p 5432:5432 -v /tmp/database:/var/lib/postgresql/data -e POSTGRES_PASSWORD=1234 -d postgres:16-alpine
```