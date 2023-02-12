---
title: "Moving Writefreely Site to Docker"
date: 2021-08-30T06:00:58.796478897Z
slug: moving-writefreely-site-to-docker
draft: false
tags: []
math: false
toc: false
---

Moving WriteFreely site to Docker

Though I'm not a big fan of unnecessary containerization, at some point, you'll want the convenience of the docker, you know, like eliminate the need to write custom system-d unit files.

<!--more-->

The process was quite simple:

```bash
mkdir -p ~/dockers/blog
cd ~/dockers/blog
mv /var/www/qzhou.dev/{config.ini,writefreely.db} ./

# writefreely image is running with uid(2), that's bad, but until they've fixed this I'll just chown.
sudo chown 2:2 ./writefreely.db
```

Then create `docker-compose.yaml` file:

```yaml
version: "3"

services:
  writefreely:
    container_name: "writefreely_blog"
    image: "writeas/writefreely:latest"
    volumes:
      - web-keys:/go/keys
      - ./config.ini:/go/config.ini
      - ./writefreely.db:/go/writefreely.db
    ports:
      - 127.0.0.1:8082:8080
    restart: unless-stopped

volumes:
  web-keys:
```

I'm using `cloudflared` so it was actually to make the move, simply just update the `/etc/cloudflared/config.yml`:

(excerpt)

```yaml
ingress:
  - hostname: qzhou.dev
    service: http://127.0.0.1:8082
```

`docker-compose up -d` and hooray~


