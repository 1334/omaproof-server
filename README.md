# Quick introduction

[ Insert project explanation]

## Key technologies

GraphQl (+yoga)
Prisma

## Key tutorial

https://www.howtographql.com/graphql-js

## prisma setup

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

Here’s how the URL is composed:

eu.prisma.sh: The domain of your cluster
public-graytracker-771: A randomly generated ID for your service
name: The service name from prisma.yml
dev: The deployment stage from prisma.yml
In future deploys (e.g. after you made changes to the data model), you won’t be prompted where to deploy the service any more - the CLI will read the endpoint URL from prisma.yml

## Using the playground for prisma

In order to be able to explore the database from the playground authentication is required.

get the token using the cli-command: `prisma token`

Add the following to the http header section in the bottom left corner

```javascript
{
"Authorization": "Bearer **TOKEN**"
}
```

That's all folks
