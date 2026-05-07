# BitGates Website 上线操作手册

当前项目是纯静态网站，线上目录是 `public/`。

## 推荐方案：Cloudflare Pages

适合本项目：免费 CDN、自动 HTTPS、静态站发布简单、自定义域名管理方便。

### 1. 本地检查

```bash
npm run check
npm run preview
```

预览地址：

```text
http://localhost:4321
```

### 2. Cloudflare Pages 创建项目

Cloudflare Dashboard → Workers & Pages → Create application → Pages。

两种方式任选其一：

#### A. Direct Upload（最快）

上传 `public/` 目录。

#### B. Git 连接（推荐长期维护）

把本目录提交到 GitHub，然后在 Cloudflare Pages 连接仓库：

- Framework preset: `None`
- Build command: 留空，或填 `npm run build`
- Build output directory: `public`

### 3. 绑定域名

Pages 项目 → Custom domains → Set up a custom domain。

常见 DNS：

- 根域名，例如 `example.com`：按 Cloudflare 指引添加记录。
- `www.example.com`：通常添加 CNAME，指向 Cloudflare Pages 给出的目标域名。

### 4. 上线后必须检查

- `https://你的域名/` 能打开
- 浏览器地址栏显示 HTTPS 安全锁
- 图片、CSS、JS 正常加载
- 手机端导航正常
- 分享卡片图片正常显示

### 5. 域名确定后建议补充

把 `public/index.html` 里的 Open Graph 图片改成绝对地址，例如：

```html
<meta property="og:image" content="https://你的域名/assets/og-card.jpg">
```

并添加 `canonical` 与 `sitemap.xml`。
