---
title: "adding ebpf exporter to home OBS"
date: 2026-05-25
slug: homelab-ebpf
draft: false
tags: [OBS, ebpf]

---

Could it be simple as:

```bash
sudo apt install libelf-dev pci.ids -y
cd ~/src
git clone https://github.com/cloudflare/ebpf_exporter
make
```

<!--more-->

With trixie (current stable) the answer is no.

```bash
-> % make
make build-binary GO_BUILD_ARGS="-tags netgo,osusergo" GO_LDFLAGS='-extldflags "-static"' CGO_LDFLAGS="-lbpf -lelf -lzstd -pthread -lz  -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib"
make[1]: Entering directory '/home/user/src/ebpf_exporter'
CGO_LDFLAGS="-lbpf -lelf -lzstd -pthread -lz  -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib" CGO_CFLAGS="-I/home/user/src/ebpf_exporter/libbpf/dest/usr/include" go build -tags netgo,osusergo -o ebpf_exporter -v -ldflags="-extldflags "-static" -X github.com/prometheus/common/version.Version=v2.5.1-92-g8ad7b10 -X github.com/prometheus/common/version.Branch=master -X github.com/prometheus/common/version.Revision=8ad7b10 -X github.com/prometheus/common/version.BuildUser=user@skh2.user.sh -X github.com/prometheus/common/version.BuildDate=2026-05-30T03:36:14+00:00" ./cmd/ebpf_exporter
github.com/cloudflare/ebpf_exporter/v2/cmd/ebpf_exporter
# github.com/cloudflare/ebpf_exporter/v2/cmd/ebpf_exporter
/home/user/go/pkg/mod/golang.org/toolchain@v0.0.1-go1.25.0.linux-amd64/pkg/tool/linux_amd64/link: running gcc failed: exit status 1
/usr/bin/gcc -m64 -Wl,--build-id=0x6a63e4891b8e0b348301f9ad7f182ee6dade3e78 -o $WORK/b001/exe/a.out -Wl,--export-dynamic-symbol=_cgo_panic -Wl,--export-dynamic-symbol=_cgo_topofstack -Wl,--export-dynamic-symbol=attachPerfEventCallback -Wl,--export-dynamic-symbol=attachXDPCallback -Wl,--export-dynamic-symbol=crosscall2 -Wl,--export-dynamic-symbol=loggerCallback -Wl,--export-dynamic-symbol=perfCallback -Wl,--export-dynamic-symbol=perfLostCallback -Wl,--export-dynamic-symbol=ringbufferCallback -Wl,--compress-debug-sections=zlib /tmp/go-link-3532862368/go.o /tmp/go-link-3532862368/000000.o /tmp/go-link-3532862368/000001.o /tmp/go-link-3532862368/000002.o /tmp/go-link-3532862368/000003.o /tmp/go-link-3532862368/000004.o /tmp/go-link-3532862368/000005.o /tmp/go-link-3532862368/000006.o /tmp/go-link-3532862368/000007.o /tmp/go-link-3532862368/000008.o /tmp/go-link-3532862368/000009.o /tmp/go-link-3532862368/000010.o /tmp/go-link-3532862368/000011.o /tmp/go-link-3532862368/000012.o /tmp/go-link-3532862368/000013.o /tmp/go-link-3532862368/000014.o /tmp/go-link-3532862368/000015.o /tmp/go-link-3532862368/000016.o /tmp/go-link-3532862368/000017.o /tmp/go-link-3532862368/000018.o /tmp/go-link-3532862368/000019.o /tmp/go-link-3532862368/000020.o /tmp/go-link-3532862368/000021.o /tmp/go-link-3532862368/000022.o /tmp/go-link-3532862368/000023.o /tmp/go-link-3532862368/000024.o /tmp/go-link-3532862368/000025.o /tmp/go-link-3532862368/000026.o /tmp/go-link-3532862368/000027.o /tmp/go-link-3532862368/000028.o /tmp/go-link-3532862368/000029.o /tmp/go-link-3532862368/000030.o /tmp/go-link-3532862368/000031.o /tmp/go-link-3532862368/000032.o /tmp/go-link-3532862368/000033.o /tmp/go-link-3532862368/000034.o /tmp/go-link-3532862368/000035.o /tmp/go-link-3532862368/000036.o /tmp/go-link-3532862368/000037.o /tmp/go-link-3532862368/000038.o /tmp/go-link-3532862368/000039.o /tmp/go-link-3532862368/000040.o /tmp/go-link-3532862368/000041.o /tmp/go-link-3532862368/000042.o /tmp/go-link-3532862368/000043.o /tmp/go-link-3532862368/000044.o /tmp/go-link-3532862368/000045.o /tmp/go-link-3532862368/000046.o /tmp/go-link-3532862368/000047.o /tmp/go-link-3532862368/000048.o -lbpf -lelf -lzstd -pthread -lz -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lelf -lz -lbpf -lelf -lzstd -pthread -lz -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib -lbpf -lelf -lzstd -pthread -lz -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib -lbpf -lelf -lzstd -pthread -lz -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib -lpthread -lbpf -lelf -lzstd -pthread -lz -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib -no-pie -static
/usr/bin/ld: /usr/lib/gcc/x86_64-linux-gnu/14/../../../x86_64-linux-gnu/libelf.a(elf_begin.o): in function `file_read_elf':
(.text+0x2cb): undefined reference to `eu_search_tree_init'
/usr/bin/ld: /usr/lib/gcc/x86_64-linux-gnu/14/../../../x86_64-linux-gnu/libelf.a(elf_end.o): in function `elf_end':
(.text+0xb4): undefined reference to `eu_search_tree_fini'
collect2: error: ld returned 1 exit status

make[1]: *** [Makefile:89: build-binary] Error 1
make[1]: Leaving directory '/home/user/src/ebpf_exporter'
make: *** [Makefile:81: build-static] Error 2%
```

