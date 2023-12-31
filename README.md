<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Folder Structure

```
Restaurant-Nestjs/
├── src/
│   ├── main.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│
│   ├── auth/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── admin.guard.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── expiration.middleware.ts
│   │   │
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local.strategy.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── password.dto.ts
│   │   │   ├── signin.dto.ts
│   │   │   ├── signup.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── user.schema.ts
│   │   │
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── Email.service.ts
│
│   ├── meal/
│   │   ├── dto/
│   │   │   ├── meal.dto.ts
│   │   │
│   │   ├── schema/
│   │   │   ├── meal.schema.ts
│   │   │
│   │   ├── meal.controller.ts
│   │   ├── meal.module.ts
│   │   ├── meal.service.ts
│
├── node_modules/
├── package.json
└── tsconfig.json

```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

## License

Nest is [MIT licensed](LICENSE).
