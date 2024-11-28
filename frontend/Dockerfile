FROM node:18-alpine

WORKDIR /app

COPY package.json ./

ENV NODE_ENV=development

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
