------
title: Elasticsearch 随手记
date: 2019-03-23 13:53
tags:
  - Elasticsearch
categories:
  - 服务端
------
Elasticsearch 随手记 😋
<!--more-->

## ElasticSearch 对比 MySQL
- Index -> Database
- Type -> Table
- Document -> Row
---

## 索引模版数据类型
- 字符串类型 ~~string~~,text,keyword 
- 整数类型 integer,long,short,byte 
- 浮点类型 double,float,half_float,scaled_float 
- 逻辑类型 boolean 
- 日期类型 date 
- 范围类型 range 
- 二进制类型 binary 
- 复合类型 数组类型 array 
- 对象类型 object 
- 嵌套类型 nested 
- 地理类型 地理坐标类型 geo_point 
- 地理地图 geo_shape 
- 特殊类型 IP类型 ip 
- 范围类型 completion 
- 令牌计数类型 token_count 
- 附件类型 attachment 
- 抽取类型 percolator 

---

## API 接口
> pretty 格式化
> explain=true 分析
> * 通配符

### 监控操作
- 监控
```json
# 查询所有监控指令
curl --user elastic:changeme -XGET http://127.0.0.1:9200/_cat
```

### 节点操作
- 查看节点状态
```json
# 查看设置
curl --user elastic:changeme -XGET http://127.0.0.1:9200/_cluster/settings?pretty
```
- 实时更改配置
```json
# 永久生效
curl --user elastic:changeme -XPUT http://127.0.0.1:9200/_cluster/settings -H "Content-type: application/json" -d '{
    "persistent": {
    }
}'
# 暂时生效
curl --user elastic:changeme -XPUT http://127.0.0.1:9200/_cluster/settings -H "Content-type: application/json" -d '{
    "transient": {}
}'
```

### 数据操作
- 创建索引模版
```json
curl --user elastic:changeme -XPUT http://127.0.0.1:9200/db_test2 -H "Content-type: application/json" -d '{
    "settings":{
        # 节点数量
        "number_of_replicas": 0,
        # 分片数量
        # "number_of_shards": 5,
        # 索引存储类型
        # "index.store.type": "niofs",
        # 默认检索字段
        # "index.query.default_field": "title"
        # "index.unassigned.node_left.delayed_timeout": "5m"
    },
    "mappings": {
        "example": {
            # 动态变更
            "dynamic": false,
            # 5.x 以上废除
            "_all": {
                "enabled": false
            },
            "properties": {
                "example_id": {
                    "type": "long"
                },
                "name": {
                    "type": "text",
                    # 指定分词器
                    "analyzer": "ik_max_word",
                    "search_analyzer": "ik_max_word"
                },
                "text": {
                    "type": "keyword"
                },
                "title": {
                    "type": "text",
                    "index": true
                },
                "createdAt": {
                    "type": "date",
                    "format": "strict_date_optional_time||epoch_millis"
                },
                "age": {
                    "type": "integer"
                },
                "location": {
                    # es 中存储结构为: {lon: 0.000, lat: 0.000}
                    "type": "geo_point"
                },
                "suggest": {
                    "type": "completion"
                }
            }
        }
    }
}'
```
- 删除索引模版
```json
curl --user elastic:changeme -XDELETE http://127.0.0.1:9200/db_test
```
- 查询索引模版
```json
curl --user elastic:changeme -XGET http://127.0.0.1:9200/db_test\?pretty
```
- 插入数据
```json
curl --user elastic:changeme -XPOST http://127.0.0.1:9200/db_test/example -H "Content-type: application/json" -d '{
    "example_id": 666
}'
```
- 查询数据
```json
# 查询所有
curl --user elastic:changeme -XPOST http://127.0.0.1:9200/db_test/example/_search?pretty
# 按条件查询
curl --user elastic:changeme -XPOST http://127.0.0.1:9200/db_test/example/_search?pretty&explain=true -H "Content-type: application/json" -d '{
    "query": {
        "match": {
            "example_id": 666
        }
    }
}'

# 查询指定
curl --user elastic:changeme -XGET http://127.0.0.1:9200/db_test/example/PiAmoGkBJAdUJ3wD4CMC?pretty=true
```

