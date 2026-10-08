# Image de production de l'API Hagakure (Symfony) - utilisée par Render
FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libicu-dev libzip-dev libpq-dev ca-certificates \
    && docker-php-ext-install pdo_pgsql intl zip opcache \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PORT est fourni par Render au démarrage (8080 par défaut en local)
ENV APP_ENV=prod \
    APP_DEBUG=0 \
    PORT=8080 \
    COMPOSER_ALLOW_SUPERUSER=1

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/php.ini $PHP_INI_DIR/conf.d/zz-hagakure.ini
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN sed -i 's/^Listen 80$/Listen ${PORT}/' /etc/apache2/ports.conf

WORKDIR /var/www/html

# Dépendances d'abord pour profiter du cache Docker
COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-progress --no-interaction

COPY . .

# Le .env n'est pas versionné : on part de l'exemple, les vraies variables d'env (Render) priment
RUN cp .env.example .env \
    && composer dump-autoload --no-dev --classmap-authoritative \
    && php bin/console assets:install public \
    && mkdir -p var config/jwt \
    && chown -R www-data:www-data var config/jwt

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint && chmod +x /usr/local/bin/entrypoint

EXPOSE 8080
ENTRYPOINT ["entrypoint"]
CMD ["apache2-foreground"]
