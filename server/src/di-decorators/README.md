# Shared decorators for depencency injection using TypeDI

## MongoCollection
Given a class ```A```, using the ```@MongoCollection(of => A)``` decorator will inject a 
```Collection<A>``` and is equal to calling ```database.collection('A')```. The decorator requires
an instance of **Db** to be configured in the **Container**.