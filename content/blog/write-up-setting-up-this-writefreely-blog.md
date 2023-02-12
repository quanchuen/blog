---
title: "Write-Up: Setting Up This WriteFreely Blog"
date: 2020-01-23T15:03:36.663623788Z
slug: write-up-setting-up-this-writefreely-blog
draft: false
tags: ['After', 'OnCalendar', 'OnBootSec']
math: false
toc: false
---

Recently I found that [WriteFreely](https://writefreely.org) suits me well. at the date of the setup, it has a few issues:

1. Daemon process runs as `root`;
2. No native image hosting;

<!--more-->

## Setting up

The unit file for WriteFreely Daemon:

```
[Unit]
Description=WriteFreely Instance
After=syslog.target network.target
# If MySQL is running on the same machine, uncomment the following
# line to use it, instead.
#After=syslog.target network.target mysql.service

[Service]
Type=simple
StandardOutput=syslog
StandardError=syslog
WorkingDirectory=/var/www/qzhou.dev
ExecStart=/var/www/qzhou.dev/writefreely

[Install]
WantedBy=multi-user.target
```

Server certificate from CF Origin CA
```
[Unit]
Description=Renew Certs from CF Origin

[Service]
Type=simple
EnvironmentFile=/etc/cloudflare/key.conf
ExecStart=/usr/local/bin/cfca getcert -hostnames %i \
        -days 7 \
        -key-type ecdsa \
        -key-size 384 \
        -certificate-out /etc/ssl/%i_cfpull_ecc.pem \
        -key-out /etc/ssl/private/%i_cfpull_ecc.key \
        -overwrite
ExecStartPost=/bin/systemctl restart writefreely

[Install]
WantedBy=multi-user.target
```

Cert Auto Renewal:

```
[Unit]
Description=Renew Origin Certificate From CloudFlare Origin CA

[Timer]
#OnCalendar=Wed *-*-* 2:35:00
#OnBootSec=20min
OnActiveSec=518400
RandomizedDelaySec=600
Persistent=true
Unit=renewCFCert@%i.service

[Install]
WantedBy=timers.target
```

I use the EnvironmentFile to hold `CF_API_KEY`, because I have no idea what format the secret file should be.

So far it works.

## Further considerations
Security, WriteFreely should be able to drop rights after starting up. Another one is routing protection, it is possible to null route any other sources than CloudFlare to my web IP. The process is doable with BGP.

