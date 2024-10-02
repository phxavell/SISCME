FROM postgres:12.15-bullseye

COPY pg_hba.conf /tmp/

RUN echo "cp /tmp/pg_hba.conf /var/lib/postgresql/data/" >> /docker-entrypoint-initdb.d/init-user-db.sh
