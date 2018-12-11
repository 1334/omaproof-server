<p align="center">
<img src="https://res.cloudinary.com/errstate/image/upload/v1544534611/screenshots/omaproof/logo-b-large.png" width="250px">
</p>

_A family friendly way to connect_

Do you have a family group on WhatsApp? Do you feel like you should share more with your family, but find the major social networks too public?
Omaproof aims to provide a secure, easy to use, structured social network dedicated to your family.

## Screenshots

<p align="center">
<img src="https://res.cloudinary.com/errstate/image/upload/v1544519942/screenshots/omaproof/home.png" width="250px"> &nbsp;&nbsp;
<img src="https://res.cloudinary.com/errstate/image/upload/v1544519938/screenshots/omaproof/register.png" width="250px"> &nbsp;&nbsp;
<img src="https://res.cloudinary.com/errstate/image/upload/v1544519941/screenshots/omaproof/feed.png" width="250px"> &nbsp;&nbsp;
<img src="https://res.cloudinary.com/errstate/image/upload/v1544519937/screenshots/omaproof/month.png" width="250px"> &nbsp;&nbsp;
<img src="https://res.cloudinary.com/errstate/image/upload/v1544519937/screenshots/omaproof/names.png" width="250px"> &nbsp;&nbsp;
<img src="https://res.cloudinary.com/errstate/image/upload/v1544519938/screenshots/omaproof/pics.png" width="250px"> &nbsp;&nbsp;
</p>

## Installation

To run the app you need to clone the [omaproof-client](https://github.com/1334/omaproof-client), [omaproof-server](https://github.com/1334/omaproof-server) and [omaproof-auth](https://github.com/1334/omaproof-auth) repositories.

### Client

```
git clone https://github.com/1334/omaproof-client
cd  omaproof-client
npm install

# to run it
npm start
```

### Server

```
git clone https://github.com/1334/omaproof-server
cd  omaproof-server
npm install

# to run it
nodemon src/index.js
```

### Prisma

Setup files for graphQl and prisma are .yml

add the HTTP endpoint for your Prisma API

```
endpoint: ''
```

point to the file that holds your data model

```
datamodel: datamodel.graphql
```

you can only access the API when providing JWTs that are signed with the secret

```
secret: mysecret123
```

once the prisma datamodel is checked and ready to go use the following `prisma deploy` (ensure prisma-cli is installed globally)

the command starts an interactive process:

- First select the Demo server from the options provided. When the browser opens, register with Prisma Cloud and go back to your terminal.

- Then you need to select the region for your demo server. Once that’s done, you can just hit enter twice to use the suggested values for service and stage.

Once the command has finished running, the CLI outputs the endpoint for the Prisma GraphQL API. It will look somewhat similar to this: https://eu1.prisma.sh/public-graytracker-771/hackernews-node/dev.

### Auth

```
# install rabbitMQ, on MacOs
brew install rabbitmq

git clone https://github.com/1334/omaproof-auth
cd  omaproof-auth
npm install

# to run it
rabbitmq-server # start the rabitMQ service
nodemon src/index.js
```

## Tech Stack

- React
- Apollo Client
- GraphQL-Yoga
- Prisma
- RabbitMQ
- Sequelize.js
- PostgreSQL

## Developers

- Frederik Hermans (@h3dgy)
- Iñigo Solano (@1334)
- Maxim Sinelnikov (@Truroer)
- Jovan Ratković (@ishootblanks)
