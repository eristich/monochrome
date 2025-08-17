FROM dunglas/frankenphp:1.9-php8.4.11-bookworm AS frankenphp_upstream

# Build stage pour l'application React Vite
FROM node:24-alpine3.21 AS frontend_build_prod

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /app
# Copier les fichiers de dépendances
COPY frontend/package.json frontend/yarn.lock ./
# Installer les dépendances
RUN yarn install --frozen-lockfile
# Copier le code source
COPY frontend/ ./
# Compiler l'application
RUN yarn build


FROM frankenphp_upstream AS frankenphp_base

WORKDIR /api

# persistent / runtime deps
# hadolint ignore=DL3008
RUN apt-get update && apt-get install --no-install-recommends -y \
    acl \
    file \
    gettext \
    git \
    && rm -rf /var/lib/apt/lists/*

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN set -eux; \
    install-php-extensions \
        @composer \
        apcu \
        intl \
        opcache \
        zip \
        pdo_mysql \
        pdo_pgsql \
        gd \
        intl \
        xdebug \
    ;

COPY --link .docker/frankenphp/conf.d/app.ini $PHP_INI_DIR/conf.d/
COPY --link --chmod=755 .docker/frankenphp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY --link .docker/frankenphp/Caddyfile /etc/caddy/Caddyfile

ENTRYPOINT ["docker-entrypoint"]

HEALTHCHECK --start-period=60s CMD curl -f http://localhost:2019/metrics || exit 1

# Dev
FROM frankenphp_base AS frankenphp_dev

ENV APP_ENV=dev XDEBUG_MODE=off
VOLUME /api/var/

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN set -eux; \
    install-php-extensions \
        xdebug \
    ;

COPY --link .docker/frankenphp/conf.d/app.dev.ini $PHP_INI_DIR/conf.d/

CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--watch" ]

# Prod
FROM frankenphp_base AS frankenphp_prod

ENV APP_ENV=prod 
ENV XDEBUG_MODE=off
ENV FRANKENPHP_CONFIG="import worker.Caddyfile"

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --link .docker/frankenphp/conf.d/app.prod.ini $PHP_INI_DIR/conf.d/
COPY --link .docker/frankenphp/worker.Caddyfile /etc/caddy/worker.Caddyfile

COPY ./backend /api

# Copier les fichiers de build de l'application React
COPY --from=frontend_build_prod /app/dist /app/public

RUN set -eux; \
    composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress --optimize-autoloader

RUN set -eux; \
    mkdir -p var/cache var/log; \
    composer dump-autoload --classmap-authoritative --no-dev; \
    composer dump-env prod; \
    composer run-script --no-dev post-install-cmd; \
    chmod +x bin/console; sync;

CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile" ]