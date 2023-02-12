---
title: "Updating a vulnerable TPM"
date: 2020-05-01T13:26:04.883501938Z
slug: updating-a-vulnerable-tpm
draft: false
tags: []
math: false
toc: false
---

An `unsigned long long time` ago, a mass amount of TPMs and smartcards were hit by a flaw in the Infineon codebase. They have released an [update](https://www.infineon.com/cms/en/product/promopages/tpm-update/), but still, we can see unpatched modules in the wild. 

<!--more-->

Who uses discrete TPMs nowadays? LUKS, Windows Hello, BitLocker, OpenSSH through p11? I see that SSH CA signing with p11 isn't really uncommon, people may fall for TPMs if there's one avail. The rise of fTPM may remedy and eventually exterminate the need of dTPMs, but until this moment, it doesn't. So we are stuck with TPM 1.2/2.0 devices, and we gotta patch'em all.

## Update
The large majority of oem updates are intended for Windows administrators only, the remainders however assumes that you can reboot the server to a UEFI command line. 

### We will do it in this Linux way.

![2017 Happy Birthday Linux - @douglax](https://assets.qzhou.dev/file/12be5ea9/0uC0o5Vpes.png)


I found this random updater code on Github, not only it includes the infamous google patch, but also does it patched up to the OpenSSL 1.1:

```
https://github.com/iavael/infineon-firmware-updater
```

It could be frustrating to get the actual firmware, mine is a supermicro, it's not as hard as a HP, but they changed download base url from `ftp://ftp.supermicro.com` to `https://www.supermicro.com/wftp`

Therefore, the old link
```
ftp://ftp.supermicro.com/wftp/driver/TPM
```
becomes
```
https://www.supermicro.com/wftp/driver/TPM
```

### Compiling TPMFactoryUpd

This is simple as of early 2020.

```bash
git clone https://github.com/iavael/infineon-firmware-updater
cd infineon-firmware-updater/TPMFactoryUpd
make
```

It compiles to a single binary `TPMFactoryUpd`, and you are ready.

### Upgrade Path

If you have ls'd the Firmware dir, you'll find quite a mess:

```
License_FW_Images.pdf                      TPM20_5.0.1089.2_to_TPM20_5.62.3126.2.BIN   TPM20_5.61.2785.0_to_TPM12_4.43.258.0.BIN
TPM12_4.40.119.0_to_TPM12_4.43.257.0.BIN   TPM20_5.50.2022.0_to_TPM20_5.62.3126.2.BIN  TPM20_5.61.2785.0_to_TPM20_5.62.3126.0.BIN
TPM12_4.40.119.0_to_TPM12_4.43.258.0.BIN   TPM20_5.50.2022.2_to_TPM20_5.62.3126.2.BIN  TPM20_5.61.2785.0_to_TPM20_5.63.3144.0.BIN
TPM12_4.40.119.0_to_TPM20_5.62.3126.0.BIN  TPM20_5.51.2098.0_to_TPM12_4.43.257.0.BIN   TPM20_5.61.2785.2_to_TPM20_5.62.3126.2.BIN
TPM12_4.40.119.0_to_TPM20_5.63.3144.0.BIN  TPM20_5.51.2098.0_to_TPM12_4.43.258.0.BIN   TPM20_5.61.2789.0_to_TPM12_4.43.257.0.BIN
TPM12_4.42.132.0_to_TPM12_4.43.257.0.BIN   TPM20_5.51.2098.0_to_TPM20_5.62.3126.0.BIN  TPM20_5.61.2789.0_to_TPM12_4.43.258.0.BIN
TPM12_4.42.132.0_to_TPM12_4.43.258.0.BIN   TPM20_5.51.2098.0_to_TPM20_5.63.3144.0.BIN  TPM20_5.61.2789.0_to_TPM20_5.62.3126.0.BIN
TPM12_4.42.132.0_to_TPM20_5.62.3126.0.BIN  TPM20_5.51.2098.2_to_TPM20_5.62.3126.2.BIN  TPM20_5.61.2789.0_to_TPM20_5.63.3144.0.BIN
TPM12_4.42.132.0_to_TPM20_5.63.3144.0.BIN  TPM20_5.60.2561.2_to_TPM20_5.62.3126.2.BIN  TPM20_5.62.3126.0_to_TPM12_4.43.257.0.BIN
TPM12_4.43.257.0_to_TPM12_4.43.258.0.BIN   TPM20_5.60.2677.0_to_TPM12_4.43.257.0.BIN   TPM20_5.62.3126.0_to_TPM12_4.43.258.0.BIN
TPM12_4.43.257.0_to_TPM20_5.62.3126.0.BIN  TPM20_5.60.2677.0_to_TPM12_4.43.258.0.BIN   TPM20_5.62.3126.0_to_TPM20_5.63.3144.0.BIN
TPM12_4.43.257.0_to_TPM20_5.63.3144.0.BIN  TPM20_5.60.2677.0_to_TPM20_5.62.3126.0.BIN  TPM20_5.63.3144.0_to_TPM12_4.43.258.0.BIN
TPM12_4.43.257.0_to_TPM20_5.80.2910.2.BIN  TPM20_5.60.2677.0_to_TPM20_5.63.3144.0.BIN  TPM20_latest.cfg
TPM12_4.43.258.0_to_TPM20_5.63.3144.0.BIN  TPM20_5.60.2677.2_to_TPM20_5.62.3126.2.BIN  TPMFactoryUpd.efi
TPM12_latest.cfg                           TPM20_5.61.2785.0_to_TPM12_4.43.257.0.BIN   TPMFactoryUpd.log
```

This is for the 9665 module, it ships with a config file, which it supports converting a 1.2 module to 2.0, which is very good.

But for the 9655 module, there's only one option:
```
License_FW_Images.pdf  
TPM12_4.32.879.0_to_TPM12_4.34.1010.2.BIN  TPM12_4.33.949.0_to_TPM12_4.34.1010.2.BIN  TPM12_latest.cfg  TPMFactoryUpd.efi
```
Update to the latest.

### Upgrading Process

The `.cfg` files can be directly supplied to `TPMFactoryUpd` supplying it to `TPMFactoryUpd -config` as a argument.

If you take a look inside those files, both uses takeownership mode for updating.

If you are using 1.2 module, you should stop anything else from locking it. Like `tcsd`

```bash
systemctl stop trousers.service

sudo ./TPMFactoryUpd -update -firmware ## insert file with full path here
```

It has progress bar, which is nice.

Only error during update is saved to `TPMFactoryUpd.log`



