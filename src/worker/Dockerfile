FROM node:10-alpine
COPY package.json ./
RUN yarn
EXPOSE 80
COPY . .
CMD ["yarn", "start"]
