# loop-anime

このプロジェクトは、React + TypeScript + Vite を使用して、JSONデータをもとにアニメーション表示を行うWebアプリケーションです。
JSONで定義されたテクスチャとアニメーション設定に基づいて、HTML5 Canvasにアニメーションを描画します。

## 機能
- JSONデータに基づくスプライトアニメーション
- レイヤー機能によるZ-indexの制御
- FPS、ループ設定などのカスタマイズ可能なアニメーション

## インストールと実行

1. 依存関係をインストール
```bash
npm ci
```

2. 開発サーバーを起動
```bash
npm run dev
```

3. ビルド
```bash
npm run build
```

4. Lintの実行
```bash
npm run lint
```

## 技術スタック
- React 18.3
- TypeScript
- Vite
- ESLint

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
