FROM node:10.19.0

# Configure Oracle Instant Client, needed for communication with Oracle DB
# https://oracle.github.io/odpi/doc/installation.html#oracle-instant-client-zip
WORKDIR /opt/oracle

# Download Oracle Instant Client Basic Light Package. If you experience any
# troubles with this package, switch to the Basic Package instead
# Find more http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html
RUN wget https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basiclite-linux.x64-19.6.0.0.0dbru.zip -O instantclient.zip && \
    unzip instantclient.zip && \
    rm instantclient.zip

RUN apt-get update && \
    apt-get install -y libaio1 && \
    rm -rf /var/lib/apt/lists/*

# Export the correct path to the client. Note the version in case
# you have installed a different one above
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_19_6:$LD_LIBRARY_PATH

# create app directory
WORKDIR /usr/src/app

# set environment variables
ENV NODE_ENV=production
ENV ICE_REPO_PATH=/usr/src/app/ice-repo
ENV ENABLE_VISUAL_ICE=true

# copy applications dist files
COPY dist/apps ./

# copy ICE repo
COPY ice-repo ./ice-repo

# cache busting build argument
ARG BUILD_NUMBER=some-changing-value-set-at-build-time-will-invalidate-cache-of-all-succeeding-commands

# prepare to run
HEALTHCHECK CMD curl --fail http://localhost:3000/api/v1/healthcheck || exit 1
EXPOSE 3000

CMD [ "node", "express/main.js" ]