# CLO Assignment

The assignment for CLO set store page

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Redux Toolkit** - 状态管理
- **SASS** - CSS 预处理器
- **Vite** - 构建工具

## 项目结构

```
clo-assignment/
├── src/
│   ├── store/           # Redux store 配置
│   │   ├── store.ts     # Store 配置
│   │   ├── hooks.ts     # Typed hooks
│   │   └── slices/      # Redux slices
│   ├── App.tsx          # 主应用组件
│   ├── App.scss         # 应用样式
│   ├── main.tsx         # 应用入口
│   └── index.scss       # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## Redux 使用说明

项目使用 Redux Toolkit 进行状态管理。示例包含一个计数器 slice，你可以参考它来创建自己的 slices。

### 使用 Typed Hooks

```typescript
import { useAppDispatch, useAppSelector } from './store/hooks'

// 在组件中使用
const count = useAppSelector((state) => state.counter.value)
const dispatch = useAppDispatch()
```

### 创建新的 Slice

在 `src/store/slices/` 目录下创建新的 slice 文件，然后在 `src/store/store.ts` 中注册。
