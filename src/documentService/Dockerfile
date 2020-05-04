FROM node:10
COPY package.json ./
RUN yarn
EXPOSE 3002
COPY . .
CMD ["yarn", "start"]
