------
title: 在 OpenWrt 部署 Shadowsocks
date: 2017-09-18 14:32:26
tags:
  - Tips
  - OpenWrt
categories:
  - OpenWrt
------
## 前言
关于 OpenWrt 请看 [OpenWrt 入门篇](http://hocg.in/2017/09/18/OpenWrt-%E5%85%A5%E9%97%A8%E7%AF%87/#more)
关于 Shadowsocks 请看 [什么是 Shadowsocks](https://www.wikiwand.com/zh/Shadowsocks)
已有 Shadowsocks 账号, 后续可能会记录。
**重要:** 本文前提为读者已观看过以上2篇文章，如阅读引起任何不适请立即停止。

## 关于 Shadowsocks-libev 模块
> [Shadowsocks-libev 官网](https://github.com/shadowsocks/shadowsocks-libev)
> [Shadowsocks-libev 下载地址 (推荐下载非spec版本)](https://sourceforge.net/projects/openwrt-dist/files/shadowsocks-libev)

ss-server：服务器端，部署于服务器，提供 shadowsocks 服务。
ss-local：客户端，提供 SOCKS 代理
ss-redir：客户端，提供透明代理, 从 v2.2.0 开始支持 UDP
ss-tunnel: 客户端，提供端口转发, 可用于 DNS 查询

**Note:** 下载的时候请根据 CPU 类型, 查看方式请[参照]()

## 安装 Shadowsocks-libev
1. 将下载的`Shadowsocks-libev`移至路由器`/tmp`目录
```shell
scp shadowsocks-libev-polarssl_2.4.8-2_ar71xx.ipk root@192.168.1.1:/tmp
```
2. 安装依赖
```shell
opkg update
opkg install iptables-mod-nat-extra ipset libopenssl
```
3. 安装`Shadowsocks-libev`
```shell
opkg install /tmp/shadowsocks-libev-polarssl_2.4.8-2_ar71xx.ipk
```

## 配置 shadowsocks
1. 修改`/etc/shadowsocks.json`为实际参数。格式如下
    ```json
    {
      "server": "127.0.0.1",
      "server_port": 443,
      "local_port": 7654,
      "password": "password",
      "timeout": 60,
      "method": "rc4-md5"
    }
    ```
    此处, **"local_port": 7654** 为重点。不理解的, 请不要进行修改此项，后续会解释。
    **注:** `/etc/shadowsocks.json` 为配置文件, 存储 shadowsocks 的账号、 密码及设置。
2. 查看`/etc/init.d/shadowsocks`。内容如下
    ```shell
    #!/bin/sh /etc/rc.common

    START=95

    SERVICE_USE_PID=1
    SERVICE_WRITE_PID=1
    SERVICE_DAEMONIZE=1

    CONFIG=/etc/shadowsocks.json

    start() {
      service_start /usr/bin/ss-local -c $CONFIG -b 0.0.0.0
      #service_start /usr/bin/ss-redir -c $CONFIG -b 0.0.0.0
      #service_start /usr/bin/ss-tunnel -c $CONFIG -b 0.0.0.0 -l 5353 -L 8.8.8.8:53 -u
    }

    stop() {
      service_stop /usr/bin/ss-local
      #service_stop /usr/bin/ss-redir
      #service_stop /usr/bin/ss-tunnel
    }
    ```
    **注:** `/etc/init.d/shadowsocks` 为运行文件, shadowsocks 的启动、停止、重启。
3. 运行检查配置是否正确
    ```shell
    /etc/init.d/shadowsocks restart
    ```
4. 使用代理进行检查, Chrome 浏览器下载 [ExtensionProxy SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif)，墙内地址后续补上..。对插件进行如下配置:
![image](http://7xs6lq.com1.z0.glb.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-09-18%2015.43.33.png)
5. 在 Chrome 浏览器使用 ExtensionProxy SwitchyOmega 切换到该协议并访问 [YouTuBe](https://www.youtube.com/)，验证其配置的正确性。
6. 关闭 shadowsocks
    ```shell
    /etc/init.d/shadowsocks stop
    ```

## 自动化
### 安装 dnsmasq & ipset
1. 查看是否支持 ipset
    ```shell
    opkg update
    opkg list-installed    
    dnsmasq -v

    # 如果不支持，卸载掉安装full版
    opkg remove dnsmasq
    opkg install dnsmasq-full
    opkg install ipset iptables-mod-nat-extra
    opkg install /tmp/pdnsd_1.2.9a-par-a8e46ccba7b0fa2230d6c42ab6dcd92926f6c21d_ar71xx.ipk
    ```
    附件:
    - [pdnsd_1.2.9a-par-a8e46ccba7b0fa2230d6c42ab6dcd92926f6c21d_ar71xx.ipk 下载](预留)
2. 配置 dnsmasq 和 ipset
    ```shell
    vim /etc/dnsmasq.conf
    mkdir /etc/dnsmasq.d
    ```
    在末尾加入
    ```shell
    conf-dir=/etc/dnsmasq.d
    cache-size=1500      #修改dnsmasq缓存大小，默认为150。
    min-cache-ttl=720    #修改DNS缓存最小有效期（秒）。仅适用于aa65535的dnsmasq-full版本。
    ```
3. 下载国内重要网站名单，用国内域名服务器查询iP地址
    ```shell
    cd /etc/dnsmasq.d
    opkg install wget
    wget -4 --no-check-certificate -O /etc/dnsmasq.d/accelerated-domains.china.conf https://github.com/felixonmars/dnsmasq-china-list/raw/master/accelerated-domains.china.conf
    wget -4 --no-check-certificate -O /etc/dnsmasq.d/bogus-nxdomain.china.conf https://github.com/felixonmars/dnsmasq-china-list/raw/master/bogus-nxdomain.china.conf
    echo "server=/#/127.0.0.1#3210" > gfwlist.conf
    ```
4. 修改`/etc/init.d/shadowsocks`启动文件, 内容如下
    ```shell
    #!/bin/sh /etc/rc.common

    START=95

    SERVICE_USE_PID=1
    SERVICE_WRITE_PID=1
    SERVICE_DAEMONIZE=1

    CONFIG=/etc/shadowsocks.json

    start() {
        sed -i 's/114.114.114.114/127.0.0.1#3210/' /etc/dnsmasq.d/gfwlist.conf
        /etc/init.d/dnsmasq restart

        service_start /usr/bin/ss-redir -b 0.0.0.0 -c $CONFIG -f /var/run/shadowsocks.pid -u
        service_start /usr/bin/ss-tunnel -b 0.0.0.0 -c $CONFIG -l 3210 -L 8.8.8.8:53 -u
        /usr/bin/shadowsocks-firewall
    }

    stop() {
        sed -i 's/127.0.0.1#3210/114.114.114.114/' /etc/dnsmasq.d/gfwlist.conf
        /etc/init.d/dnsmasq restart

        service_stop /usr/bin/ss-redir
        service_stop /usr/bin/ss-tunnel
        killall ss-redir
        killall ss-tunnel
        /etc/init.d/firewall restart
    }
    ```
5. 配置 iptables 防火墙转发IP和端口
   **创建执行文件 /usr/bin/shadowsocks-firewall**
    ```shell
    touch /usr/bin/shadowsocks-firewall
    chmod +x /usr/bin/shadowsocks-firewall
    ```
    **/usr/bin/shadowsocks-firewall 其内容如下**
    ```shell
    #!/bin/sh

    #create a new chain named SHADOWSOCKS
    iptables -t nat -N SHADOWSOCKS
    iptables -t nat -N SHADOWSOCKS_WHITELIST

    # Ignore your shadowsocks server's addresses
    # It's very IMPORTANT, just be careful.
    iptables -t nat -A SHADOWSOCKS -d 此处为服务器IP -j RETURN

    # Ignore LANs IP address
    iptables -t nat -A SHADOWSOCKS -d 0.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 10.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 127.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 169.254.0.0/16 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 172.16.0.0/12 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 192.168.0.0/16 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 224.0.0.0/4 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 240.0.0.0/4 -j RETURN

    # Check whitelist
    iptables -t nat -A SHADOWSOCKS -j SHADOWSOCKS_WHITELIST
    iptables -t nat -A SHADOWSOCKS -m mark --mark 1 -j RETURN

    #for hulu.com
    iptables -t nat -A SHADOWSOCKS -p tcp --dport 1935 -j REDIRECT --to-ports 7654
    iptables -t nat -A SHADOWSOCKS -p udp --dport 1935 -j REDIRECT --to-ports 7654

    # for Chrome browser and youtube.com
    iptables -t nat -A SHADOWSOCKS -p udp --dport 443 -j REDIRECT --to-ports 7654

    # Anything else should be redirected to shadowsocks's local port
    iptables -t nat -A SHADOWSOCKS -p tcp -j REDIRECT --to-ports 7654
    # Apply the rules
    iptables -t nat -A PREROUTING -p tcp -j SHADOWSOCKS

    # Ignore China IP address
    # for white_ip in `cat /etc/chinadns_chnroute.txt`;
    # do
    #   iptables -t nat -A SHADOWSOCKS_WHITELIST -d "${white_ip}" -j MARK --set-mark 1
    # done

    # Ignore Asia IP address
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 1.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 14.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 27.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 36.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 39.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 42.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 49.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 58.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 59.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 60.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 61.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 101.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 103.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 106.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 110.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 111.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 112.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 113.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 114.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 115.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 116.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 117.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 118.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 119.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 120.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 121.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 122.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 123.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 124.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 125.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 126.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 169.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 175.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 180.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 182.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 183.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 202.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 203.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 210.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 211.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 218.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 219.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 220.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 221.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 222.0.0.0/8 -j MARK --set-mark 1
    iptables -t nat -A SHADOWSOCKS_WHITELIST -d 223.0.0.0/8 -j MARK --set-mark 1
    ```
    **重要:**
    1. `此处为服务器IP`更换为实际IP。
    2. `Ignore Asia IP address`为亚洲IP地址段。如果路由器内存够大的话，可开启`Ignore China IP address`。[chinadns_chnroute.txt 文件下载](https://github.com/softwaredownload/openwrt-fanqiang/blob/master/openwrt/default/etc/chinadns_chnroute.txt)
    3. `--to-ports 7654`即`/etc/shadowsocks.json`中的 **"local_port": 7654**
### shadowsocks 控制
```shell
/etc/init.d/shadowsocks stop
/etc/init.d/shadowsocks start
/etc/init.d/shadowsocks enable
/etc/init.d/shadowsocks disable
```
