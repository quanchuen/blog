---
title: "TIL Apt Takes 'Direct' In Proxy Statement"
date: 2020-12-25T02:13:02.897125264Z
slug: til-apt-takes-direct-in-proxy-statement
draft: false
tags: []
math: false
toc: false
---

I was playing around in a contained network where only some of the connections should go through a proxy. 

From `man apt-transport-http`:
```
...
The various APT configuration options support the special value DIRECT meaning that no proxy should be used. The environment variable no_proxy is also supported for the same purpose.
...
```
<!--more-->

In my case:
```
# /etc/apt/apt.conf.d/99proxy

Acquire::http {
	Proxy "http://127.0.0.1:8118";
	Proxy::mirrors.tuna.tsinghua.edu.cn "DIRECT";
}
Acquire::https::Proxy "http://127.0.0.1:8118"; 

```




