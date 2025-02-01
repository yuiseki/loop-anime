// レイヤーの型定義
export interface Layer {
  x: number; // X座標
  y: number; // Y座標
  width: number; // 幅
  height: number; // 高さ
  basePositionX: number; // ベースX座標
  basePositionY: number; // ベースY座標
  zIndex: number; // Zインデックス
  imageType?: string; // 画像タイプ
  animationId?: string; // アニメーションID
  id?: string; // ID
}

// テクスチャ情報の型定義
export interface TextureInfo {
  imageUrls: string[]; // 画像URLの配列
}

// スプライト設定の型定義
export interface SpriteConfig {
  frameIds: string[]; // フレームIDの配列
  fps: number; // フレームレート
  loop: number; // ループ回数
}

// JSONデータの型定義
export interface JsonData {
  baseCanvasWidth: number; // ベースキャンバスの幅
  baseCanvasHeight: number; // ベースキャンバスの高さ
  textures: TextureInfo[]; // テクスチャ情報の配列
  layers: Layer[]; // レイヤーの配列
  animations: Record<string, SpriteConfig[]>[]; // アニメーション設定の配列
}

// アニメーション状態の型定義
export interface AnimationState {
  [key: string]: boolean; // アニメーションがアクティブかどうか
}

// アニメーションフレームの型定義
export interface AnimationFrames {
  [key: string]: number; // アニメーションフレームのインデックス
}