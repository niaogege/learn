---
title: Docker
order: 10
group:
  title: Docker
  order: 2
  path: /server/Docker
nav:
  order: 6
  title: 'server'
  path: /server
---

需要了解以及掌握的

- Docker 部署前端项目
- Docker 部署 nodejs 项目
- 学会使用 docker-compose
- docker 高效部署

不知道从哪里开始学起 Docker? 只能看一点记一点知识

> 推荐阮老师的[Docker 入门教程](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html) > [Docker 从入门到实践](https://yeasy.gitbook.io/docker_practice/basic_concept)

### docker 概念

- image：镜像，**是一个只读模版，用来创建容器**。
- container: 容器，是一个**可运行的镜像实例**。
- Dockerfile: 镜像构建的模版，描述镜像构建的步骤。

### 镜像文件 Image

```js
// 列出所有镜像
docker images ls

// 删除images，通过image的id来指定删除谁
docker rmi <image id>

// 最后的那个点表示 Dockerfile 文件所在的路径，上例是当前路径，所以是一个点。
docker image build -t next-demo:0.0.1 .

// 从远程拉取镜像
docker image pull niaogege/next-demo:0.0.2
```

### 容器文件 Container

image 文件生成的容器实例，本身也是一个文件，称为容器文件。也就是说，一旦容器生成，就会同时存在两个文件： image 文件和容器文件。而且关闭容器并不会删除容器文件，只是容器停止运行而已。

容器停止运行之后，并不会消失，用下面的命令删除容器文件。

```bash
# 查出容器的 ID
docker container ls --all

# 删除指定的容器文件
docker container rm [containerID]

# 停止当前containerID
docker container kill [containerID]

## 生成容器
docker container run -p 8000:3000 -itd cpp-demo
docker container run -p 3002:3002 -itd niaogege/next-demo:0.0.2
docker container run -p 3002:3002 -itd next-demo:0.0.3

# 启动已经终止的容器
docker container start next-demo:0.0.3

# 进入容器
docker exec -it [containerID] /bin/sh

# 查看当前镜像内的文件
docker run -it --entrypoint sh <镜像名称>
# 退出当前镜像
exit
```

- -p 参数：容器的 3000 端口映射到本机的 8000 端口。
- -it 参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
- cpp-demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）。
- /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。
  > 或者是 /bin/sh

CONTAINER ID  
IMAGE  
COMMAND  
CREATED  
STATUS  
PORTS  
NAMES

### docker 实现原理的三大技术

回顾一下 Docker 实现原理的三大基础技术：

- **Namespace**：实现各种资源的隔离(基于 linux 提供了一种叫 namespace 的机制，可以给进程、用户、网络等分配一个命名空间，这个命名空间下的资源都是独立命名的。)
- **Control Group**：实现容器进程的资源访问限制( 基于 linux 操作系统的另一种机制：Control Group)
- **UnionFS**：实现容器文件系统的分层存储，写时复制，镜像合并

### dockfile

一般我们生成镜像都是通过 dockerfile 来描述的

```js
FROM nginx:1.15-alpine
COPY html /etc/nginx/html
COPY conf /etc/nginx/
WORKDIR /etc/nginx/html
```

- 基于 nginx:1.15 镜像做底座。
- 拷贝本地 html 文件夹内的文件，到镜像内 /etc/nginx/html 文件夹。
- 拷贝本地 conf 文件夹内的文件，到镜像内 /etc/nginx/ 文件夹。
- 指定当前工作目录为/etc/nginx/html

编写完成后，怎么生成镜像呢？我们只需要使用 docker build 命令就可以构建一个镜像了：

```js
docker build -t imageName:version .
```

-t: 声明要打一个镜像的 Tag 标签，紧跟着的后面就是标签。标签格式为 **镜像名:版本** . ：声明要寻找 dockerfile 文件的路径，. 代表当前路径下寻找。默认文件名为 Dockerfile。

在看另一个镜像： 部署 node 静态服务的例子

```js
FROM node:10

WORKDIR /app

COPY . /app

EXPOSE 8080

RUN npm install http-server -g

RUN npm install && npm run build

CMD http-server ./dist
```

Dokcer 是分层存储的，修改的时候会创建一个新的层，所以这里的每一行都会创建一个新的层

- FROM：**基于一个基础镜像来修改**
- WORKDIR：**指定当前工作目录**
- COPY：把容器外的内容复制到容器内
- EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
- RUN：在容器内执行命令
- CMD：**容器启动的时候执行的命令**

但其实这个例子不是很好，从上面流程的描述我们可以看出来，构建的过程只是为了拿到产物，容器运行的时候就不再需要了。

那能不能把构建分到一个镜像里，然后把产物赋值到另一个镜像，这样单独跑产物呢？

那岂不是要 build 写一个 dockerfile，run 写一个 dockerfile 吗？

也不用，**docker 支持多阶段构建**，比如这样

```bash
# build stage
FROM node:16 AS Node_build_image

WORKDIR /app

COPY . /app

EXPOSE 8888

RUN npm install && npm run build

# production stage

FROM node:16

WORKDIR /app

COPY --from=Node_build_image /app/dist ./dist

RUN npm i -g http-server

CMD http-server ./dist
```

我们把两个镜像的生成过程写到了一个 dockerfile 里，这是 docker 支持的多阶段构建。

- 第一个 FROM 里我们写了 as build_image，这是把第一个镜像命名为 build_image。

- 后面第二个镜像 COPY 的时候就可以指定 --from=build_image 来从那个镜像复制内容了。

这样，最终只会留下第二个镜像，这个**镜像里只有生产环境需要的依赖，体积更小。传输速度、运行速度也会更快**。构建镜像和运行镜像分离，这个算是一种最佳实践了。

### 发布 Image

首先，去 hub.docker.com 或 cloud.docker.com 注册一个账户。然后，用下面的命令登录。

```js
docker login
// 为本地的 image 标注用户名和版本。
docker image tag koa-demos:0.0.1 ruanyf/koa-demos:0.0.1
```

重新构建一下 image 文件

```js
docker image build -t [username]/[repository]:[tag]
```

最后，发布 image 文件。

```js
docker image push [username]/[repository]:[tag]
```

发布成功以后，登录 hub.docker.com，就可以看到已经发布的 image 文件。

### 参考

- [Docker 是怎么实现的？前端怎么用 Docker 做部署？](https://juejin.cn/post/7137621606469222414)
- [写给前端的 Docker 实战教程](https://juejin.cn/post/6844903946234904583)
- [Docker 入门教程](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
