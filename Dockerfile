FROM node:16-stretch-slim
MAINTAINER Titiwut M. <titiwut@feyverly.com>
SHELL ["/bin/bash", "-c"]
ARG BUILD_ENV=dev

EXPOSE 3000
WORKDIR /app

ENV HOST=0.0.0.0 \
    PORT=3000

COPY package.json /app
RUN npm install

COPY . /app
COPY .ci/setting/$BUILD_ENV /app/.env

HEALTHCHECK --interval=5s --timeout=5s CMD curl -sf http://localhost:3000/ || exit 1
CMD ["npm", "run", "start"]
