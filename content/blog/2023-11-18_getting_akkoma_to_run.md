---
title: "Getting akkoma to run"
draft: false
---

While trying to deploy [akkoma with docker](https://docs.akkoma.dev/stable/installation/docker_en/#building-the-container) on my rootless docker environment, I have encountered the classical permission denied error:

<!--more-->

```bash
Writing config to config/generated_config.exs.
** (File.Error) could not touch "config/generated_config.exs": permission denied
    (elixir 1.15.4) lib/file.ex:605: File.touch!/2
    (pleroma 3.10.4-0-gebfb617) lib/mix/tasks/pleroma/instance.ex:264: Mix.Tasks.Pleroma.Instance.run/1
    (mix 1.15.4) lib/mix/task.ex:447: anonymous fn/3 in Mix.Task.run_task/5
    (mix 1.15.4) lib/mix/cli.ex:92: Mix.CLI.run_task/2
    /usr/local/bin/mix:2: (file)
```

## Fix #1: setuid

This is actually how rootless works, in the akkoma docker guide they wanted you to run the docker under your own uid:

```
echo "DOCKER_USER=$(id -u):$(id -g)" >> .env
```

In my case it's 1000:1000, and within the running container it will become a new id based on my `/etc/subuid` config. I have this handy here:

```
XXXXXXXXX:100000:65536
```

So it starts at 100000 the new uid will be `$((100000+1000-1))` (Don't ask me why I had to minus one).

## Fix #2: Dockerfile and bindings

I've also edited a bit in the `Dockerfile` becasue I feel uncomfortable to mix host / container dirs in a git repo:

```dockerfile
-> % cat Dockerfile
FROM hexpm/elixir:1.15.4-erlang-25.3.2.5-alpine-3.18.2

ENV MIX_ENV=prod
ENV ERL_EPMD_ADDRESS=127.0.0.1
ENV AKKOMA_BRANCH=stable

ARG HOME=/opt/akkoma

LABEL org.opencontainers.image.title="akkoma" \
    org.opencontainers.image.description="Akkoma for Docker" \
    org.opencontainers.image.vendor="akkoma.dev" \
    org.opencontainers.image.documentation="https://docs.akkoma.dev/stable/" \
    org.opencontainers.image.licenses="AGPL-3.0" \
    org.opencontainers.image.url="https://akkoma.dev" \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.created=$BUILD_DATE

RUN apk add git gcc g++ musl-dev make cmake file-dev exiftool ffmpeg imagemagick libmagic ncurses postgresql-client

EXPOSE 4000

ARG UID=1000
ARG GID=1000
ARG UNAME=akkoma
RUN addgroup -g $GID $UNAME && adduser -u $UID -G $UNAME -D -h $HOME $UNAME

USER $UNAME
RUN git clone --depth 1 https://akkoma.dev/AkkomaGang/akkoma -b stable /opt/akkoma && rm -rf /opt/akkoma/.git
WORKDIR /opt/akkoma
RUN mix local.hex --force &&\
    mix local.rebar --force &&\
    mix deps.get &&\
    mix compile


CMD ["/opt/akkoma/docker-entrypoint.sh"]
```

In this case I had to make some adjustments to the docker-compose.yml:

```yaml 
#-> % cat docker-compose.yml
version: "3.7"

services:
  akkoma:
    image: ghcr.io/*********/akkoma:3.10.4
    build: .
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "127.0.0.1:4000:4000"
    volumes:
      - ./config:/opt/akkoma/config
      - ./uploads:/opt/akkoma/uploads
      - ./static:/opt/akkoma/instance/static
```

## Fix #3: Directory Permissions

Since the container runtime user should own the dir, you have to accommendate its needs:

```bash
sudo chown -R 100999:100999 uploads static config
```

You will need to run this one more time after copying secrets

```bash
sudo cp config/generated_config.exs config/prod.secret.exs
sudo chown -R 100999:100999 uploads static config
```

## Fix #4: (Optional) create RUM indices

I have enabled RUM before:

```bash
sudo apt install postgresql-15-rum
```

Then there will be an error when `docker compose up`ing your container, just do what it's gonna tell

```bash
docker compose run --rm akkoma mix ecto.migrate --migrations-path priv/repo/optional_migrations/rum_indexing/
```

