FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server.mjs ./
COPY modules ./modules
COPY public ./public
COPY dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

RUN mkdir -p /data /app/.data && chown -R node:node /data /app 2>/dev/null || true
USER node
CMD ["node", "server.mjs"]
