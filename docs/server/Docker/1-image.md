---
title: Docker Image
order: 1
group:
  title: Docker
  order: 2
  path: /server/Docker
nav:
  order: 6
  title: 'server'
  path: /server
---

首先我们来弄懂镜像的概念，Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

如果有装系统经验的童鞋，可以把 Docker 镜像理解为一个操作系统的镜像（ISO 文件），它是一个固定的文件，从一个镜像中，我们可以装到很多电脑上，变成一个个的操作系统（相当于容器），每个系统都是相同的，不过可以选择定制化安装。

和系统镜像不同的是，Docker 镜像并不是像 ISO 文件那样整体打包成一个文件的，而是设计成了分层存储的架构，它并不是由一个文件组成，而是由多层文件联合组成。

构建镜像时，会一层层的构建，前面一层是后面一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。

其次是容器的概念，从编程的角度看，镜像和容器的关系更像是类和实例的关系；一个镜像可以启动一个或者多个容器；**镜像是静态的定义，容器是镜像运行时的实体**。容器可以被创建、启动、停止、删除、暂停等。

## 镜像的相关操作：查找/获取/删除/构建/发布

运行容器需要本地有相应的镜像，如果没有会从远程仓库下载；那么我们来看下如何操作镜像。

### 查找镜像

```bash
docker search nodejs
docker search nginx
```

### 获取镜像我们要获取镜像，可以通过 docker pull 命令，它的格式如下：

```bash
docker pull <repository>:<tag>
docker pull niaogege/next-demo:0.0.6
```

从下载过程我们可以看出我们上面说的分层存储的概念，即镜像是由多层存储构成；下载也是一层层的去下载，而不是单独一个文件；因此如果下载中有某个层已经被其他镜像下载过，则会显示 Already exists。下载过程中给出了每一层的 ID 的前 12 位，下载结束后给出镜像完整的 sha256 摘要。

Docker 的镜像仓库分为官方仓库和非官方，官方的镜像就是从 Docker Hub 拉取的；如果想要从第三方的镜像仓库获取，可以在仓库名称前加上仓库的服务地址：

### 构建镜像

```bash
docker build [选项] <上下文路径/URL/->
docker build -t cpp-demo:0.0.1 .
```

上下文路径是做什么用的呢？要理解这个路径的作用，我们首先要来理解 Docker 的架构。

Docker 是一个典型的 C/S 架构的应用，它可以分为 Docker 客户端（平时敲的 Docker 命令）和 Docker 服务端（Docker 守护进程）。Docker 客户端通过 REST API 和服务端进行交互，docker 客户端每发送一条指令，底层都会转化成 REST API 调用的形式发送给服务端，服务端处理客户端发送的请求并给出响应。

因此表面上看我们好像在本机上执行各种 Docker 的功能，实际上都是都是在 Docker 服务端完成的，包括 Docker 镜像的构建、容器创建、容器运行等工作都是 Docker 服务端来完成的，Docker 客户端只是承担发送指令的角色。

理解了 Docker 的架构就很容器理解 Docker 构建镜像的工作原理了，它的流程大致如下：

- 执行 build 命令
- Docker 客户端会将构建命令后面指定的**上下文路径下**的所有文件打包成一个**tar 包**，发送给 Docker 服务端;
- Docker 服务端收到客户端发送的 tar 包，然后解压，根据 Dockerfile 里面的指令进行镜像的**分层构建**；

因此上下文路径本质上就是指定服务端上 Dockerfile 中指令工作的目录；比如我们在 Dockerfile 中经常需要拷贝代码到镜像中去，因此会这么写：

```bash
COPY ./dist /app/
```

这里要复制的 dist 文件，并不一定在 docker build 命令执行的目录下，也不一定是在 Dockerfile 文件同级目录下，而是 docker build 命令指定的上下文路径目录下的 dist。

### 删除镜像

```bash
docker rmi [imageId]

// 列出所有的镜像
docker image ls
```

### 发布镜像

手写需要登录 dockerhub,然后输入账号和密码

```bash
docker login
// 给当前需要发布的镜像打上标签和用户名
docker image tag cpp-demos:0.0.1 niaogege/koa-demos:0.0.1
// publish
docker image push niaogege/koa-demos:0.0.1
```

### 参考

- [前端抢饭碗系列之初识 Docker 容器化部署](https://mp.weixin.qq.com/s/6DEWpGVsmFMKFaxWadxCAw)
