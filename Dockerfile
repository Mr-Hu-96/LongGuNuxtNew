# 使用官方 Node 镜像（这里用 node:20） 放到 .output/server 里面
FROM node:20

# 设置工作目录
WORKDIR /www/wwwroot/www.longgu.com/views/nuxt


# 复制项目文件
COPY . .

# 暴露端口（比如项目跑在 3000 端口）
EXPOSE 3000

# 启动应用
CMD ["node", "server/index.mjs"]