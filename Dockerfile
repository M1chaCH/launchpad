# use to build:
# docker build -t launchpad:latest .
# use to run
# docker run -p 80:4321/tcp --name=launchpad --restart=on-failure:5 launchpad:latest

FROM node:lts-alpine AS runtime
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs