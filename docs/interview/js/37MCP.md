---
title: MCP?如何写一个MCP？
order: 37
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- 参考[MCP 官网](https://modelcontextprotocol.io/introduction)
- [cursor 中调用 MCP](https://docs.cursor.com/context/model-context-protocol)
- [MCP (Model Context Protocol)，一篇就够了。](https://zhuanlan.zhihu.com/p/29001189476)

什么是 MCP？Model Context Protocol,模型上下文协议  (MCP) 是由  Anthropic  公司推出的一个开放协议，它标准化了应用程序如何向大型语言模型 (LLM) 提供上下文和工具的方式。我们可以将 MCP 理解为 AI 应用的"USB-C 接口"——就像 USB-C 为各种设备提供了标准化的连接方式，MCP 为 AI 模型提供了与不同数据源和工具连接的标准化方式。简单来说，MCP 可以做到以下事情：

- 读取和写入本地文件
- 查询数据库
- 执行命令行操作
- 控制浏览器
- 与第三方 API 交互。

### MCP 工作原理

- MCP 的核心是客户端-服务器(client-sever)架构，其中主机应用程序可以连接到多个服务器
- MCP 主机：希望通过 MCP 访问数据的程序，例如 Claude Desktop、IDE 或 AI 工具
- 客户端：与服务器保持 1:1 连接的协议客户端
- 服务器：轻量级程序，每个程序都通过标准化模型上下文协议公开特定功能
- 本地数据源：MCP 服务器可以安全访问的您的计算

### MCP architecture 解构

MCP 由三个核心组件构成：Host、Client 和 Server。让我们通过一个实际场景来理解这些组件如何协同工作：

假设你正在使用 Claude Desktop (Host) 询问："我桌面上有哪些文档？"

- Host：Claude Desktop 作为 Host，负责接收你的提问并与 Claude 模型交互。
- Client：当 Claude 模型决定需要访问你的文件系统时，Host 中内置的 MCP Client 会被激活。这个 Client 负责与适当的 MCP Server 建立连接。
- Server：在这个例子中，文件系统 MCP Server 会被调用。它负责执行实际的文件扫描操作，访问你的桌面目录，并返回找到的文档列表。整个流程是这样的：你的问题 → Claude Desktop(Host) → Claude 模型 → 需要文件信息 → MCP Client 连接 → 文件系统 MCP Server → 执行操作 → 返回结果 → Claude 生成回答 → 显示在 Claude Desktop 上。

这种架构设计使得 Claude 可以在不同场景下灵活调用各种工具和数据源，而开发者只需专注于开发对应的 **MCP Server**，无需关心 Host 和 Client 的实现细节。

![MCP architecture](https://pic3.zhimg.com/v2-3f7ceba80b16ef134b27119308a04472_1440w.jpg)

### 原理：模型是如何确定工具的选用的？
