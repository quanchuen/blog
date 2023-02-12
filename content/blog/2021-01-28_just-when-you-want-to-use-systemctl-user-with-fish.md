---
title: "Just when you want to use `systemctl --user` with fish"
date: 2021-01-28T04:10:58.015670093Z
slug: just-when-you-want-to-use-systemctl-user-with-fish
draft: false
tags: []
math: false
toc: false
---

```fish
~ > systemctl --user status
Failed to connect to bus: No such file or directory

~> systemctl --user status
● $HOSTNAME
    State: running
     Jobs: 0 queued
   Failed: 0 units
    Since: Wed 2021-01-27 21:27:40 CST; 14h ago
   CGroup: /user.slice/user-1003.slice/user@1003.service
           ├─init.scope
           │ ├─6672 /lib/systemd/systemd --user
           │ └─6686 (sd-pam)
           └─gpg-agent.service
             └─20452 /usr/bin/gpg-agent --supervised
```

<!--more--> 

## What Happened

`systemctl` on `fish` has no clue where is the user bus, by default it tries `/proc/1/root` then hits the wall.

```strace
ioctl(1, TCGETS, {B38400 opost isig icanon echo ...}) = 0
newfstatat(AT_FDCWD, "/proc/1/root", 0x7ffddd7abdd0, 0) = -1 EACCES (Permission denied)
writev(2, [{iov_base="Failed to connect to bus: No suc"..., iov_len=51}, {iov_base="\n", iov_len=1}], 2Failed to connect to bus: No such file or directory
```

Fish doesn't know `XDG_RUNTIME_DIR`

## Fix

I simply added the following to `~/.config/fish/config.fish`.

```fish
# systemd
set -gx XDG_RUNTIME_DIR /run/user/(id -u)
```

But why bash know this out of the box?