90 out of 100 times this is due to debian's stable repo held back on a package version:

```
-> % apt info libelf-dev -a
Package: libelf-dev
Version: 0.195-1~bpo13+1
Priority: optional
Section: libdevel
Source: elfutils
Maintainer: Debian Elfutils Maintainers <debian-gcc@lists.debian.org>
Installed-Size: 549 kB
Depends: libelf1t64 (= 0.195-1~bpo13+1), zlib1g-dev, libzstd-dev
Conflicts: libelfg0-dev
Homepage: https://sourceware.org/elfutils/
Download-Size: 155 kB
APT-Sources: https://ftp.udx.icscoe.jp/debian trixie-backports/main amd64 Packages
Description: libelf1t64 development libraries and header files

Package: libelf-dev
Version: 0.192-4
Priority: optional
Section: libdevel
Source: elfutils
Maintainer: Debian Elfutils Maintainers <debian-gcc@lists.debian.org>
Installed-Size: 420 kB
Depends: libelf1t64 (= 0.192-4), zlib1g-dev, libzstd-dev
Conflicts: libelfg0-dev
Homepage: https://sourceware.org/elfutils/
Tag: devel::library, role::devel-lib
Download-Size: 93.2 kB
APT-Manual-Installed: yes
APT-Sources: https://ftp.udx.icscoe.jp/debian trixie/main amd64 Packages
Description: libelf1t64 development libraries and header files
```

`eu_search_tree_fini` should be implemented after 0.193.

