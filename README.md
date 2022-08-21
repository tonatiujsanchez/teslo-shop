# Next.js Teslo-Shop
Para correr localmente, se necesita la base de datos, ejecutar el siguiente comando:
```
docker-compose up -d
```
* el -d, significa __detached__

MongoDB URL Local 

```
    mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno

Renombrar el archivo __.env.template__ a __.env__

## Reconstruir los node_modules
```
    yarn install 
```
## Levantar el servidor de desarrollo de Next
```
    yarn dev
```

## Llenar la base de datos con información de pruebas

Llama el endpoint
```
http://localhost:3000/api/seed
```