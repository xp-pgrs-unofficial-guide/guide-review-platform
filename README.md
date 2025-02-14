# 在线浏览及评论平台

这是一个简单易用的在线浏览及评论平台，专为[西浦博士生非官方攻略](https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide)开发。你可以通过此平台阅读攻略内容，并分章节进行评论和讨论。

针对此平台的功能需求，欢迎[提交 Issue](https://github.com/xp-pgrs-unofficial-guide/guide-review-platform/issues)；  
针对攻略的内容，详见攻略[中文版](https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide)或[英文版](https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide_EN)。

## 主要功能

- **在线阅读**：通过网页浏览器即可阅读文档内容
- **评论功能**：在每个章节下方都有评论区，方便讨论和交流
- **响应式设计**：在电脑、平板和手机上都能良好显示
- **简单导航**：通过左侧目录可以快速跳转到不同章节
- **用户系统**：支持用户注册、登录，发表评论需要登录

## 如何使用

1. 打开网页后，你会看到欢迎页面
2. 在左侧找到目录栏，点击你想阅读的章节
3. 在每个章节下方的评论区，你可以：
   - 阅读其他人的评论
   - 登录后添加自己的评论和想法
   - 参与讨论

## 技术说明

本项目使用以下技术构建：
- Next.js 15 - React 框架
- TypeScript - 类型安全的 JavaScript
- Tailwind CSS - 页面样式
- PostgreSQL - 数据库
- Prisma - 数据库 ORM
- NextAuth.js - 身份验证
- Docker - 容器化（可选）

## 开发相关

如果你想在本地运行这个项目：

1. 确保你的电脑已安装：
   - Node.js 18.0 或更高版本
   - npm 或 yarn 包管理器
   - 如果使用 Docker：Docker 和 Docker Compose

2. 克隆这个代码仓库：
   ```bash
   git clone https://github.com/xp-pgrs-unofficial-guide/guide-review-platform.git
   cd guide-review-platform/latex-review-platform
   ```

3. 安装依赖：
   ```bash
   npm install
   ```

4. 配置环境变量：
   在项目根目录创建 `.env` 文件，添加以下内容：
   ```bash
   # 数据库连接 URL（使用 Docker Compose 时的默认配置）
   DATABASE_URL="postgresql://username:password@localhost:5432/guide_review_db"
   
   # NextAuth 密钥（使用 openssl rand -base64 32 生成）
   NEXTAUTH_SECRET="your-secret-key"
   ```

5. 设置数据库：

   选项 1：使用 Docker Compose（推荐）
   ```bash
   # 启动 PostgreSQL 数据库容器
   docker compose up -d
   
   # 运行数据库迁移
   npx prisma db push
   
   # （可选）启动 Prisma Studio 查看数据库内容
   npx prisma studio
   ```
   
   选项 2：本地安装 PostgreSQL
   - 安装 PostgreSQL 数据库
   - 创建新的数据库：
     ```bash
     createdb guide_review_db
     ```
   - 运行数据库迁移：
     ```bash
     npx prisma db push
     ```
   - （可选）启动 Prisma Studio 查看数据库内容：
     ```bash
     npx prisma studio
     ```

   注意：如果使用 Docker Compose，数据库的默认配置为：
   - 用户名：username
   - 密码：password
   - 数据库名：guide_review_db
   - 端口：5432

6. 启动开发服务器：
   ```bash
   npm run dev
   ```

7. 打开浏览器访问 `http://localhost:3000`

## 数据库架构

项目使用 PostgreSQL 数据库，主要包含以下表：
- `User`: 用户信息
  - 用户名（唯一）
  - 密码（加密存储）
  - 邮箱（可选，唯一）
  - 创建和更新时间
  - 关联的评论

- `Chapter`: 章节信息
  - 标题
  - 关联的评论
  - 创建和更新时间

- `Comment`: 评论内容
  - 评论文本
  - 作者 ID 和作者名
  - 所属章节
  - 父评论 ID（用于回复功能）
  - 创建和更新时间
  - 与用户和章节的关联关系

详细的数据库架构可以在 `prisma/schema.prisma` 文件中查看。

## 安全说明

- 用户密码使用 bcrypt 加密存储
- 使用 NextAuth.js 处理身份验证
- 所有敏感信息都通过环境变量配置
- 评论提交需要用户登录

## 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。