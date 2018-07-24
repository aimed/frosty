# Middleware
To use a middleware with DI, create a class that implements ```GraphQLMiddleware```. The method
```middleware``` will be passed to the graphql server.