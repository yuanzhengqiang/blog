#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名

git init
git add -A
git commit -m 'deploy'

git config --local user.name "yuanzhengqiang"
git config --local user.email yuanzhengqiangchn@gmail.com

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f https://github.com/yuanzhengqiang/blog.git master

git push -f https://0b6a6aa0e58d7f606bf387ae79e30ba2a547ce27@github.com/yuanzhengqiang/blog.git master:gh-pages

cd -
