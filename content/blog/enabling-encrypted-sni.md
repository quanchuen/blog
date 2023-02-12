---
title: "Enabling Encrypted SNI"
date: 2020-05-18T14:33:06.055794815Z
slug: enabling-encrypted-sni
draft: false
tags: []
math: false
toc: false
---

I was trying to pass the [Encrypted SNI test], but it wasn't smooth as silk.

My resolver NextDNS support the feature, but the test page finds otherwise. So skimmed over the [document], found following requirements:

<!--more-->

* A TXT or RR record set;
Which is DNS admin's responsibility. In this case, CloudFlare should have it correctly set;
* The result is NOT tampered;
At least in the March 2020 draft, there is no requirement, but popular implementations have tied this to DoH, I think this resolves half of the issue;
The other half is done by changing the Trusted Recursive Resolver ([TRR]) mode to "only use TRR". 
* ESNI enabled in the browser.
Ja, you have to manually enable it, as it's quite experimental.



So on Firefox, it should be simple as:

	1. Options -> Network Settings -> Enable DNS over HTTPS -> Use Provider, select or fill in your favorite one, mine is NextDNS btw.
	2. about:config, accept risk and continue
	3. toggle true for network.security.esni.enabled
	4. change network.trr.mode to 3 (TRR Only)



Then go back to the test page, and DNSSEC, TLS1.3, and Encrypted SNI are passed, however I saw a orange question mark next to the "Secure DNS" part, looks like when the test was written, NextDNS wasn't well known.

### Bonus

`dig TXT _esni.qzhou.dev`

[Encrypted SNI test]: https://www.cloudflare.com/ssl/encrypted-sni/
[document]: https://tools.ietf.org/html/draft-ietf-tls-esni-06
[TRR]: https://wiki.mozilla.org/Trusted_Recursive_Resolver