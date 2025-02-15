# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 设置构建环境变量
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp

# 复制依赖文件
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine
WORKDIR /app

# 复制构建文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 安装生产依赖
COPY package*.json ./
RUN npm install --production

# 设置运行时环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"] 