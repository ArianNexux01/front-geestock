FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --force 

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf


EXPOSE 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
