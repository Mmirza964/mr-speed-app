FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps
RUN npm install -g @expo/ngrok

COPY . .

EXPOSE 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel"]
