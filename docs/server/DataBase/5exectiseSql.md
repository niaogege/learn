---
title: Mysql中练习sql
order: 5
group:
  title: DataBase
  order: 2
  path: /server/DataBase
nav:
  order: 6
  title: 'server'
  path: /server
---

## 参考

[MySQL 数据库中配置 外键约束。 外键表示数据库中的关联关系](https://prisma.yoga/guides/general-guides/database-workflows/foreign-keys/mysql#2-%E4%BD%BF%E7%94%A8%E5%8D%95%E5%88%97%E5%A4%96%E9%94%AE%E7%BA%A6%E6%9D%9F%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%E8%A1%A8)

1.在数据库中创建了两个名为 User 和 Post 的表。 Post 表通过定义在 authorId 列上的外键引用了 User 表。

```sql
create Table 'demo'.'User' (
  'id' INT AUTO_INCREMENT Primary KEY,
  'name' Varchar(256)
)
create table 'demo'.'Post' (
  'id' INT AUTO_INCREMENT PRIMARY KEY,
  'title' varchar(256),
  'authorId': INT,
  constraint 'author' Foreign key ('authorId') references 'User'('id')
)
```

2.多列外键约束的表

```sql
CREATE TABLE `ForeignKeyDemo`.`AnotherUser` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(256),
  `lastName` VARCHAR(256),
  UNIQUE (`firstName`, `lastName`)
);

CREATE TABLE `ForeignKeyDemo`.`AnotherPost` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` TEXT,
  `authorFirstName` VARCHAR(256),
  `authorLastName` VARCHAR(256),
  FOREIGN KEY (`authorFirstName`, `authorLastName`) REFERENCES `AnotherUser`(`firstName`, `lastName`)
);
```

> 注意：AnotherUser 上的 UNIQUE 约束需要能够将列作为外键引用。

在数据库中创建了两个名为 AnotherUser 和 AnotherPost 的表。 AnotherPost 表通过定义在 authorFirstName 和 authorLastName 列上的外键引用了 AnotherUser 表。
