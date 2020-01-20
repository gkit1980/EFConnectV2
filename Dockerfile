FROM node:10

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