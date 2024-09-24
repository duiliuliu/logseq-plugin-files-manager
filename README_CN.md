# Logseq 文件管理器插件

[Chinese](README_CN.md) / [English](README.md)

本插件专为提高您管理日常文档和附件的效率而设计，帮助您轻松处理和组织与Logseq相关的文件。

![主界面](./images/app-main.jpg)

## 如何启动
您可以通过以下几种简便的方式启动文件管理器：
- 点击左侧边栏的“文件管理器”按钮
- 使用快捷键：
  - Windows系统：Ctrl + Shift + Enter
  - macOS系统：Cmd + Shift + Enter

![启动方式](./images/app-open.jpg)

- 安装完成后，文件管理器将自动开始构建数据库。在这个过程中，文件管理器左上角会显示“正在构建...”的提示。请耐心等待，直到该提示消失后再退出Logseq。
- **请注意：本插件目前对Logseq文档的目录读取，严格按照默认配置，如：pages、journals、assets目录分类各种文件；后续会尝试优化，读取用户配置**
- ![构建数据](./images/app-build.jpg)

- 您也可以在设置中手动点击“重建数据”，以刷新数据库。

![手动重建](./images/app-rebuild.jpg)

## 功能介绍
1. **打开文件**  
   - 直接在Logseq中打开Logseq文件。
   - 附件文件将根据文件类型打开：PDF文件将在Logseq内部打开，其他类型的文件将通过系统默认程序打开。

2. **复制文件路径**  
   - 一键复制文件的完整路径，方便在其他应用中快速访问。

3. **检索文件**  
   - 快速搜索功能，帮助您在大量文件中迅速定位所需文件。

4. **卡片视图和列表视图**  
   - 可在设置中切换展示方式，以卡片或列表形式展示文件，提供更直观的文件预览和操作界面。
   - ![卡片视图](./images/app-card.jpg)
   - 卡片与列表切换：![卡片与列表切换](./images/app-card-switch.jpg)

5. **文件预览**
   - 可点击文件名称预览文件内容, 点击空白地方可退出预览。请注意：由于浏览器限制，部分文件可能无法预览。
   - ![文件预览](./images/app-preview.jpg)


### 开发计划

- [ ] 实现文件重命名功能
- [ ] 添加删除无用附件的功能

以下是针对待办事项（TODO）的中文润色版本，增加了详细的描述和使用场景：

### TODO 列表

- [ ] **1. 实现文件重命名功能**
   - **描述**：开发一套用户友好的文件重命名机制，允许用户通过直观的操作界面轻松更改文件名称，以提高文件管理的灵活性和个性化。
   - **使用场景**：当用户需要整理大量文件，或者需要根据项目进度更新文件名以反映最新状态时，此功能将非常有用。

- [ ] **2. 添加删除无用附件的功能**
   - **描述**：设计一个智能且高效的无用附件清理能力，帮助用户识别并删除不再需要的附件，释放存储空间，保持文件库的整洁。
   - **使用场景**：日常文档编辑，或者在项目结束后，或者在进行年度文件整理时，用户可以利用此功能快速清理过时或不再相关的文件附件。

- [ ] **3. 支持URL数据，作为虚拟附件管理**
   - **描述**：开发一种机制，将URL链接作为虚拟附件进行管理，允许用户像管理本地文件一样管理这些在线资源，提高资源的可访问性和组织性。
   - **使用场景**：当用户需要整合分散在不同网站上的资源，或者需要保存大量的在线文档和数据时，此功能将极大地简化管理过程。

- [ ] **4. 支持card数据管理和展示**
   - **描述**：构建CARD数据管理系统，提供比现有Logseq闪卡更先进的横向管理能力，包括数据的创建、编辑、分类和展示。
   - **使用场景**：适用于需要进行复杂信息组织和回顾的学习者和研究人员，特别是在进行语言学习、考试复习或项目规划时。

- [ ] **5. 支持page创建时，添加默认的属性，比如createdAt**
   - **描述**：实现一个功能，允许用户在创建新页面时自动添加默认属性，如创建时间、作者等，以简化页面初始化过程并保持信息的一致性。
   - **使用场景**：对于需要严格文档管理流程的团队和项目，此功能可以确保所有页面都包含必要的元数据，便于未来的检索和审计。


## 支持语言

- 中文
- 英语
- 日语

您可以通过更改Logseq的设置来切换语言，以使上述更改生效。

## 感谢

- 本插件tab能力参考插件：[logseq-assets-plus](https://github.com/xyhp915/logseq-assets-plus)
- 本插件card能力参考插件：[logseq-cardbox](https://github.com/sosuisen/logseq-cardbox)

## 支持开发

如果您喜欢这个插件，请考虑捐赠以支持其持续开发。

![捐赠](./images/WechatIMG9.jpg)

