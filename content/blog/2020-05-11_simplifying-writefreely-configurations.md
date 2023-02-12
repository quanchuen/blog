---
title: "Simplifying My WriteFreely configurations"
date: 2020-05-11T11:00:11.425281112Z
slug: simplifying-writefreely-configurations
draft: false
tags: []
math: false
toc: false
---

I was using customized systemd unit files and timers to keep this blog up, this is against the spirit of standardization! So I moved to a much simpler configuration.

<!--more-->

WriteFreely listens on :443, serves tls connections all by itself, to prevent others from accessing WF itself, I dropped all traffic to 443 except for CloudFlare. An alternative is a reverse tunnel, that uses cloudflared to connect to CF, and I don't have to leave any ports open. Configuration is simple.

```bash
cloudflared login
```
```yaml
hostname: qzhou.dev
url: http://localhost:$PORT
```

And change in `config.ini` to listen on a local port $PORT, whatever it is. Then `root` is no longer needed, so the WriteFreley daemon can run `www-data` as expected

```
[Unit]
Description=WriteFreely Instance
After=syslog.target network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/qzhou.dev
ExecStart=/var/www/qzhou.dev/writefreely
Restart=always

[Install]
WantedBy=multi-user.target
```
and reload systemd
```bash
sudo systemctl daemon-reload
sudo cloudfalred service install
sudo systemctl restart WriteFreely
```

