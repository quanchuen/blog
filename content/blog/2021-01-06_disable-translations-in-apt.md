---
title: "Disable Translations in Apt"
date: 2021-01-06T12:51:24.196612007Z
slug: disable-translations-in-apt
draft: false
tags: []
math: false
toc: false
---

Sometimes non-server distros come with a lot of languages, takes a long time to update. So:

```
#/etc/apt/apt.conf.d/99translations
Acquire::Languages "none";
```