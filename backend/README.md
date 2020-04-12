# Livraria e Papelaria Espaço (Backend)

## MongoDB Indexes

Some indexes need to be manually added in order to enhance performance in large collections:

`db.product.createIndex({ updatedAt: -1 })`
