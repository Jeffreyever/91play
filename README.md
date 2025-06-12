# 91Play - 免费在线游戏平台

91Play是一个提供免费在线游戏的网站，专注于时尚装扮、医疗模拟、美食烹饪和创意装饰等类型的游戏。

## 功能特点

- 多种游戏类别：时尚装扮、医疗游戏、美食烹饪、创意装饰
- 响应式设计：支持电脑和移动设备访问
- 现代化界面：简洁美观的用户界面
- 游戏分类：便捷的游戏分类系统

## 技术栈

- HTML5
- CSS3
- JavaScript
- Python (用于数据处理)

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/你的用户名/91play.git
cd 91play
```

2. 安装Python依赖（如果需要）：
```bash
pip install -r requirements.txt
```

3. 启动本地服务器：
```bash
python -m http.server 8000
```

4. 访问网站：
打开浏览器访问 `http://localhost:8000`

## 项目结构

```
91play/
├── index.html          # 主页
├── games.html          # 游戏列表页
├── game-template.html  # 游戏模板页
├── style.css          # 样式表
├── games-data.js      # 游戏数据
├── games_data.json    # 游戏数据JSON
├── thumbnails/        # 游戏缩略图
└── games/            # 游戏页面
```

## 部署

本项目可以部署在任何支持静态网站的平台上，如：
- GitHub Pages
- Netlify
- Vercel
- 等

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE) 