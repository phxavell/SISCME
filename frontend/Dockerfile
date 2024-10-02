FROM node:18-bullseye

WORKDIR /home/user/app/frontend

RUN apt-get update && apt-get install -y python3 python3-pip git sudo && apt-get clean && pip install pre-commit && usermod -aG sudo node

RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && chmod 0440 /etc/sudoers.d/node

COPY ./frontend/package.json /home/user/app/frontend

RUN npm cache clean --force && npm install

EXPOSE 8081

CMD ["npm", "run", "dev"]
