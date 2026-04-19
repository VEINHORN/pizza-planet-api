# production-service

## Endpoints

Check service health:

```shell
curl localhost:3000/health
```

Send ingridient shipment:

```shell
curl -X POST -d @stock.json -H "Content-Type: application/json" localhost:3000/stock | jq
```

stock.json file content:

```json
{
  "targetWarehouse": "warehouse1",
  "ingredients": [
    {
      "id": "mozzarella-cheese",
      "units": 50
    },
    {
      "id": "tomato-sauce",
      "units": 20
    }
  ]
}
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
