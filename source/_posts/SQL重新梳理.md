------
title: SQL的重新梳理
date: 2017-04-07 09:19:09
tags:
  - SQL
  - Tips
categories:
  - Server
------
持续积累..
<!--more-->

## 关于 SQL 执行顺序
### 资料
[参考](http://www.uol123.com/2013/01/26/sql%E8%AF%AD%E5%8F%A5%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86.html)

### 例句
```sql
select * from t_1 join t_2
on t_1.id = t_2.fid
where 1=1
group by t_1.className
having t_1.className = '1班'
order by id desc;
```

> 这是一条简单/规范的基本SQL。

### 注意
1. SQL三个很重要的位置**on/where/having**
它们分别对应着 **join/from/group** 形成后的虚表进行筛选。

2. **select**部分并不是一开始就执行的，而是表数据确认完毕，只差排序的时候执行的。
并且select中的**函数/DISTINCT/TOP**也是在**select**执行阶段执行的

3. **聚合函数**需Group后才可执行, **普通函数**随执行步骤执行(正常执行)

### 具体顺序
1. FROM FROM后面的表标识了这条语句要查询的数据源。和一些子句如，（1-J1）笛卡尔积，（1-J2）ON过滤，（1-J3）添加外部列，所要应用的对象。FROM过程之后会生成一个虚拟表VT1。
(1-J1)笛卡尔积 这个步骤会计算两个相关联表的笛卡尔积(CROSS JOIN) ，生成虚拟表VT1-J1。
(1-J2)ON过滤 这个步骤基于虚拟表VT1-J1这一个虚拟表进行过滤，过滤出所有满足ON 谓词条件的列，生成虚拟表VT1-J2。
(1-J3)添加外部行  如果使用了`外连接(外连接才会加入字段/数据)`，保留表中的不符合ON条件的列也会被加入到VT1-J2中，作为外部行，生成虚拟表VT1-J3。`此时 不符合ON的会被加入回来`
2. WHERE 对VT1过程中生成的临时表进行过滤，满足where子句的列被插入到VT2表中。 `数据现在还没有被分组，因此现在你不能使用聚合运算-`
3. GROUP BY 这个子句会把VT2中生成的表按照GROUP BY中的列进行分组。生成VT3表。`每一个分组必须只能返回一行(除非被过滤掉)，即每一行整体都无重复，对于没有出现GROUP BY后面的列必须使用聚合函数(如 MAX ,MIN,COUNT,AVG等)，保证每一个GROUP只返回一行`
4. HAVING 这个子句对VT3表中的不同的组进行过滤，满足HAVING条件的子句被加入到VT4表中。
5. SELECT 这个子句对SELECT子句中的元素进行处理，生成VT5表。
(5-1)计算表达式 计算SELECT 子句中的表达式，生成VT5-1 `如果这个sql语句是一个聚合查询，在GROUP BY之后，你只能使用GROUP BY中的列，对不属于GROUP集合中的列必须使用聚合运算`
(5-2)DISTINCT 寻找VT5-1中的重复列，并删掉，生成VT5-2
(5-3)TOP 从ORDER BY子句定义的结果中，筛选出符合条件的列。生成VT5-3表
6. ORDER BY 从VT5-3中的表中，根据ORDER BY 子句的条件对结果进行排序，生成VC6表。`唯一一个可以使用SELECT子句创建的别名的地方`

> **聚合函数**是对一组值执行计算并返回单一的值的函数

```sql
SELECT C.customerid, COUNT(O.orderid) AS numorders
FROM dbo.Customers AS C
  LEFT OUTER JOIN dbo.Orders AS O
    ON C.customerid = O.customerid
WHERE C.city = 'Madrid'
GROUP BY C.customerid
HAVING COUNT(O.orderid)
```

## 关于 表 Joins
>  Joins 子句用于结合两个或多个数据库中表的记录, 也就是说是**通过某种联系建立表之间的关联, 并形成一张新表**

### SQL 定义了三种主要类型的连接
- 交叉连接 ( **CROSS JOIN** ), 又称 **笛卡尔积**
> 会形成庞大的表, 因此慎用。
> **假设:** 表t1(5行数据, 3列), 表t2(4行数据, 2列)
> **SQL:** select * from t1 cross join t2
> **结果:** 数据数量为20行数据(5 * 4), 5列

- 内连接 ( **INNER JOIN** ), 通常可省略 `inner`
> 通过 `on` 或 `where` 建立表之间的联系或者说**表形成的条件**
> **假设:** 表t1(5行数据, 3列), 表t2(4行数据, 2列)
> **SQL:** select * from t1 inner join t2 on t1.sid = t2.sid
> **结果:** 查询操作列出与连接条件匹配的数据行, 5列

- 外连接 ( **OUTER JOIN** )
> 外连接为内连接的扩展, 主要区别在于哪边为基准, 使用 `on` 进行数据关联
> 外连接分为: `左外连接`、`右外连接`、`全外连接`
> 部分SQL语言并不包含全部种类, 例如
> SQLite 之包含 **左外连接**
  - 左外连接 ( **LEFT JOIN** )
    > **假设:** 表t1(5行数据, 3列), 表t2(4行数据, 2列)
    > **SQL:** select * from t1 left join t2 on t1.sid = t2.sid
    > **结果:** 以左表为基准, 将数据按条件进行连接, 左表行全部显示, 若右表没有满足条件的行则显示为NULL, 5列

  - 右外连接 ( **RIGHT JOIN** )
    > **假设:** 表t1(5行数据, 3列), 表t2(4行数据, 2列)
    > **SQL:** select * from t1 right join t2 on t1.sid = t2.sid
    > **结果:** 以右表为基准, 将数据按条件进行连接, 右表行全部显示, 若左表没有满足条件的行则显示为NULL, 5列

  - 全外连接 ( **FULL JOIN** )
    > **假设:** 表t1(5行数据, 3列), 表t2(4行数据, 2列)
    > **SQL:** select * from t1 full join t2 on t1.sid = t2.sid
    > **结果:** 完整的显示两表的数据, 将数据按条件进行连接, 当没有被关联的表中没有存在满足条件的行时, 则显示为NULL, 5列
