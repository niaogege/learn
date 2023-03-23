---
title: Docker-compose
order: 6
group:
  title: Docker
  order: 2
  path: /server/Docker
nav:
  order: 6
  title: 'server'
  path: /server
---

- docker-compose 用来解决什么
- docker-compose 配置模板
- 如何高效利用 docker-compose

我们知道使用一个 Dockerfile 模板文件可以定义一个单独的应用容器，如果需要定义多个容器就需要服务编排。服务编排有很多种技术方案，今天给大家介绍 Docker 官方产品 Docker Compose。 Dockerfile 可以让用户管理一个单独的应用容器；而 Compose 则允许用户在一个模板(YAML 格式) 中定义一组相关联的应用容器( 被称为一个 project，即项目)，例如一个 Web 服务容器再加上后端的数据库服务容器等。

首先介绍几个术语。

- 服务 (service)：一个应用容器，实际上可以运行多个容器实例。
- 项目/工程 (project)：由一组关联的**应用容器**组成的一个完整业务单元。可见，一个项目可以由多个服务（容器）关联而成，Compose 面向项目进行管理。

一个工程当中可包含多个服务，每个服务中定义了容器运行的镜像、参数、依赖。一个服务当中可包括**多个容器实例**，Docker-Compose 并没有解决负载均衡的问题，因此需要借助其它工具实现负载均衡，比如 Consul

### 场景 1

最常见的项目是 web 网站，该项目应该包含 web 应用和缓存。

- 编写 dockerfile

```bash
# 选择更小体积的基础镜像
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
```

- docker-compose.yml 编写 docker-compose.yml 文件，这个是 Compose 使用的主模板文件。

```yml
version: '3'
services:
  web:
    build: .
    ports:
      - '5000:5000'

  redis:
    image: 'redis:alpine'
```

- 运行 docker-compse

```bash
docker-compose -d up web
```

### docker-compose 字段介绍

假设我们编写一个关于 nginx 的 yml 文件：

```bash
# docker-compose.yml
version: '3' 	#版本号
services:		#docker容器
  nginx:		#容器名称
    container_name: nginx-1		#自定义启动后容器名
    restart: always				#设置为always，表明此容器应该在停止的情况下总是重启
    image: nginx:latest			#镜像名:版本号
    ports:						#启动端口号
      - 4433:80
    volumes:					#数据卷，将容器中的文件与服务器映射
      - ./conf.d:/etc/nginx/conf.d
    environment:				#环境配置
      TZ: Asia/shandong
```

### docker-compose 常用命令

```bash
 # 1. 基于docker-compose.yml启动管理的容器
docker-compose up -d
# 2. 关闭并删除容器
docker-compose down
# 3. 开启|关闭|重启已经存在的由docker-compose维护的容器
docker-compose start|stop|restart
# 4. 查看由docker-compose管理的容器
docker-compose ps
# 5. 查看日志
docker-compose logs -f
```
