# ordering-service

## Development

Start the service in development mode from the root:
```shell
npm run -w ordering-service dev
```

## Documentation

- **Interactive API Docs**: [http://localhost:3000/documentation](http://localhost:3000/documentation)
- **Executable Examples**: See [api.http](./api.http) (requires REST Client extension)

## Endpoints

### Health Check
```shell
curl localhost:3000/health
```

### Create Order
```shell
curl -X POST -H "Content-Type: application/json" -d '{
  "countryCode": "PL",
  "pizzas": [{ "name": "Margherita", "size": "LARGE", "quantity": 1 }],
  "address": "Main St 1"
}' localhost:3000/orders
```


## Migrations

Apply changes to the database using single command:

```shell
npx drizzle-kit push
```

### Using separate commands

Generate migrations:

```shell
npx drizzle-kit generate 
```

Apply migrations:

```shell
npx drizzle-kit migrate
```