### 分析操作
- 分词器接口
```json
# 使用默认分词器
curl --user elastic:changeme -XPOST http://127.0.0.1:9200/_analyze?pretty -H 'Content-Type:application/json' -d'{ 
    "text": "Hello World" 
}'
# 使用指定分词器
curl --user elastic:changeme -XPOST http://127.0.0.1:9200/_analyze?pretty -H 'Content-Type:application/json' -d'{
    "analyzer": "ik_max_word",
    "text": "Hello World" 
}'
```

---

## Java 调用
- 创建索引
```java
private boolean createOrUpdateIndex(Long id) {
        if (house == null) {
        return false;
        }
        ExampleIndexTemplate template = // .. 通过构建得出

        SearchRequestBuilder requestBuilder = this.esClient.prepareSearch(INDEX_NAME)
                .setTypes(INDEX_TYPE)
                .setQuery(QueryBuilders.termQuery("example_id", id));

        logger.debug(requestBuilder.toString());
        SearchResponse searchResponse = requestBuilder.get();

        boolean success;
        long totalHit = searchResponse.getHits().getTotalHits();
        if (totalHit == 0) {
            success = create(template);
        } else if (totalHit == 1) {
            String esId = searchResponse.getHits().getAt(0).getId();
            success = update(id, template);
        } else {
            success = deleteAndCreate(totalHit, template);
        }
}
// --
    private boolean create(ExampleIndexTemplate indexTemplate) {
        try {
            IndexResponse response = this.esClient.prepareIndex(INDEX_NAME, INDEX_TYPE)
                    .setSource(objectMapper.writeValueAsBytes(indexTemplate), XContentType.JSON).get();
            if (response.status() == RestStatus.CREATED) {
                return true;
            } else {
                return false;
            }
        } catch (JsonProcessingException e) {
            return false;
        }
    }

    private boolean update(Long id, ExampleIndexTemplate indexTemplate) {
        try {
            UpdateResponse response = this.esClient.prepareUpdate(INDEX_NAME, INDEX_TYPE, id).setDoc(objectMapper.writeValueAsBytes(indexTemplate), XContentType.JSON).get();

            if (response.status() == RestStatus.OK) {
                return true;
            } else {
                return false;
            }
        } catch (JsonProcessingException e) {
            return false;
        }
    }

    private boolean deleteAndCreate(long totalHit, ExampleIndexTemplate indexTemplate) {
        DeleteByQueryRequestBuilder builder = DeleteByQueryAction.INSTANCE
                .newRequestBuilder(esClient)
                .filter(QueryBuilders.termQuery("example_id", indexTemplate.getId()))
                .source(INDEX_NAME);

        BulkByScrollResponse response = builder.get();
        long deleted = response.getDeleted();
        if (deleted != totalHit) {
            return false;
        } else {
            return create(indexTemplate);
        }
    }
```
- 移除索引模版
```java
    private void remove(Long id) {
        DeleteByQueryRequestBuilder builder = DeleteByQueryAction.INSTANCE
                .newRequestBuilder(esClient)
                .filter(QueryBuilders.termQuery("example_id", id))
                .source(INDEX_NAME);
        BulkByScrollResponse response = builder.get();
        long deleted = response.getDeleted();
    }
```
- 简单搜索
```java

// 通过搜索查询出id， 然后于 mysql 之类数据库进行聚合
List<Serializable> search(SearchBody body){
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

        // 满足filter子句的条件。但是不会像Must一样，参与计算分值
        boolQuery.filter(
            // QueryBuilders.termQuery
            // QueryBuilders.rangeQuery
            //..
        )

//        提高权重, 如果需要的话
//        boolQuery.must(
//                QueryBuilders.matchQuery("title", body.getKeywords())
//                        .boost(2.0f)
//        );

        // [必须满足的意思] 满足must子句的条件，并且参与计算分值
        boolQuery.must(
            // QueryBuilders.multiMatchQuery  关键词匹配多个字段
            //..
        )

        // 满足should子句的条件。在一个Bool查询中，如果没有must或者filter，有一个或者多个should子句，那么只要满足一个就可以返回
        boolQuery.should(
            //..
        )

        // 不满足must_not定义的条件
        boolQuery.should(
            //..
        )

        SearchRequestBuilder requestBuilder = this.esClient.prepareSearch(INDEX_NAME)
                .setTypes(INDEX_TYPE)
                // 查询条件
                .setQuery(boolQuery)
                // 排序
                .addSort(
                        "createdAt", "DESC"
                )
                // 开始位置
                .setFrom(0)
                .setSize(100)
                // 设置该字段可以有效减少返回数据量
                .setFetchSource("id", null);
        SearchResponse response = requestBuilder.get();

        List<Long> ids = new ArrayList<>();
        for (SearchHit hit : response.getHits()) {
            System.out.println(hit.getSource());
            ids.add(Longs.tryParse(String.valueOf(hit.getSource().get("example_id"))));
        }
        return ids;
}
```
- 自动补全
```java
    // 匹配
    Collection<String> suggest(String prefix){
        CompletionSuggestionBuilder suggestion = SuggestBuilders.completionSuggestion("suggest").prefix(prefix).size(5);

            SuggestBuilder suggestBuilder = new SuggestBuilder();
            suggestBuilder.addSuggestion("autocomplete", suggestion);

            SearchRequestBuilder requestBuilder = this.esClient.prepareSearch(INDEX_NAME)
                    .setTypes(INDEX_TYPE)
                    .suggest(suggestBuilder);

            SearchResponse response = requestBuilder.get();
            Suggest suggest = response.getSuggest();
            if (suggest == null) {
                return ServiceResult.of(new ArrayList<>());
            }
            Suggest.Suggestion result = suggest.getSuggestion("autocomplete");

            int maxSuggest = 0;
            Set<String> suggestSet = new HashSet<>();

            for (Object term : result.getEntries()) {
                if (term instanceof CompletionSuggestion.Entry) {
                    CompletionSuggestion.Entry item = (CompletionSuggestion.Entry) term;

                    if (item.getOptions().isEmpty()) {
                        continue;
                    }

                    for (CompletionSuggestion.Entry.Option option : item.getOptions()) {
                        String tip = option.getText().string();
                        if (suggestSet.contains(tip)) {
                            continue;
                        }
                        suggestSet.add(tip);
                        maxSuggest++;
                    }
                }

                if (maxSuggest > 5) {
                    break;
                }
            }
            return suggestSet;
    }

    // 设置权重
    private boolean updateSuggest(ExampleIndexTemplate indexTemplate) {
        AnalyzeRequestBuilder requestBuilder = new AnalyzeRequestBuilder(
                this.esClient, AnalyzeAction.INSTANCE, INDEX_NAME, 
                // 会被搜索的字段的值..
                );

        // 使用的分词器
        requestBuilder.setAnalyzer("ik_smart");

        AnalyzeResponse response = requestBuilder.get();
        List<AnalyzeResponse.AnalyzeToken> tokens = response.getTokens();
        if (tokens == null) {
            return false;
        }

        List<HouseSuggest> suggests = new ArrayList<>();
        for (AnalyzeResponse.AnalyzeToken token : tokens) {
            // 生效限制
            if ("<NUM>".equals(token.getType()) || token.getTerm().length() < 2) {
                continue;
            }

            ExampleSuggest suggest = // ..
            suggests.add(suggest);
        }

        // 其他影响因素
        ExampleSuggest suggest = // ..
        suggests.add(suggest);

        indexTemplate.setSuggest(suggests);
        return true;
    }

```
- 聚合统计
```java
long aggregateNumber(String c1, String c2, String c3){

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .filter(QueryBuilders.termQuery(
                    // 聚合条件
                ))
                .filter(QueryBuilders.termQuery(
                    // 聚合条件
                ))
                .filter(QueryBuilders.termQuery(
                    "field_name",
                    c1
                ));

        SearchRequestBuilder requestBuilder = this.esClient.prepareSearch(INDEX_NAME)
                .setTypes(INDEX_TYPE)
                .setQuery(boolQuery)
                .addAggregation(
                        AggregationBuilders.terms("agg_number")
                        .field("field_name")
                ).setSize(0);

        logger.debug(requestBuilder.toString());

        SearchResponse response = requestBuilder.get();
        if (response.status() == RestStatus.OK) {
            Terms terms = response.getAggregations().get("agg_number");
            if (terms.getBuckets() != null && !terms.getBuckets().isEmpty()) {
                return terms.getBucketByKey(c1).getDocCount();
            }
        } else {
            return 0L;
        }
        return 0L;
}

```
- 位置范围查询
```java
    @Override
    public Collection<Long> mapQuery(SearchBody body) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        boolQuery.filter(QueryBuilders.termQuery(
            // ..
        ));

        boolQuery.filter(
            QueryBuilders.geoBoundingBoxQuery("location")
                .setCorners(
                        // 左上角
                        new GeoPoint(body.getLeftLatitude(), body.getLeftLongitude()),
                        // 右下角
                        new GeoPoint(body.getRightLatitude(), body.getRightLongitude())
                ));

        SearchRequestBuilder builder = this.esClient.prepareSearch(INDEX_NAME)
                .setTypes(INDEX_TYPE)
                .setQuery(boolQuery)
                .addSort(
                    // ..
                )
                .setFrom(0)
                .setSize(100);

        List<Long> ids = new ArrayList<>();
        SearchResponse response = builder.get();
        if (RestStatus.OK != response.status()) {
            return ids;
        }

        for (SearchHit hit : response.getHits()) {
            ids.add(hit.getSource().get("example_id"));
        }
        return ids;
    }
```

