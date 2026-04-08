# ordering-service

## Endpoints

```shell
curl localhost:3000/health
```

Create order:

```shell
curl -X POST -d @order.json -H "Content-Type: application/json" localhost:3000/orders | jq
```

order.json content:

```json
{
  "countryCode": "PL",
  "pizzas": [
    {
      "name": "Margherita",
      "size": "LARGE",
      "quantity": 2
    },
    {
      "name": "Pepperoni",
      "size": "SMALL",
      "quantity": 1
    }
  ],
  "address": "Vilnius"
}
```
