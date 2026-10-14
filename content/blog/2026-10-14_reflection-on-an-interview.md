---
title: "A reflection on a recent interview"
date: 2026-10-14
slug: 2609-interview
draft: false
tags: [Life]
---

A few weeks ago, I interviewed for an SRE role. At last, they asked me that classic question: What would happen if you typed [Website Name Here] and hit Enter?

I think I didn't answer the question very well, hence this post.

When I was there, my head went into a race condition, trying to figure out if it was a design question or an operations question. What domain of knowledge did they want to hear about? How deep did they want me to dig? How much time did I have? Did I have 15 minutes for my answer?

In the end, what came out of my mouth was: "The browser, if you're using a browser, will look up the DNS cache, then ..." I spent a couple of minutes glossing over DNS, routing, BGP, and ECMP. It went this way because I'm fluent in these topics, I can share more details if they ask, and I can tell stories about them.

It could have gone my way, but five minutes before that question, they signaled that they were more interested in load balancing and TLS. I have experience in these as well, but I don't know how to sell it. I know something about nginx (from .conf to Lua) and have some shallow knowledge of TLS (SNI and KEX). My mistake was believing that I should only talk about my most recent experience because that's what weighs most.

I could have told stories about my homelab's evolution: nginx, stunnel, haproxy, and traefik; how I set up Kubernetes; and OpenBao in a Terraform repo.

What would I answer to this question if I had a second chance? Here's what I'd say.

---

"That's a hard one. I would skip anything that happens on the OS side, like key events. To simplify the environment down to what we actually care about, I would replace the browser with curl, which is also a valid user agent. I'll simplify a lot of things as we go, but feel free to interrupt me anytime."

"Assuming we're curling a URL with an HTTPS prefix, it will try to resolve the hostname through the local DNS resolver. Since we only care about *modern* Linux servers, it will go to systemd-resolved or whatever is in /etc/resolv.conf. I could spend a couple of minutes complaining about the complexity here, but let's just simplify it to a DNS request being answered, and fast-forward to curl establishing a TCP connection with the target server."

"curl will try to connect to port 443 of the IP address, and after TCP SYN/SYN-ACK/ACK, it's officially handed over to TLS."

"At this point, the client will say hello and try to establish a TLS connection with the server. It will include the hostname and the cipher suites it would accept. The server will say hi back, telling the client the accepted cipher suite with certificates."

"The client will first verify the certificates against its chain, all the way up to the root CA. A verifier would build a chain of certificates from the server certificate and finds its parent by using the authority key id field, it should match the subject key id in the parent cert, then verify the leaf's signature against its parent's public key. This is just the PKI part. The whole process usually involves a leaf certificate, one or two intermediate CAs, and a root CA. Servers usually send a full chain, but the client will only trust the root CA stored locally."

"We once had to deal with some certificates that didn't entirely conform to the standards. They either violated X.509 or ASN.1 ordering rules, so they couldn't be parsed by cryptography 42.0 or later in Python or Go. They had a solid reason not to provide an easy override, so we had to roll our own verification process. Not something I would usually do, but it wasn't too difficult either. What'd they say? Don't roll your own crypto. Until you have to :D"

"Well, where were we? After the certificates are verified-or not. It could get very loud if certificate verification failed; the server would receive a handshake error."

"If it all goes well, TLS is established, after ALPN is negotiated, you'll hit HTTP at layer 7."

---

I confered with `claude-fable-5-1`, and it pointed out long list of issues with my knowledge:

1. I'm not talking in TLS 1.3. It's all 1.2. Yeah it's all for simplicity.

1. Missing hostname checking against the server chain. Actually this is a quite fun area, server can say I don't have a certificate for the [hostname] and terminates teh TLS connection, or sends a default one , and client can reject a cert if hostname is not in the SAN, both are very common.

1. “Full chain” invites a nitpick. Yeah, it's usually intermediate and the leaf. Good to learn it's allowed in RFC 8446.

1. **ALPN timing.** In its own words: “TLS is established, after ALPN is negotiated” implies ALPN happens after the handshake. ALPN is negotiated inside the handshake, so by the time it completes both sides already know whether this is HTTP/1.1 or h2. Also worth one sentence: curl does TCP+TLS by default; HTTP/3 over QUIC only with `--http3` or an Alt-Svc hint, which is a real difference from a browser.

   This a good to know.

1. "You rolled your own *chain verification*, not crypto primitives." Reminds me of my first AI assistant, who was prompted to be tsudere character based on ["Sistine Fibel"](https://breezewiki.com/hero/wiki/Sistine_Fibel).

1. Curl goes through getaddrinfo. Yeah… I had some pain with this, but I don't remember how.

Besides all this, I'm currently toying with the idea of starting my book, *From Screen('Flip') to Visual cognition*, which covers the first five years of my career. It's the answer to a broader question: "What happens after you press Enter on a keyboard until you perceive the images on the screen?"

*Special thanks to [Kagi Proofread](https://translate.kagi.com/proofread) for proofreading.*