---

## JSON格式查询语法
[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
### 概要
> - must`参与计算分值` -> and
> - filter`不参与计算分值` -> and
> - should -> or
> - must_not -> not
```json
// 布尔查询
{
  "query": { 
    "bool": { 
      // The clause (query) must appear in matching documents and will contribute to the score.
      // 所有"must"条件必须匹配成功, 且计算分数
      "must": [
        { "match": { "title":   "Search"        }}, 
        { "match": { "content": "Elasticsearch" }}  
      ],
      // The clause (query) must appear in matching documents. However unlike must the score of the query will be ignored. Filter clauses are executed in filter context, meaning that scoring is ignored and clauses are considered for caching.
      // 所有"filter"条件必须匹配成功, 不计算分数(因此查询速度较快)
      "filter": [ 
        { "term":  { "status": "published" }}, 
        { "range": { "publish_date": { "gte": "2015-01-01" }}} 
      ],
      // The clause (query) should appear in the matching document. If the bool query is in a query context and has a must or filter clause then a document will match the bool query even if none of the should queries match. In this case these clauses are only used to influence the score. If the bool query is a filter context or has neither must or filter then at least one of the should queries must match a document for it to match the bool query. This behavior may be explicitly controlled by settings the minimum_should_match parameter.
      // 情况一(嵌套bool): 当"should"条件在"must"条件或者"filter"条件内, 此时不要求满足"should"条件, 但是会影响到查询分数
      // 情况二(单条bool): 当"should"条件不在"must"条件或者"filter"条件内, 默认情况至少有一个"should"子句需要满足(可通过配置`minimum_should_match`参数进行变更)
      "should": [
        { "range": {"age" : { "gte" : 10, "lte" : 20 }}}
      ],
      "minimum_should_match": 1,
      // The clause (query) must not appear in the matching documents. Clauses are executed in filter context meaning that scoring is ignored and clauses are considered for caching. Because scoring is ignored, a score of 0 for all documents is returned.
      // 所有"must_not"条件不能匹配成功
      "must_not": [
        { "term": { "tag" : "wow" }},
        { "term": { "tag" : "elasticsearch" }}
      ]
    }
  }
}
```

### 全文搜索
> 会走分析器
- match
> 描述: 匹配查询, 只需包含部分。eg: hello world, 只匹配"hello"或者"world"
> 可接受类型: text/numerics/dates
```json
GET /_search
// 简单查询
{
    "query": {
        "match" : {
            "message" : "this is a test"
        }
    }
}
// 复杂查询
{
    "query": {
        "match" : {
            "message" : {
                "query": "this is a test",
                "参数": "值"
            }
        }
    }
}
```

- match_phrase
> 描述: 匹配词组查询, 多个词一起被查询. eg: hello world, 匹配"hello world"

- match_phrase_prefix
> 描述: 同`match_phrase`但是最后一个词会被当作前缀去匹配. eg: hello wo, 可匹配到"hello world"

- multi_match
> 描述: 同`match`但是可以作用在多个字段上，且字段支持表达式
```json
GET /_search
{
  "query": {
    "multi_match" : {
      "query":    "this is a test", 
      "fields": [ "subject", "*_name" ],
      "参数": "值"
    }
  }
}
```

- common
> 描述: 根据词频进行匹配.

```json
GET /_search
{
    "query": {
        "common": {
            "body": {
                "query": "this is bonsai cool",
                // 词频率: [0, 1]
                "cutoff_frequency": 0.001
            }
        }
    }
}
```

- query_string
> 描述: 根据表达式进行匹配, 输入的值为表达式, 支持一些内置参数和语法。

```json
GET /_search
{
    "query": {
        "query_string": {
            "query": "(content:this OR name:this) AND (content:that OR name:that)"
        }
    }
}
```

- simple_query_string
> 描述: 与`query_string`类似, 支持一些更简便的符号。

```json
GET /_search
{
  "query": {
    "simple_query_string" : {
        "query": "\"fried eggs\" +(eggplant | potato) -frittata",
        "fields": ["title^5", "body"],
        "default_operator": "and"
    }
  }
}
```

### 条件查询
> 精准搜索
> 一般用于结构化数据而非全文匹配: numbers, dates, and enums

- [term](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
> 描述: 匹配单个值, 类似"=", 但是其具备`Elasticsearch`的特性如: 分数
```json
// 简单
POST _search
{
  "query": {
    "term" : { "user" : "Kimchy" } 
  }
}
// 复杂，设定匹配分数之类的
GET _search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "status": {
              "value": "urgent",
              "boost": 2.0 
            }
          }
        },
        {
          "term": {
            "status": "normal" 
          }
        }
      ]
    }
  }
}
```

- [terms](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)
> 描述: 匹配多个值, 类似"in"

```json
// 简单
GET /_search
{
    "query": {
        "terms" : { "user" : ["kimchy", "elasticsearch"]}
    }
}
```

- [terms_set](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-set-query.html)
> 描述: 定制化匹配规则

```json
GET /my-index/_search
{
    "query": {
        "terms_set": {
            "codes" : {
                "terms" : ["abc", "def", "ghi"],
                "minimum_should_match_field": "required_matches"
            }
        }
    }
}
```

- [range](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
> 描述: 范围匹配, 支持: string，date，numeric

```json
GET _search
{
    "query": {
        "range" : {
            "age" : {
                "gte" : 10,
                "lte" : 20,
                "boost" : 2.0
            }
        }
    }
}
```

- [exists](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)
> 描述: 存在查询, 必须至少存在一个非`null`值. eg: user: [null, 'hocgin']

```json
GET /_search
{
    "query": {
        "exists" : { "field" : "user" }
    }
}
```

- [prefix](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)
> 描述: 前缀匹配.

```json
GET /_search
{ "query": {
    "prefix" : { "user" : "ki" }
  }
}
```

- [wildcard](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
> 描述: 通配符匹配。类似`like`
```json
GET /_search
{
    "query": {
        "wildcard" : { "user" : "ki*y" }
    }
}
```

- [regexp](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)
> 描述: 正则匹配，允许使用正则表达式。
> ⚠️: 性能取决于正则表达式写法，建议用`饥饿模式`

```json
GET /_search
{
    "query": {
        "regexp":{
            "name.first": "s.*y?"
        }
    }
}
```

- [fuzzy](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)
> 描述: 模糊查询. 适用于拼写错误时搜索。

```json
GET /_search
{
    "query": {
       "fuzzy" : { "user" : "ki" }
    }
}
```

- [type](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html)
> 描述: 文档类型查询

```json
GET /_search
{
    "query": {
        "type" : {
            "value" : "_doc"
        }
    }
}
```

- [ids](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)
> 描述: 根据`id`字段过滤文档数据

```json
GET /_search
{
    "query": {
        "ids" : {
            "type" : "_doc",
            "values" : ["1", "4", "100"]
        }
    }
}
```

### 复合查询
- [constant_score](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html#query-dsl-constant-score-query)
> 描述: 忽略评分查询, 查询速度更快(使用缓存)。
```json
GET /_search
{
    "query": {
        "constant_score" : {
            "filter" : {
                "term" : { "user" : "kimchy"}
            },
            "boost" : 1.2
        }
    }
}
```

- [Bool 查询](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
> 描述: 使用其他查询的bool值组合的查询。详细参考`概要`

```json
POST _search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "user" : "kimchy" }
      },
      "filter": {
        "term" : { "tag" : "tech" }
      },
      "must_not" : {
        "range" : {
          "age" : { "gte" : 10, "lte" : 20 }
        }
      },
      "should" : [
        { "term" : { "tag" : "wow" } },
        { "term" : { "tag" : "elasticsearch" } }
      ],
      "minimum_should_match" : 1,
      "boost" : 1.0
    }
  }
}
```

- [Dis Max Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html)
> 描述: 取多个条件查询结果中，得分最高的查询结果。可以通过: `tie_breaker` 来关联其他查询结果的分数。

```json
GET /_search
{
    "query": {
        "dis_max" : {
            // 此处相当于除最佳匹配外，其他匹配结果的参与程度.   --- 言外之意, 多方面考虑
            "tie_breaker" : 0.7,
            "boost" : 1.2,
            "queries" : [
                {
                    "term" : { "age" : 34 }
                },
                {
                    "term" : { "age" : 35 }
                }
            ]
        }
    }
}
```

- [Function Score Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)
> 描述: 打分器. 最后打分阶段，引入一些最佳值的计算方式.         --- 言外之意，作弊器
```json
GET /_search
{
    "query": {
        "function_score": {
            "query": { "match_all": {} },
            "boost": "5",
            "random_score": {}, 
            "boost_mode":"multiply"
        }
    }
}
```

- [Boosting Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-boosting-query.html)
> 描述: 设置条件的权重.

```json
GET /_search
{
    "query": {
        "boosting" : {
            "positive" : {
                "term" : {
                    "field1" : "value1"
                }
            },
            "negative" : {
                 "term" : {
                     "field2" : "value2"
                }
            },
            "negative_boost" : 0.2
        }
    }
}
```

### 连接查询
- [Nested Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html#query-dsl-nested-query)
> 描述

```json
GET /_search
{
    "query": {
        "nested" : {
            // 嵌套对象路径
            "path" : "obj1",
            // 影响的计分方式
            "score_mode" : "avg",
            "query" : {
                "bool" : {
                    "must" : [
                        // ⚠️: 字段必须是完整路径
                    { "match" : {"obj1.name" : "blue"} },
                    { "range" : {"obj1.count" : {"gt" : 5}} }
                    ]
                }
            }
        }
    }
}
```
---
- [Has Child Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html)
> 描述: 进行子文档查询, 返回父文档. 慢查询，慎用

```json
GET /_search
{
    "query": {
        "has_child" : {
            "type" : "blog_tag",
            "score_mode" : "min",
            "query" : {
                "term" : {
                    "tag" : "something"
                }
            }
        }
    }
}
```
---
- [Has Parent Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html)
> 描述: 父文档查询，返回子文档. 

```json
GET /_search
{
    "query": {
        "has_parent" : {
            "parent_type" : "blog",
            "query" : {
                "term" : {
                    "tag" : "something"
                }
            }
        }
    }
}
```

---
- [Parent Id Query]()
> 描述: 父ID查询，返回子文档

```json
GET /my_index/_search
{
  "query": {
    "parent_id": {
      "type": "my_child",
      "id": "1"
    }
  }
}
```

---

### 地理位置查询
> 需要`geo_shape`类型
- [GeoShape Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html)
> 描述: GeoShape 查询，查询在多边形(基于GeoJSON)内的点。既: 用一个多边形去搜索。

```json
GET /example/_search
{
    "query":{
        "bool": {
            "must": {
                "match_all": {}
            },
            "filter": {
                "geo_shape": {
                    "location": {
                        "shape": {
                            "type": "envelope",
                            "coordinates" : [[13.0, 53.0], [14.0, 52.0]]
                        },
                        "relation": "within"
                    }
                }
            }
        }
    }
}
```

---
- [Geo Bounding Box Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html#query-dsl-geo-bounding-box-query)
> 描述: 地理边界框查询，即用一个边界范围去搜索。

```json
GET /_search
{
    "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
            "filter" : {
                "geo_bounding_box" : {
                    "pin.location" : {
                        "top_left" : {
                            "lat" : 40.73,
                            "lon" : -74.1
                        },
                        "bottom_right" : {
                            "lat" : 40.01,
                            "lon" : -71.12
                        }
                    }
                }
            }
        }
    }
}
```

---
- [Geo Distance Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
> 描述: 地理距离查询

```json
GET /my_locations/_search
{
    "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
            "filter" : {
                "geo_distance" : {
                    "distance" : "200km",
                    "pin.location" : {
                        "lat" : 40,
                        "lon" : -70
                    }
                }
            }
        }
    }
}
```

---
- [Geo Polygon Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html)
> 描述: 地理多边形查询, 返回围栏内的数据

```json
GET /_search
{
    "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
            "filter" : {
                "geo_polygon" : {
                    "person.location" : {
                        "points" : [
                            {"lat" : 40, "lon" : -70},
                            {"lat" : 30, "lon" : -80},
                            {"lat" : 20, "lon" : -90}
                        ]
                    }
                }
            }
        }
    }
}
```

---
### 定制化查询
- [More Like This Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
> 描述: 根据字段进行匹配文字的相识度，一般用于进行文章或内容的相识度推荐

```json
GET /_search
{
    "query": {
        "more_like_this" : {
            "fields" : ["title", "description"],
            "like" : "Once upon a time",
            "min_term_freq" : 1,
            "max_query_terms" : 12
        }
    }
}
```

---
- [Script Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-script-query.html)
> 描述: 脚本查询，使用特定的语法脚本进行查询。

```json
GET /_search
{
    "query": {
        "bool" : {
            "filter" : {
                "script" : {
                    "script" : {
                        "source": "doc['num1'].value > 1",
                        "lang": "painless"
                     }
                }
            }
        }
    }
}
```

---
- [Percolate Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-percolate-query.html)
> 描述: Percolate查询，可用于匹配存储在索引中的查询, 

```json
GET /my-index/_search
{
    "query" : {
        "percolate" : {
            "field" : "query",
            "document" : {
                "message" : "A new bonsai tree in the office"
            }
        }
    }
}
```

---
- [Wrapper Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wrapper-query.html)
> 描述: 包装器查询, 将查询条件字符串 base64 编码

```json
GET /_search
{
    "query" : {
        "wrapper": {
            // {"term" : { "user" : "Kimchy" }}
            "query" : "eyJ0ZXJtIiA6IHsgInVzZXIiIDogIktpbWNoeSIgfX0=" 
        }
    }
}
```
---
### 跨度查询
- [Span Term Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-term-query.html)
> 描述: 等价于`term`

```json
GET /_search
{
    "query": {
        "span_term" : { "user" : "kimchy" }
    }
}
```

---
- [Span Multi Term Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-multi-term-query.html)
> 描述: 多个跨度查询组合, 允许 (wildcard, fuzzy, prefix, range or regexp query) 之一

```json
GET /_search
{
    "query": {
        "span_multi":{
            "match":{
                "prefix" : { "user" :  { "value" : "ki", "boost" : 1.08 } }
            }
        }
    }
}
```

---
- [Span First Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-first-query.html#query-dsl-span-first-query)
> 描述: 跨度优先查询，
```json
GET /_search
{
    "query": {
        "span_first" : {
            "match" : {
                "span_term" : { "user" : "kimchy" }
            },
            "end" : 3
        }
    }
}
```
---
- [Span Near Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-near-query.html)
> 描述: 接受多个跨度查询，其匹配必须在彼此的指定距离内，并且可能以相同的顺序。

```json
GET /_search
{
    "query": {
        "span_near" : {
            "clauses" : [
                { "span_term" : { "field" : "value1" } },
                { "span_term" : { "field" : "value2" } },
                { "span_term" : { "field" : "value3" } }
            ],
            "slop" : 12,
            "in_order" : false
        }
    }
}
```
---
- [Span Or Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-or-query.html)
> 描述: 组合多个跨度查询 - 返回与任何指定查询匹配的文档。

```json
GET /_search
{
    "query": {
        "span_or" : {
            "clauses" : [
                { "span_term" : { "field" : "value1" } },
                { "span_term" : { "field" : "value2" } },
                { "span_term" : { "field" : "value3" } }
            ]
        }
    }
}
```
---
- [Span Not Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-not-query.html)
> 描述: 包装另一个span查询，并排除与该查询匹配的任何文档。

```json
GET /_search
{
    "query": {
        "span_not" : {
            "include" : {
                "span_term" : { "field1" : "hoya" }
            },
            "exclude" : {
                "span_near" : {
                    "clauses" : [
                        { "span_term" : { "field1" : "la" } },
                        { "span_term" : { "field1" : "hoya" } }
                    ],
                    "slop" : 0,
                    "in_order" : true
                }
            }
        }
    }
}
```
---
- [Span Containing Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-containing-query.html)
> 描述: 接受跨度查询列表，但仅返回与第二个跨度查询匹配的跨度。

```json
curl -X GET "localhost:9200/_search" -H 'Content-Type: application/json' -d'
{
    "query": {
        "span_containing" : {
            "little" : {
                "span_term" : { "field1" : "foo" }
            },
            "big" : {
                "span_near" : {
                    "clauses" : [
                        { "span_term" : { "field1" : "bar" } },
                        { "span_term" : { "field1" : "baz" } }
                    ],
                    "slop" : 5,
                    "in_order" : true
                }
            }
        }
    }
}
'
```
---
- [Span Within Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-within-query.html)
> 描述: 只要其跨度落在由其他跨度查询列表返回的跨度内，就会返回单跨度查询的结果。

```json
curl -X GET "localhost:9200/_search" -H 'Content-Type: application/json' -d'
{
    "query": {
        "span_within" : {
            "little" : {
                "span_term" : { "field1" : "foo" }
            },
            "big" : {
                "span_near" : {
                    "clauses" : [
                        { "span_term" : { "field1" : "bar" } },
                        { "span_term" : { "field1" : "baz" } }
                    ],
                    "slop" : 5,
                    "in_order" : true
                }
            }
        }
    }
}
'
```
---
- [Span Field Masking Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-field-masking-query.html)
> 描述: 允许查询不同的字段span-near或span-or跨不同字段。

```json
curl -X GET "localhost:9200/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "span_near": {
      "clauses": [
        {
          "span_term": {
            "text": "quick brown"
          }
        },
        {
          "field_masking_span": {
            "query": {
              "span_term": {
                "text.stems": "fox"
              }
            },
            "field": "text"
          }
        }
      ],
      "slop": 5,
      "in_order": false
    }
  }
}
'

```


## 插件
> elasticsearch-plugin install {url}
- [中文分词插件](https://github.com/medcl/elasticsearch-analysis-ik)

---
## 文档
[ElasticSearch 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
[全文搜索引擎 Elasticsearch 入门教程](http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html)
