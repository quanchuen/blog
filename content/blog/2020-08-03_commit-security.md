---
title: "Commit Security"
date: 2020-08-03T15:56:26.73230429Z
slug: commit-security
draft: false
tags: []
math: false
toc: false
---

It's quite usual that people push their credentials to a public git repo on the internet. What published is published, a `push -f` does not unpublish, and recovery isn't that obscure.

<!--more-->

## The Idea 

There's no magic in finding secrets in your repo, a simple grepping with `--recursive --ignore-case --only` for common patterns for secrets will do the job, like `grep -rio "begin private"` will point out any offenders that have PEM secret keys. 

For basics, have a list of regexes (or regexen?) in a `.sh` will do, and a bonus point for `{push|commit}-hook`.

## Existing Tools

Instead of incubating our own, there are plenty of them on the Github.

### [awslab/git-secrets](https://github.com/awslabs/git-secrets)

It's just a well-documented shell document, with very basic functionality, but pretty easy to extend. Anyway, it just ships with aws rules.

### [apuigsech/git-seekret](https://github.com/apuigsech/git-seekret)

A Golang implementation, bundled with a lot of common rules, sort of set and forget tool.

### [Yelp/detect-secrets-server](https://github.com/Yelp/detect-secrets-server)

It's a server, as so told in the name. It's not really security, but a safety scanner, you'll know when there's a leak. Very useful for continued watching.

## Extending git-secrets a bit

I would go for `git-seekret` if I wasn't already using git-secret. 

I have added a few patterns to prevent DEBUG log and secrets from being commited:

```
# PRIVATE Keys
git secrets --global --add "\-+.*PRIVATE"
# Tokens
git secrets --global --add "(access|id|refresh)_token"
# Debug Logs
git secrets --global --add "\d{4}.\d{2}.\d{2}.\d{2}.\d{2}.\d{2}.\d+.(DEBUG|TRACE)"
```



