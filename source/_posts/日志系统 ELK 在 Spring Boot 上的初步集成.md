------
title: 日志系统ELK在Spring Boot上的初步集成
date: 2018-01-22 16:53
tags:
  - ELK
categories:
  - 服务端
------
日志系统 ELK 在 Spring Boot 上的初步集成 😋
<!--more-->
## ELK
> Elasticsearch + Logstash + Kibana，一个比较流行的日志系统。当然，你也可以尝试使用阿里云。如果钱多的话:)

### Logstash
> 日志搬运, 可以指定从 Redis/Log4j..处获取日志信息，然后进行过滤，再提交给 `Elasticsearch` 进行分析。

```shell
# 安装 & 启动
brew install logstash
# brew services restart logstash
# ./bin/logstash -f config/logstash.conf
```

### Elasticsearch
> 日志存储 / 查询 / 分析

```shell
# 安装 & 启动
brew install elasticsearch
brew services restart elasticsearch
```
如果你想直接查看、操作或者研究 `elasticsearch` 存储的内容，可以考虑使用 `elasticsearch-head` 进行操作。
#### UI 操作界面
```shell
git clone git://github.com/mobz/elasticsearch-head.git
cd elasticsearch-head
npm install
npm run start
open http://localhost:9100
```
如果 Elasticsearch 安装了 X-Path 那么需要在配置文件中(`elasticsearch.yml`), 加入:
```yml
http.cors.enabled: true 
http.cors.allow-origin: '*' 
http.cors.allow-headers: "Authorization"
```
对了, 这里有一款[elasticsearch-head Chrome Plug-in](https://chrome.google.com/webstore/detail/elasticsearch-head/ffmkiejjmecolpfloofpjologoblkegm/related) 推荐。

### Kibana
> UI 界面

```shell
wget https://www.elastic.co/downloads/kibana
tar -xvf kibana.tar.gz
./kibana/bin/kibana
open http://localhost:5601/
```

### Spring Boot 集成
1. `pom.xml` 引入 `logback` 支持。
```xml
        <dependency>
            <groupId>net.logstash.logback</groupId>
            <artifactId>logstash-logback-encoder</artifactId>
            <version>4.11</version>
        </dependency>
```
2. 在 `resources/` 文件夹内创建 `logback-spring.xml` 文件。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>dev.local:4560</destination>
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder"/>
    </appender>

    <include resource="org/springframework/boot/logging/logback/base.xml"/>

    <root level="INFO">
        <appender-ref ref="LOGSTASH"/>
        <appender-ref ref="CONSOLE"/>
    </root>

</configuration>
```
3. 配置 logstash, 创建 `logstash.conf`。
```conf
input {
    tcp {
        port => 4560
        codec => json_lines
    }
}
output {
    elasticsearch {
        action => "index"
        hosts => ["127.0.0.1:9200"]
        index => "applog"
    ;    user => "elastic"
    ;    password => "changeme"
    }
}
```
启动logstash `./bin/logstash -f logstash.conf`

4. 使用。
```java
@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class TestControllerTest {
    Random random = new Random();
    @Test
    public void testList() throws Exception {
        while (true) {
            Thread.sleep(1000);
            log.info("Hello world form hocgin");
            if (random.nextBoolean()) {
                log.info("sksdjkf " + random.nextInt(1000));
            }
        }
    }
}
```

## 关于 Kibana 安全配置
- [Configuring Security in Kibana](https://www.elastic.co/guide/en/kibana/current/using-kibana-with-security.html)
1. 安装 x-pack.
```shell

logstash-plugin install x-pack

elasticsearch-plugin install x-pack

kibana-plugin install x-pack
```
2. 修改 `config/kibana.yml`
```
elasticsearch.username: "elastic" 
elasticsearch.password: "changeme"
```

3. 修改 `logstash.conf`。
```conf
input {
    tcp {
        port => 4560
        codec => json_lines
    }
}
output {
    elasticsearch {
        action => "index"
        hosts => ["127.0.0.1:9200"]
        index => "applog"
        user => "elastic"
        password => "changeme"
    }
}
```

### 如果忘记 ElasticSearch 密码
1. 停止 `ElasticSearch` 服务
2. 创建一个管理员用户
```shell
x-pack/users useradd my_admin -p my_password -r superuser
```
3. 启动 `ElasticSearch` 服务
4. 使用 API 修改密码
```shell
curl -u my_admin -XPUT 'http://localhost:9200/_xpack/security/user/elastic/_password?pretty' -H 'Content-Type: application/json' -d'
{
  "password" : "new_password"
}'
``

## ELK Docker
- [ELK Docker](https://github.com/spujadas/elk-docker)
简而言之:
```shell
# :5601 - Kibana
# :9200 - Elasticsearch
# :5044 - Logstash
sudo docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk sebp/elk
```
---

> :2019年3月23日，星期六 补充


## ELK
### L
配置文件位置: `{}/config/`
```conf
; 输入
input {
    file {
        path => ["{path}"]
        ; 设置类型
        type => "nginx_access"
        ; 起点位置
        start_position => "beginning"
    }
}
; 数据清洗
filter {
    if [type] == "nginx_access" {
        grok {
            patterns_dir => "{path}"
            match => {
                "message" => "%{NGINXACCESS}"
            }
        }

        ; 格式化date字段时间格式
        date {
            match => ["timestamp", "dd/MMM/YYYY:HH:mm:ss Z"]
        }

        ; 解析param字段
        if[param] {
            ruby {
                init => "@kname = ['quote', 'url_args']"
                code => "
                    new_event = LogStash::Event.new(Hash[@kname.zip(event.get('param').split('?'))])
                    new_event.remove('@timestamp')
                    event.append(new_event)
                "
            }
        }

        if[url_args] {
            ruby {
                init => "@kname = ['key', 'value']"
                code => "
                    event.set(
                        'nested_args', 
                        event.get('url_args').split('&').collect {|i| Hash[@kname.zip(i.split('='))]}
                    )
                "
                remove_field => ["url_args", "param", "quote"]
            }
        }

        ;修改指定字段的内容 
        mutate {
            ; 转换类型
            convert => ["response", "integer"]
            remove_field => ["timestamp"]
        }


    } 
}
; 输出
output {
    stdout {
        codec => rubydebug
    }

    elasticsearch {
        ; 位置
        hosts => ["{url}"]
        ; 索引格式
        index => "logstash-%{type}-%{+YYYY.MM.dd}"
        document_type => "%{type}"
        ; 每次多少数量
        flush_size => 200
        ; 发送间隔时间
        idle_flush_time => 1
        ; 是否重新清洗
        sniffing = true
        ; 用户名
        user => "{user}"
        ; 密码
        password => "{password}"
    }
}
```
解析器文件位置: `{}/config/patterns/`

---

### K
配置文件位置: `{}/config/kibana.yml`
```yaml
elasticsearch.url: '{url}'
elasticsearch.username: '{username}'
elasticsearch.password: '{password}'
```
默认端口: `8601`

---

