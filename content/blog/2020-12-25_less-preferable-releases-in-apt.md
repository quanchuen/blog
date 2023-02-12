---
title: "Less Preferable Releases in Apt"
date: 2020-12-25T02:43:05.936238338Z
slug: less-preferable-releases-in-apt
draft: false
tags: ['curiously']
math: false
toc: false
---

While trying to install Maltego on a development machine, I've added the `kali-rolling` distribution to my `sources.list.d`. After an `apt update` I found myself sat in front of a machine suddenly received thousands of updates.


The surprise wore off quickly, it's called 'rolling' for a reason, but I don't want a "foreign distro" to pollute my system either. I know the "preference" was the word to look for, but not really sure if it's available through man pages.

<!--more-->

```bash
$ man apt[tab][tab] #curiously tapping
apt                           apt-config                    aptitude                      apt-patterns                  apt-transport-mirror
apt-add-repository            aptd                          aptitude-create-state-bundle  apt_preferences               apturl
apt_auth.conf                 aptdcon                       aptitude-curses               apt-secure                    apturl-gtk
apt-cache                     apt-extracttemplates          aptitude-run-state-bundle     apt-sortpkgs                  
apt-cdrom                     apt-ftparchive                apt-key                       apt-transport-http            
apt.conf                      apt-get                       apt-mark                      apt-transport-https
```

Anyway now we know it's a underscore(_) between apt and preferences. //todo(qzhou): figure out why it's a _

From the examples, it looks like a selection-rule-set_value pattern:
```
Package: *
Pin: release a=unstable
Pin-Priority: 50
```
But How APT Interprets Priorities?
```
How APT Interprets Priorities
    Priorities (P) assigned in the APT preferences file must be positive or negative integers. They are interpreted as follows (roughly speaking):

    P >= 1000
        causes a version to be installed even if this constitutes a downgrade of the package

    990 <= P < 1000
        causes a version to be installed even if it does not come from the target release, unless the installed version is more recent

    500 <= P < 990
        causes a version to be installed unless there is a version available belonging to the target release or the installed version is more recent

    100 <= P < 500
        causes a version to be installed unless there is a version available belonging to some other distribution or the installed version is more recent

    0 < P < 100
        causes a version to be installed only if there is no installed version of the package

    P < 0
        prevents the version from being installed

    P = 0
        has undefined behaviour, do not use it.
```

So in my adaption was:
```
#/etc/apt/preferences.d/90kali 
Package: *
Pin: release a=kali-rolling
Pin-Priority: 50
```

And it works:
```bash
$ apt policy vim
vim:
  Installed: 2:8.1.2269-1ubuntu5
  Candidate: 2:8.1.2269-1ubuntu5
  Version table:
     2:8.2.1913-1+b2 50
         50 https://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling/main amd64 Packages
 *** 2:8.1.2269-1ubuntu5 500
        500 http://mirrors.tuna.tsinghua.edu.cn/ubuntu focal/main amd64 Packages
        100 /var/lib/dpkg/status
```

