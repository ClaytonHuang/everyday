From node:carbon

MAINTAINER claytonhuang <huang_haoce@zju.edu.cn>

ADD . /app
WORKDIR /app

RUN apt-get update && apt-get -y install xfonts-wqy
RUN rm -rf node_modules && npm i cnpm -g && cnpm install --registry=https://registry.npm.taobao.org

ENV NODE_ENV=test
EXPOSE 3030

CMD ["node", "./src/index.js"]