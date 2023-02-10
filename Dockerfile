##################
FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json* ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm install --only=production

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]

