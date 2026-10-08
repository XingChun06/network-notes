# 网络札记

计算机网络实验一静态网页作品，包含响应式主页、独立博客文章、本地图片和多个有效超链接。

## 本地预览

在此目录运行：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个空仓库。
2. 将本目录作为仓库根目录并推送到 `main` 分支。
3. 打开仓库的 `Settings > Pages`。
4. 在 `Build and deployment` 中选择 `GitHub Actions`。
5. 等待 `Deploy static site to GitHub Pages` 工作流完成。
6. 打开工作流给出的公网地址，逐项检查页面、图片和链接。

## 记录 HTTP 版本

打开已发布网页，按 `F12` 进入开发者工具，在 `Network` 面板启用 `Protocol` 列并刷新。记录主文档请求显示的 `http/1.1`、`h2` 或 `h3`，不要用本地预览结果代替公网结果。
