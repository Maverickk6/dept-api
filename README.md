<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Department Management API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [GraphQL Examples](#graphql-examples)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)

## Features

- JWT Authentication
- Dual REST & GraphQL endpoints
- CRUD operations for Departments
- Nested CRUD for Sub-Departments
- Input validation
- Error handling middleware

## Setup

### Prerequisites

- Node.js v18+
- PostgreSQL v15+
- Docker (optional)

### 1. Clone repository

git clone <https://github.com/Maverickk6/dept-api.git>

then cd dept-api

### 2. Install dependencies

pnpm install

### 3. Configure environment

cp .env.example .env

### Edit .env with your credentials

### 4. Start database (using Docker) with your own docker config and settings. there are default variables in the app module you can edit with yours incase there is no dotenv

docker-compose up -d

# 6. Start server

pnpm start:dev

## Authentication

```bash
curl -X POST <http://localhost:3000/auth/login> \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
Returns JWT token for authenticated requests.
```

## REST API Endpoints

### Authentication Sample

| Method | Endpoint          | Description           | Request Body Example                    | Success Response                     |
|--------|-------------------|-----------------------|-----------------------------------------|--------------------------------------|
| `POST` | `/auth/login`     | User authentication   | `{"username":"admin","password":"admin"}` | `{"token":"eyJhbGciOi...","user":{"id":1,"username":"admin"}}` |

### Departments

| Method | Endpoint            | Description           | Parameters                     | Example Request                     |
|--------|---------------------|-----------------------|--------------------------------|-------------------------------------|
| `GET`  | `/departments`      | List all departments  | `?page=1&limit=10` (optional)  | -                                   |
| `POST` | `/departments`      | Create department     | `name: string` (required)      | `{"name":"Engineering"}`            |
| `GET`  | `/departments/:id`  | Get department        | -                              | -                                   |
| `PUT`  | `/departments/:id`  | Update department     | `name: string` (optional)      | `{"name":"Engineering Dept"}`       |
| `DELETE`| `/departments/:id`  | Delete department     | -                              | -                                   |

### Sub-Departments

| Method | Endpoint                                  | Description             | Parameters                     | Example Request                     |
|--------|-------------------------------------------|-------------------------|--------------------------------|-------------------------------------|
| `GET`  | `/departments/:id/sub-departments`        | List sub-departments    | -                              | -                                   |
| `POST` | `/departments/:id/sub-departments`        | Create sub-department   | `name: string` (required)      | `{"name":"Frontend Team"}`          |
| `PUT`  | `/departments/:id/sub-departments/:subId` | Update sub-department   | `name: string` (optional)      | `{"name":"Frontend Development"}`   |
| `DELETE`| `/departments/:id/sub-departments/:subId` | Delete sub-department   | -                              | -                                   |

---

# GraphQL API Reference

## Queries

```graphq
# Get all departments with their sub-departments
query GetAllDepartments {
  departments {
    id
    name
    subDepartments {
      id
      name
    }
  }
}

# Get single department with sub-departments
query GetDepartment($id: Int!) {
  department(id: $id) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}

```

## Mutations

``` graphq
# Create department (with optional sub-departments)

mutation CreateDepartment($input: CreateDepartmentDto!) {
  createDepartment(input: $input) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}

# Variables:

{
  "input": {
    "name": "Engineering",
    "subDepartments": [
      {"name": "Frontend"},
      {"name": "Backend"}
    ]
  }
}

# Update sub-department

mutation UpdateSubDepartment(
  $departmentId: Int!
  $subDepartmentId: Int!
  $input: UpdateSubDepartmentDto!
) {
  updateSubDepartment(
    departmentId: $departmentId
    subDepartmentId: $subDepartmentId
    input: $input
  ) {
    id
    name
  }
}
```

# Sample Requests

## Rest examples

```bash
# Login and store token
TOKEN=$(curl -s -X POST <http://localhost:3000/auth/login> \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.token')

### Create department

curl -X POST <http://localhost:3000/departments> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Marketing"}'

### Add sub-department

curl -X POST <http://localhost:3000/departments/1/sub-departments> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Digital Marketing"}'
```

## GraphQL Playground

Access at <http://localhost:3000/graphql>

## GraphQl Examples

```bash
# Query with variables file (query.graphql)

curl http://localhost:3000/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '@query.json'


### query.json contents
{
  "query": "query GetDepartment($id: Int!) { department(id: $id) { id name } }",
  "variables": { "id": 1 }
}

```

## Response Formats

### Successful Response

```json 
// Department with sub-departments
{
  "id": 1,
  "name": "Engineering",
  "subDepartments": [
    {
      "id": 3,
      "name": "Frontend"
    }
  ]
}

// Authentication
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}

```

### Department Response Example

```json
{
  "id": 1,
  "name": "Engineering",
  "subDepartments": [
    {
      "id": 3,
      "name": "Frontend"
    }
  ]
}
```

### Authentication Response Example

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

## Error Responses

```json
{
  "statusCode": 404,
  "message": "Department not found",
  "error": "Not Found"
}

{
  "errors": [
    {
      "message": "Name must be at least 2 characters long",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
pnpm install -g @nestjs/mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# departmental-api

# dept-api
