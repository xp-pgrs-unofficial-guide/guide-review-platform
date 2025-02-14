# 文档评审系统

这是一个简单易用的在线文档评审平台，专门用于查看和评论 LaTeX 文档。无论你是否了解网页开发或 LaTeX，都可以轻松使用这个系统。

## 主要功能

- **在线阅读**：通过网页浏览器即可阅读文档内容
- **评论功能**：在每个章节下方都有评论区，方便讨论和交流
- **LaTeX 公式支持**：完美显示数学公式
- **响应式设计**：在电脑、平板和手机上都能良好显示
- **简单导航**：通过左侧目录可以快速跳转到不同章节

## 如何使用

1. 打开网页后，你会看到欢迎页面
2. 在左侧找到目录栏，点击你想阅读的章节
3. 在每个章节下方的评论区，你可以：
   - 阅读其他人的评论
   - 添加自己的评论和想法
   - 参与讨论

## 技术说明

本项目使用以下技术构建：
- Next.js - 网页框架
- Tailwind CSS - 页面样式
- LaTeX 解析器 - 用于处理文档内容
- PostgreSQL - 数据库
- Prisma - 数据库 ORM

## 开发相关

如果你想在本地运行这个项目：

1. 确保你的电脑已安装 Node.js
2. 克隆这个代码仓库
   ```bash
   git clone --recursive https://github.com/your-username/latex-review-platform.git
   cd latex-review-platform
   ```
   注意：使用 `--recursive` 标志确保所有子模块也被克隆。如果你已经克隆了仓库但忘记了这个标志，可以在仓库目录中运行：
   ```bash
   git submodule update --init --recursive
   ```
3. 在项目目录下运行：
   ```bash
   npm install
   npm run dev
   ```
4. 配置环境变量：
   在项目根目录创建 `.env` 文件，添加以下内容：
   ```bash
   # 数据库连接 URL（替换用户名和密码）
   DATABASE_URL="postgresql://username:password@localhost:5432/guide_review_db"
   
   # NextAuth 密钥（使用 openssl rand -base64 32 生成）
   NEXTAUTH_SECRET="your-secret-key"
   ```

5. 设置数据库：
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

6. 打开浏览器访问 `http://localhost:3000`

## 系统要求

- Node.js 18.0 或更高版本
- PostgreSQL 12.0 或更高版本
- npm 或 yarn 包管理器

## 数据库架构

项目使用 PostgreSQL 数据库，主要包含以下表：
- `User`: 用户信息（用户名、邮箱、密码等）
- `Comment`: 评论内容（评论文本、作者、章节等）
- `Session`: 用户会话信息

详细的数据库架构可以在 `prisma/schema.prisma` 文件中查看。

## 安全说明

- 用户密码使用 bcrypt 加密存储
- 使用 NextAuth.js 处理身份验证
- 所有敏感信息都通过环境变量配置
- 评论提交需要用户登录

## 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。