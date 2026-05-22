FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY eslint.config.js ./

RUN chown -R node:node /app
USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
