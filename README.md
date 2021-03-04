## Una aplicacion web desarollada en ambiente Back-End con las tenologies NodeJs, Express, MongoDB, ...

Por favor ejecute el comando siguiente
`npm install`
para usar mi app

Lo que primero debemos hacer es crear un usuario administrador con la PATH especifica que esta user-routes.js
Despues podemos crear mas usuario, pero esto solo lo puede hacer el adminstrador registrado y el que haya iniciado sesion. Esto porque vamos hacer validaciones de sesiones con JWT.

Para poder crea una empresa, primero es necesario que existe su usuario. Una vez creado el usuario, solamente el administrador puede hacer el CRUD de empresas.
De iguaal forma, para crear empleados, esto solamente lo puede hacer una empresa que este registrada y que haya iniciado sesion habiendose generado su token.
El CRUD de empleados solo lo puede hacer las empresas (dependiendo de cuál empresa sea el token).
