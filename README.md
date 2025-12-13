# 📝 Alura Blog – API REST

Backend del proyecto **Alura Blog**, desarrollado con **Spring Boot**, que provee una API REST segura para la gestión de usuarios y publicaciones, utilizando **JWT** para autenticación y autorización.

---

## 🚀 Tecnologías utilizadas

- Java 21
- Spring Boot 3
- Spring Security
- JWT (Auth0)
- Spring Data JPA (Hibernate)
- MySQL
- Flyway
- Lombok
- Maven
- Swagger / OpenAPI

---

## 🧱 Arquitectura

- **API REST desacoplada**
- Autenticación **stateless** mediante JWT
- Roles de usuario (`ROLE_USER`, `ROLE_ADMIN`)
- Separación por capas:
  - Controller
  - Service
  - Repository
  - Security
  - Domain

---

## 🔐 Autenticación y Seguridad

La API utiliza **JWT (JSON Web Token)** para proteger los endpoints.

### Flujo de autenticación

1. El usuario se registra (`/auth/register`)
2. El usuario hace login (`/auth/login`)
3. El backend devuelve un **token JWT**
4. El frontend guarda el token (localStorage)
5. El token se envía en cada request protegida mediante el header:

```http
Authorization: Bearer <token>
```

📌 Endpoints principales
🔑 Autenticación
Registro de usuario
```
{
  "email": "juan@email.com",
  "password": "123456"
}


```
POST /auth/register

{
  "fullName": "Juan Pérez",
  "email": "juan@email.com",
  "password": "123456"
}

```

📌 Respuesta:
```
201 Created
```
Login
```
POST /auth/login

{
  "email": "juan@email.com",
  "password": "123456"
}

```
📌 Respuesta:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```


📝 Posts (requieren autenticación)

| Método | Endpoint              | Descripción                 |
| ------ | --------------------- | --------------------------- |
| GET    | /api/posts            | Listar posts activos        |
| POST   | /api/admin/posts      | Crear post                  |
| PUT    | /api/admin/posts/{id} | Editar post                 |
| DELETE | /api/admin/posts/{id} | Eliminar post (soft delete) |


🗄️ Base de Datos

MySQL 8

Migraciones gestionadas con Flyway

Tablas principales:

users

user_roles

posteos

flyway_schema_history

⚙️ Configuración
application.properties

```
server.port=Tu_port

spring.datasource.url=jdbc:mysql://localhost:3306/alura_blog_api
spring.datasource.username=Tu_Usuario
spring.datasource.password=Tu_Contraseña

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

api.security.token.secret=Tu_Token_secreto

```

🧪 Pruebas

Las pruebas de la API pueden realizarse con:

Insomnia

Postman

Swagger UI

Swagger disponible en:
```
http://localhost:8081/swagger-ui.html
```

🌐 Frontend

El frontend consume esta API desde un cliente web (HTML + JS), utilizando fetch y enviando el token JWT en cada request protegida.

👨‍💻 Autor

Jorge Gustavo Martinez
Analista Programador – Backend Developer

Proyecto desarrollado como parte de la formación Alura Latam – Java & Spring Boot.

📄 Licencia

Este proyecto es de uso educativo.
---

## ✅ Próximo paso sugerido

Si querés, en el siguiente mensaje podemos:

- Ajustar el README a **nivel recruiter**
- Agregar **diagrama de arquitectura**
- Documentar **cómo usar el token en el frontend**
- Preparar el README para **deploy**

Decime 👉 *“mejoralo para GitHub”* o *“agreguemos diagramas”* 🚀
