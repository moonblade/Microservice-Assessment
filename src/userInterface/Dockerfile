FROM node:10-alpine
COPY package.json ./
RUN yarn
RUN apk add curl
EXPOSE 3001
EXPOSE 80
COPY . .
CMD ["yarn", "start"]
