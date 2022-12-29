---
title: Docker Container 容器
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

容器是**镜像的运行时的实例**，我们可以从一个镜像上启动一个或多个容器。

> 容器是镜像运行时的载体，没有镜像如何生成容器

对容器的管理包括创建、启动、停止、进入、导入导出和删除等，我们分别来看下每个操作的具体命令以及效果。

## 容器的创建/启动/停止/销毁/进入容器

### 容器创建

```bash
docker run -itd -p 3002:3002 cpp-demo:0.0.1
```

新建并启动一个容器用的命令是 docker run，它后面有时候会带上有很长很长的选项，不过其基本的语法如下：

它可以带上一些常见的选项：

```bahs
-d：容器在后台运行
-t：为容器重新分配一个伪输入终端，通常与-i 同时使用
-i：以交互模式运行容器，通常与-t 同时使用
-P：随机端口映射
-p：指定端口映射
--name：为容器指定一个名称
-e：设置环境变量
--dns：指定容器使用的 DNS 服务器
-m：设置容器使用内存最大值
--net="bridge": 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；
--link：链接另一个容器
-v：绑定卷
--rm：退出容器后删除该容器
```

当使用 run 命令创建容器时，Docker 在后台进行了如下的操作：

- 检查本地是否存在指定的镜像，不存在就从 registry 下载
- 利用镜像创建并启动一个容器
- 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
- 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
- 从地址池配置一个 ip 地址给容器
- 执行用户指定的应用程序
- 执行完毕后容器被终止

### 删除/终止

```bash
// 查看正在运行的容器列表
docker ps
// delete
docker container kill [containerId]
docker rm [containerId]
// 如果要删除一个运行中的容器，可以添加-f参数：
docker rm -f [containerId]
// 终止
docker container stop [containerId]

```

### 进入容器

```bash
docker exec -it [containerId] sh

# 退出容器
exit
```

docker exec 后边可以跟多个参数，这里主要说明 -i -t 参数。只用 -i 参数时，由于没有分配伪终端，界面没有我们熟悉的 Linux 命令提示符，但命令执行结果仍然可以返回。当 -i -t 参数一起使用时，则可以看到我们熟悉的 **Linux 命令提示符**。

> 需要注意的是，我们进入的容器需要是运行状态，如果不是运行状态，则会报错：

### 查看容器日志

```bash
docker logs [containerId]
```

### 分析容器

```bash
docker inspect [containerId]
```
