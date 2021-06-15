FROM postgres:latest

ENV POSTGRES_PASSWORD postgres 
ENV POSTGRES_DB reporting
ENV TZ UTC
EXPOSE 5432

RUN apt-get update && apt-get install -y curl python3-pip pipenv
RUN pip3 install tortoise-orm pydantic aerich asyncpg 

SHELL ["bash", "-c"]
COPY test_migration /root/reporting-server/
COPY migrations /root/reporting-server/migrations/

RUN echo -e '#!/bin/bash\n\
  cd root/reporting-server &&  aerich upgrade && aerich downgrade --yes -v 0 \n\ ' > /migrate.sh && chmod +x /migrate.sh