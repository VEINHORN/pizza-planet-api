# Pizza Planet API

This is a monorepo for the Pizza Planet API.

## Available Services

### Ordering Service
To start the ordering service in development mode:
```shell
npm run -w ordering-service dev
```

### Production Service
To start the production service in development mode:
```shell
npm run -w production-service dev
```

## Shared Packages

### API Contracts
Build the shared contracts:
```shell
npm run build -w packages/api-contracts
```

## Running Tests
Run tests for all workspaces:
```shell
npm test
```
