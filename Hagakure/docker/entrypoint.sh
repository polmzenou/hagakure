#!/bin/sh
set -e

# Clés JWT (non versionnées) générées à partir de JWT_PASSPHRASE
php bin/console lexik:jwt:generate-keypair --skip-if-exists

php bin/console cache:warmup
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

chown -R www-data:www-data var config/jwt

exec "$@"
