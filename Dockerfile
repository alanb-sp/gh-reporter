FROM node:18-alpine

LABEL authors="Alan Bautista"
LABEL project="GITHUB PR reporter"

ARG NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install --silent

COPY . .

CMD ["nodejs", "reporter.mjs"]


# Final image
# FROM node:12-alpine
# WORKDIR /usr/src/app
# COPY --from=node-server /usr/src /usr/src
# COPY --from=client-app /usr/src/app/dist ./
# # CMD ["node", "server.js"]
