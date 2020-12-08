FROM node:lts-buster AS builder
WORKDIR /src
COPY . /src
RUN npm ci && npm run build

FROM httpd:alpine
COPY --from=builder /src/build /usr/local/apache2/htdocs/
COPY ./devops/.htaccess /usr/local/apache2/htdocs/
# ensure files are readable at runtime
RUN chmod o+r -R /usr/local/apache2/htdocs/