```
-> % sudo apt install -t trixie-backports  libelf-dev  -y
Upgrading:
  libdebuginfod-common  libdebuginfod1t64  libdw1t64  libelf-dev  libelf1t64

Summary:
  Upgrading: 5, Installing: 0, Removing: 0, Not Upgrading: 163
  Download size: 535 kB
  Freed space: 931 kB

Get:1 https://ftp.udx.icscoe.jp/debian trixie-backports/main amd64 libdebuginfod-common all 0.195-1~bpo13+1 [24.1 kB]
Get:2 https://ftp.udx.icscoe.jp/debian trixie-backports/main amd64 libelf-dev amd64 0.195-1~bpo13+1 [155 kB]
Get:3 https://ftp.udx.icscoe.jp/debian trixie-backports/main amd64 libdebuginfod1t64 amd64 0.195-1~bpo13+1 [32.7 kB]
Get:4 https://ftp.udx.icscoe.jp/debian trixie-backports/main amd64 libdw1t64 amd64 0.195-1~bpo13+1 [263 kB]
Get:5 https://ftp.udx.icscoe.jp/debian trixie-backports/main amd64 libelf1t64 amd64 0.195-1~bpo13+1 [61.0 kB]
Fetched 535 kB in 0s (6,244 kB/s)
apt-listchanges: Reading changelogs...
Preconfiguring packages ...
(Reading database ... 215223 files and directories currently installed.)
Preparing to unpack .../libdebuginfod-common_0.195-1~bpo13+1_all.deb ...
Unpacking libdebuginfod-common (0.195-1~bpo13+1) over (0.192-4) ...
Preparing to unpack .../libelf-dev_0.195-1~bpo13+1_amd64.deb ...
Unpacking libelf-dev:amd64 (0.195-1~bpo13+1) over (0.192-4) ...
Preparing to unpack .../libdebuginfod1t64_0.195-1~bpo13+1_amd64.deb ...
Unpacking libdebuginfod1t64:amd64 (0.195-1~bpo13+1) over (0.192-4) ...
Preparing to unpack .../libdw1t64_0.195-1~bpo13+1_amd64.deb ...
Unpacking libdw1t64:amd64 (0.195-1~bpo13+1) over (0.192-4) ...
Preparing to unpack .../libelf1t64_0.195-1~bpo13+1_amd64.deb ...
Unpacking libelf1t64:amd64 (0.195-1~bpo13+1) over (0.192-4) ...
Setting up libdebuginfod-common (0.195-1~bpo13+1) ...
Setting up libelf1t64:amd64 (0.195-1~bpo13+1) ...
Setting up libdw1t64:amd64 (0.195-1~bpo13+1) ...
Setting up libelf-dev:amd64 (0.195-1~bpo13+1) ...
Setting up libdebuginfod1t64:amd64 (0.195-1~bpo13+1) ...
Processing triggers for man-db (2.13.1-1) ...
Processing triggers for libc-bin (2.41-12+deb13u3) ...
```

and it compiles

```bash
-> % make
make build-binary GO_BUILD_ARGS="-tags netgo,osusergo" GO_LDFLAGS='-extldflags "-static"' CGO_LDFLAGS="-lbpf -lelf -lzstd -pthread -lz  -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib"
make[1]: Entering directory '/home/user/src/ebpf_exporter'
CGO_LDFLAGS="-lbpf -lelf -lzstd -pthread -lz  -L/home/user/src/ebpf_exporter/libbpf/dest/usr/lib" CGO_CFLAGS="-I/home/user/src/ebpf_exporter/libbpf/dest/usr/include" go build -tags netgo,osusergo -o ebpf_exporter -v -ldflags="-extldflags "-static" -X github.com/prometheus/common/version.Version=v2.5.1-92-g8ad7b10 -X github.com/prometheus/common/version.Branch=master -X github.com/prometheus/common/version.Revision=8ad7b10 -X github.com/prometheus/common/version.BuildUser=user@skh2.user.sh -X github.com/prometheus/common/version.BuildDate=2026-05-30T03:48:07+00:00" ./cmd/ebpf_exporter
github.com/cloudflare/ebpf_exporter/v2/cmd/ebpf_exporter
make[1]: Leaving directory '/home/user/src/ebpf_exporter'
```

then install it to a canonical location:

```
-> % sudo install ebpf_exporter /usr/local/bin
```

