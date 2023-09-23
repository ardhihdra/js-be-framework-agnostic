## Plug and Play repositories

The goal of this is to have framework agnostic backend.
The architecture needs to be:

- independent of framework
- testable
- independent of UI
- independent of DB
- independent of external agency

default framework used are (expressjs, redis, & firestore)

controller : introducting API layer to business logic
models : the business logic
repository : access the data store
router : separate routing framework from the code

### How To Run

```
npm i && npm run dev
```

### How to call
call api by its version. Example using Httpie:
```
http :3000/v1/post
```

### Future Feature

- It's hard to make another abstraction over repositories (e.g mongodb, firestore, postgresql etc), so for now just
  create what is necessary for the impelementation of repository/index
- to also work with 'protocol' such as graphQl, gRPC
