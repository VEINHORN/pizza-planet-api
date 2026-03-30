# ordering-service

## Requests

Check service health:

```shell
curl localhost:3000/health
```

Create order:

```shell
curl -X POST -d @order.json -H "Content-Type: application/json" localhost:3000/orders | jq
```
