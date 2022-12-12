---
title: Docker Dockerfiler 定制镜像
order: 2
group:
  title: Docker
  order: 2
  path: /server/Docker
nav:
  order: 6
  title: 'server'
  path: /server
---

dockerfile 定制镜像。在项目的根目录创建 Dockerfile 文件来定制我们的镜像. Dockerfile 是一个文本文件，其内包含了一条条的 指令(Instruction)，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。

```bash
# 拉取pm2
FROM treehouses/pm2-tags:arm64-202211250840
# build
FROM node:16
WORKDIR /Next
COPY . /Next
RUN npm install && npm i -g pm2 && npm run build
EXPOSE 3002
CMD npm run server
```

常用的几个字段 FROM/WORKDIR/COPY/RUN/CMD

### FROM

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。就像我们之前运行了一个 nginx 镜像的容器，再进行修改一样，基础镜像是必须指定的。而 FROM 就是指定 基础镜像，因此一个 Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令。

在 [Docker Hub](https://hub.docker.com/) 上有非常多的高质量的官方镜像，有可以直接拿来使用的**服务类**的镜像，如 nginx、redis、mongo、mysql、httpd、php、tomcat 等；也有一些方便开发、构建、运行各种语言**应用的镜像**，如 node、openjdk、python、ruby、golang 等。可以在其中寻找一个最符合我们最终目标的镜像为基础镜像进行定制。

如果没有找到对应服务的镜像，官方镜像中还提供了一些更为基础的**操作系统镜像**，如 ubuntu、debian、centos、fedora、alpine 等，这些操作系统的软件库为我们提供了更广阔的扩展空间。

除了选择现有镜像为基础镜像外，Docker 还存在一个特殊的镜像，名为 **scratch**。这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。

```bash
FROM scratch
```

### WORKDIR

格式为 WORKDIR <工作目录路径>。如使用 WORKDIR 指令可以来指定工作目录（或者称为当前目录），以后各层的当前目录就被改为指定的目录，如该目录不存在，WORKDIR 会帮你建立目录。

```bash
WORKDIR /Next
```

进到该容器，能看到文件目录

```bash
docker exec -it [containerId] bash
```

### RUN

你可能会问，RUN 命令与 CMD 命令的区别在哪里？简单说，RUN 命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；CMD 命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个 RUN 命令，但是只能有一个 CMD 命令。

注意，指定了 CMD 命令以后，docker container run 命令就不能附加命令了（比如前面的/bin/bash），否则它会**覆盖 CMD 命令**。现在，启动容器可以使用下面的命令。

### CMD

CMD 指令的格式和 RUN 相似，也是两种格式：

- shell 格式：CMD <命令>
- exec 格式：CMD ["可执行文件", "参数 1", "参数 2"...]

参数列表格式：CMD ["参数 1", "参数 2"...]。在指定了 ENTRYPOINT 指令后，用 CMD 指定具体的参数。
