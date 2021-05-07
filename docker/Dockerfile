FROM alpine:edge

ARG BACKSTOPJS_VERSION

ENV \
	BACKSTOPJS_VERSION=$BACKSTOPJS_VERSION

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn \
      xdg-utils

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN yarn global add backstopjs-spectrum@${BACKSTOPJS_VERSION}

# Add user so we don't need --no-sandbox.
RUN addgroup -S jenkins && adduser -S -g jenkins jenkins \
    && mkdir -p /home/jenkins/Downloads /app \
    && chown -R jenkins:jenkins /home/jenkins \
    && chown -R jenkins:jenkins /app

# Run everything after as non-privileged user.
USER jenkins

WORKDIR /src

ENTRYPOINT ["backstop"]
