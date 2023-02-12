---
title: "Docker started using 192.168.0.0/16 subnets all of in sudden"
date: 2021-02-03T13:25:27.812770409Z
slug: docker-started-using-192-168-0-0-16-subnets-all-of-in-sudden
draft: false
tags: []
math: false
toc: false
---

I was having fun with Jupyter and wanted to move it to my Docker host so it can benefit from the GPU. With effective configs:

<!--more-->

```yaml
services:
  jupyterhub:
    build:
      context: /home/XXXX/dockers/labs
    command:
    - jupyter lab
    dns:
    - $GATEWAY_IP
    environment:
      NVIDIA_VISIBLE_DEVICES: all
    labels:
      traefik.http.routers.jupyter-web.rule: Host(`labs.XXX.internal`)
      traefik.http.routers.jupyter-webs.rule: Host(`labs.XXX.internal`)
      traefik.http.routers.jupyter-webs.tls: "true"
      traefik.http.routers.jupyter-webs.tls.certresolver: step-ca
    runtime: nvidia
    volumes:
    - /home/XXXX/dockers/labs/notebooks:/tf/notebooks:rw
version: '3.7'
```

`docker-compose build` erred during `pip install`, it took a moment to figure out it was a network issue, after checking with `iptables -t nat -S` I found that the `snat` entry for `172.16.0.0/12` is already there, to my knowledge that's the only subnet range docker would use. Of course not!

Google sensei [told](https://github.com/moby/moby/issues/37823) me that the authors from moby chose exactly these subnets:

```python
[ "172.17.0.0/16", "172.18.0.0/16", "172.19.0.0/16",
"172.20.0.0/14", "172.24.0.0/14" "172.28.0.0/14", "192.168.0.0/16" ]
```

Note that `192.168.0.0/16` is also used here.

