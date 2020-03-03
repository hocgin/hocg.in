------
title: Linux 下网络相关的命令
date: 2019-04-01 08:07
tags:
  - Linux
  - TCP/IP
categories:
  - Linux
------
Linux 下网络相关的命令
<!--more-->
## 🔗
[Linux-Nettools vs Iproute2](https://linoxide.com/linux-command/use-ip-command-linux/)

## net-tools
### `ifconfig`
```sbtshell
enp2s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.8.23  netmask 255.255.255.0  broadcast 192.168.8.255
        inet6 fe80::794c:57e0:a7ca:518e  prefixlen 64  scopeid 0x20<link>
        ether 50:9a:4c:17:e9:da  txqueuelen 1000  (Ethernet)
        RX packets 4412700  bytes 3603093632 (3.3 GiB)
        RX errors 0  dropped 20  overruns 0  frame 0
        TX packets 1877167  bytes 507480177 (483.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 14009901  bytes 2441347518 (2.2 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 14009901  bytes 2441347518 (2.2 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlp3s0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 54:13:79:5b:c3:29  txqueuelen 1000  (Ethernet)
        RX packets 6  bytes 1296 (1.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 34  bytes 5037 (4.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
- enp2s0: 网络设备号
- flags=4163<UP,BROADCAST,RUNNING,MULTICAST>: 网络设备状态标识
- mtu 1500: mtu
- inet 192.168.8.23  netmask 255.255.255.0  broadcast 192.168.8.255: IPv4 协议
- inet6 fe80::794c:57e0:a7ca:518e: IPv6 协议
- ether 50:9a:4c:17:e9:da 
- TX: 发送/上行  
- RX: 接收/下行 
    - packets 4412700: 包总数量
    - bytes 2441347518 (2.2 GiB): 流量大小
    - errors 0: 错误包数量
    - dropped 0: 丢包数量
    - overruns 0: 超时包数量
    - collisions 0: 冲突包数量
    - frame 0: 帧数量
- txqueuelen 1000  (Ethernet): 存储传输数据缓存的大小
- prefixlen 64
- scopeid 0x20<link>

### `route`
```sbtshell
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         192.168.8.1     0.0.0.0         UG    100    0        0 enp2s0
192.168.8.0     0.0.0.0         255.255.255.0   U     100    0        0 enp2s0
```
- Genmask: 子网掩码
- Destination: 目的地  `Destination/Genmask 组成局域网`
    - default = 0.0.0.0/0.0.0.0
- Gateway: 网关
- Flags: 网络标识
    - U (route is up): 路由启动状态
    - H (target is a host): 目标是主机
    - G (use gateway): 需要使用网关来传输
    - R (reinstate route for dynamic routing): 
    - D (dynamically installed by daemon or redirect): 
    - M (modified from routing daemon or redirect): 
    - ! (reject route): 拒绝/黑名单
- Metric: 目标的距离
- Ref: 
- Use: 路线查找计数
- Iface: 接收数据的网络接口 `网络出口网卡`

## iproute2
### `ip link`
> 配置网络设备参数
> OSI 七层协议中, 二层相关信息  
> eg. MTU, MAC, 开关...
```sbtshell
ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 50:9a:4c:17:e9:da brd ff:ff:ff:ff:ff:ff
3: wlp3s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DORMANT group default qlen 1000
    link/ether 54:13:79:5b:c3:29 brd ff:ff:ff:ff:ff:ff

# 显示状态详情
ip -s link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    RX: bytes  packets  errors  dropped overrun mcast   
    2507975007 14838472 0       0       0       0       
    TX: bytes  packets  errors  dropped carrier collsns 
    2507975007 14838472 0       0       0       0       
2: enp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 50:9a:4c:17:e9:da brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped overrun mcast   
    3657508487 4607298  0       23      0       154201  
    TX: bytes  packets  errors  dropped carrier collsns 
    536627449  1943192  0       0       0       0       
3: wlp3s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DORMANT group default qlen 1000
    link/ether 54:13:79:5b:c3:29 brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped overrun mcast   
    1296       6        0       0       0       0       
    TX: bytes  packets  errors  dropped carrier collsns 
    5037       34       0       0       0       0
    
# 操作特定网卡 eg. ip link set eth0 up
ip link set {网络设备} {操作}
- 网络设备: eg. enp2s0
    - 操作
        - up: 开启
        - down: 关闭
        - address: Mac 地址`ff:ff:ff:ff:ff:ff`
        - name: 网络设备名称
        - mtu: mtu值`1500`
```

### `ip addr`
> 配置网络相关信息
> OSI 七层协议中, 三层相关信息  
> eg. 网关, 子网掩码..

```sbtshell    
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 50:9a:4c:17:e9:da brd ff:ff:ff:ff:ff:ff
    inet 192.168.8.23/24 brd 192.168.8.255 scope global noprefixroute enp2s0
       valid_lft forever preferred_lft forever
    inet6 fe80::794c:57e0:a7ca:518e/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
3: wlp3s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether 54:13:79:5b:c3:29 brd ff:ff:ff:ff:ff:ff

# 设定IP相关参数
ip address {add|del} {IP相关配置} {网络设备} {相关参数}
- add|del: 新增或删除
- IP相关配置: eg. 192.168.8.23/24
- 网络设备: eg. enp2s0
- 相关参数:
    - broadcast: 广播地址, "+"为自动计算
    - label: 別名别名
    - scope: 作用域
        - global
        - site  
        - link
        - host

```
- lo: 网卡label. 
- <BROADCAST,MULTICAST,UP,LOWER_UP>: 网络设备状态标识 
    - BROADCAST, MULTICAST: 可以发送广播, 可以发送多播包
        - LOOPBACK: 本地环回
    - UP: 网络设备状态
    - LOWER_UP: 已连线
- mtu 65536:  最大传输单元
- qdisc pfifo_fast: 排队规则. 
    - noqueue
    - pfifo_fast
- group default: 所在组. 
- inet 127.0.0.1/8: IPv4 地址及子网掩码
- inet6 fe80::794c:57e0:a7ca:518e/64: IPv6 地址及子网掩码
- brd ff:ff:ff:ff:ff:ff: 广播地址
- scope global: 作用域. 
    - global: 允许所有来源
    - site: 仅IPv6, 允许仅本机连接 
    - link: 仅允许自我连接
    - host: 仅允许本主机内部连接
    
- noprefixroute enp2s0
- preferred_lft forever: 
- valid_lft forever: 有效期限
- qlen 1000

### `ip route`
> 路由相关设置

```sbtshell
ip route
default via 192.168.8.1 dev enp2s0 proto static metric 100 
192.168.8.0/24 dev enp2s0 proto kernel scope link src 192.168.8.23 metric 100

# 设定route相关参数
ip route {add|del} {IP|网络} {via 网关} {网络设备}
- add|del: 新增或删除
- IP|网络: eg. IP 或 192.168.8.23/24
- 网关: 指定出口网关(可选)
- 网络设备: 指定出口网络设备 eg. enp2s0
- mtu: 配置mtu参数
```
- 192.168.8.0/24: 网络
- dev enp2s0: 网络设备
- proto kernel: 路由协议 [redirect, kernel, boot, static, ra]
- scope link: 作用域

## 网络侦查
### ping
> 网络状态

```sbtshell
➜  ~ ping www.baidu.com -c 5
PING www.a.shifen.com (14.215.177.39) 56(84) bytes of data.
64 bytes from 14.215.177.39 (14.215.177.39): icmp_seq=1 ttl=54 time=20.6 ms
64 bytes from 14.215.177.39 (14.215.177.39): icmp_seq=2 ttl=54 time=20.5 ms
64 bytes from 14.215.177.39 (14.215.177.39): icmp_seq=3 ttl=54 time=20.4 ms
```
- 64 bytes: ICMP封包大小
- icmp_seq=3: 侦测序号
- ttl=54: 默认255, 每经过一个含MAC地址时-1
- time=20.5 ms: 耗时

### traceroute
> 网路状态
```sbtshell
➜  ~  traceroute www.baidu.com 
traceroute to www.baidu.com (14.215.177.39), 30 hops max, 60 byte packets
 1  192.168.8.1 (192.168.8.1)  0.784 ms  1.348 ms  1.866 ms
 2  192.168.5.1 (192.168.5.1)  0.138 ms  0.174 ms  0.217 ms
 3  1.224.77.125.broad.xm.fj.dynamic.163data.com.cn (125.77.224.1)  1.458 ms  1.486 ms  1.694 ms
 4  61.154.238.229 (61.154.238.229)  4.692 ms  4.704 ms 61.154.238.225 (61.154.238.225)  2.400 ms
 5  61.154.238.77 (61.154.238.77)  5.834 ms 117.30.27.185 (117.30.27.185)  1.948 ms 61.154.238.77 (61.154.238.77)  6.106 ms
 6  * 202.97.40.169 (202.97.40.169)  19.847 ms 202.97.78.37 (202.97.78.37)  19.233 ms
 7  113.96.4.90 (113.96.4.90)  32.771 ms  28.773 ms 113.96.4.106 (113.96.4.106)  42.485 ms
 8  * * *
 9  14.29.117.234 (14.29.117.234)  19.359 ms 14.29.121.182 (14.29.121.182)  17.646 ms 14.29.121.190 (14.29.121.190)  28.106 ms
10  * * *
11  * * * 

```
- 每个序号都是同一层进行三次连接的耗时
- `* * *`: 可能是防火墙问题或路由问题

### netstat
> 查看本机的网络连接
```sbtshell
# 目前所有的网络线路状态
# netstat -tulnp
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:8000            0.0.0.0:*               LISTEN      10247/node 

```
- Proto: 网络协议
- Recv-Q: 未使用字节
- Send-Q: 没有确认的字节
- Local Address: 本地地址+端口
- Foreign Address: 目标地址+端口
- stat: 状态
    - ESTABLISED: 已连线
    - SYN_SENT: 发送连线确认包
    - SYN_RECV: 接收连线确认包
    - FIN_WAIT1: 正在断线中-第一步
    - FIN_WAIT2: 正在断线中(等待对方确认)-第二步
    - TIME_WAIT: 已断线(等待关闭)-第三步
    - LISTEN: 正在监听
- PID/Program name: 进程和PID
    
## host, nslookup, dig
> 域名转IP

### host
```sbtshell
➜  ~ host www.baidu.com 114.114.114.114
Using domain server:
Name: 114.114.114.114
Address: 114.114.114.114#53
Aliases: 

www.baidu.com is an alias for www.a.shifen.com.
www.a.shifen.com has address 14.215.177.39
www.a.shifen.com has address 14.215.177.38
```

### nslookup
```sbtshell
➜  ~ nslookup www.google.com
Server:		218.85.152.99
Address:	218.85.152.99#53

Non-authoritative answer:
Name:	www.google.com
Address: 75.126.150.210
Name:	www.google.com
Address: 2400:cb00:2048:1::6814:224e
```

### dig
```sbtshell
➜  ~ dig www.google.com

; <<>> DiG 9.11.3-1-Debian <<>> www.google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 26052
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 4, ADDITIONAL: 8

;; QUESTION SECTION:
;www.google.com.			IN	A

;; ANSWER SECTION:
www.google.com.		600	IN	A	75.126.150.210

;; AUTHORITY SECTION:
google.com.		153873	IN	NS	ns2.google.com.
google.com.		153873	IN	NS	ns1.google.com.
google.com.		153873	IN	NS	ns3.google.com.
google.com.		153873	IN	NS	ns4.google.com.

;; ADDITIONAL SECTION:
ns1.google.com.		340640	IN	A	216.239.32.10
ns1.google.com.		160867	IN	AAAA	2001:4860:4802:32::a
ns2.google.com.		147310	IN	A	216.239.34.10
ns2.google.com.		167153	IN	AAAA	2001:4860:4802:34::a
ns3.google.com.		170088	IN	A	216.239.36.10
ns3.google.com.		343381	IN	AAAA	2001:4860:4802:36::a
ns4.google.com.		342199	IN	A	216.239.38.10
ns4.google.com.		340238	IN	AAAA	2001:4860:4802:38::a

;; Query time: 3 msec
;; SERVER: 218.85.152.99#53(218.85.152.99)
;; WHEN: Tue Apr 02 11:54:08 CST 2019
;; MSG SIZE  rcvd: 296

```

## Hook
- tcpdump
```sbtshell
➜  ~ sudo tcpdump -i enp2s0
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on enp2s0, link-type EN10MB (Ethernet), capture size 262144 bytes
16:03:36.920320 IP 192.168.8.23.32842 > 106.37.75.114.80: Flags [.], ack 1334, win 1134, options [nop,nop,TS val 2465645746 ecr 4170196622], length 0
16:07:25.848706 IP 192.168.8.23.45512 > 203.107.41.32.9015: Flags [P.], seq 858:897, ack 771, win 37440, length 39
15:23:53.248962 IP6 fe80::485c:9c0f:61ce:2886 > ff02::1:ffb6:3f84: ICMP6, neighbor solicitation, who has fe80::32e1:71ff:feb6:3f84, length 32
15:23:53.249199 IP 192.168.8.23.55804 > FJ-DNS.xm.fj.cn.domain: 41679+ PTR? 4.8.f.3.6.b.f.f.1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.2.0.f.f.ip6.arpa. (90)
15:23:53.251749 IP FJ-DNS.xm.fj.cn.domain > 192.168.8.23.55804: 41679 NXDomain* 0/1/0 (154)
15:23:53.251809 IP 192.168.8.23.57994 > FJ-DNS.xm.fj.cn.domain: 8140+ PTR? 6.8.8.2.e.c.1.6.f.0.c.9.c.5.8.4.0.0.0.0.0.0.0.0.0.0.0.0.0.8.e.f.ip6.arpa. (90)
15:23:53.254241 ARP, Request who-has 192.168.8.250 tell 192.168.8.134, length 46
15:23:53.255081 IP FJ-DNS.xm.fj.cn.domain > 192.168.8.23.57994: 8140 NXDomain* 0/1/0 (139)

# 指令
tcpdump [-AennqX] [-i 网络接口] [-w 导出文件] [-c 次数] \
                      [-r 导入文件] [过滤规则]
-A： 显示为ASCII码
-e: OSI 二层显示MAC封包
-nn: 解析地址(显示为ip和端口)
-q: 打印简短的信息
-X: 显示16进制及ASCII码
-i: 需要监听的网络接口
-w: 写出存储文件
-r: 读取存储文件
-c: 监听数量
过滤规则: 可以使用 and 和 or 进行组合
    - 'host foo', 'host 127.0.0.1' ：监听特定的主机
    - 'net 192.168' ：监听特定的网段
    - 'src host 127.0.0.1' 'dst net 192.168'： 监听特定的来源(src)或目的地(dst)
    - 'tcp port 21'：监听特定的协议，如 tcp, udp, arp, ether..

```
- 15:23:53.248962: 时:分:秒.毫秒
- IP: 使用的协议
- 192.168.8.23.32842 >: 发起端
- 106.37.75.114.80: 接收端
- Flags [.]: 传输标识
    - \[.P]: 推送`PUSH`
- ack 1334: ack 号
- seq 858:897: 传输资料 858~897 byte

### iptables
> 访问控制

### tc 
> 流量控制  

### mtr
> 显示网络路径的状况