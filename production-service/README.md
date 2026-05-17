# production-service

## Development

Start the service in development mode from the root:

```shell
npm run -w production-service dev
```

## Documentation

- **Interactive API Docs**: [http://localhost:3000/documentation](http://localhost:3000/documentation)
- **Executable Examples**: See [api.http](./api.http) (requires REST Client extension)

## Endpoints

### Health Check

```shell
curl localhost:3000/health
```

### Send Ingredient Shipment

```shell
curl -X POST -H "Content-Type: application/json" -d '{
  "supplier": "DairyBest Inc.",
  "items": [{ "ingredientName": "Mozzarella Cheese", "quantity": 25, "unit": "kg" }]
}' localhost:3000/stock/shipments
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
