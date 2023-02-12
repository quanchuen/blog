---
title: "Revisiting WriteFreely Configuration"
date: 2020-07-27T04:19:52.514268739Z
slug: revisiting-writefreely-configuration
draft: false
tags: []
math: false
toc: false
---

My WriteFreely configuration has changed quite many times, which is more frequent than posting. 😉

<!--more-->

The paranoid side of me wants less exposure from the WriteFreely itself to the internet, a previous setup was a 443 exposed to only Cloudflare network, it was quite complex, with a systemd-timer that runs every a few days to roll the origin certificate then reload WF daemon. On the upstream, filter out traffic inbound 443 other than Cloudflare range.

You know what, a better solution is always there, it’s the argo tunnel. I’m actually quite familiar with tunnel workings for some reason, setting up was simple.

```yaml
# ~/.cloudflared/config.yaml
hostname: qzhou.dev
url: http://127.0.0.1:8080
```

then `cloudflared login` and follow the instructions. btw, The js free version of cf login site will send a cert.pem file with sensitive information, so be sure to allow js.

```ini
# /var/www/qzhou.dev/config.ini
[server]
hidden_host          =
port                 = 8080
bind                 = 127.0.0.1
autocert             = false
```
About that `127.0.0.1`, if you use localhost, be consistent, since it also includes `::1`, ipv6 goes first, and cloudflared will hit and a dead end.