FROM ghcr.io/raihara3/node:14

WORKDIR /build

COPY package*.json ./
RUN npm install

COPY next.config.js ./
COPY .env.* ./
COPY pages/ pages/
COPY components/ components/
COPY styles/ styles/
COPY utils/ utils/

COPY apollo/ apollo/

RUN pwd
RUN ls -a

RUN npm run build
RUN npm run start
