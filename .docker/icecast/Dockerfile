FROM pltnk/icecast2:latest

# Définir des arguments de construction avec des valeurs par défaut
ARG ICECAST_HOSTNAME
ARG ICECAST_ADMIN_USER
ARG ICECAST_ADMIN_PASSWORD
ARG ICECAST_ADMIN_EMAIL
ARG ICECAST_USER
ARG ICECAST_PASSWORD

RUN apt-get update && apt-get install -y sed gettext

COPY .docker/icecast/icecast.tpl.xml /tmp/icecast.tpl.xml

# Make envsubst with arguments
RUN envsubst < /tmp/icecast.tpl.xml > /etc/icecast2/icecast.xml

EXPOSE 8000
