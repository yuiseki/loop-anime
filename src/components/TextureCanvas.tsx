import React, { useRef, useState, useEffect } from "react";
// 型定義をインポート
import {
  JsonData, // JSONデータ型
  AnimationState, // アニメーション状態型
  AnimationFrames, // アニメーションフレーム型
  Layer, // レイヤー型
  SpriteConfig, // スプライト設定型
} from "../types";

// TextureCanvasコンポーネントのPropsの型定義
interface TextureCanvasProps {
  jsonDataList: JsonData[]; // JSONデータのリスト
}

const TextureCanvas: React.FC<TextureCanvasProps> = ({ jsonDataList }) => {
  // キャンバス要素への参照
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // アニメーションのフレーム状態を管理
  const [animationFrames, setAnimationFrames] = useState<AnimationFrames>({});
  // 現在アクティブなアニメーションを管理
  const [activeAnimations, setActiveAnimations] = useState<AnimationState>({});
  // レンダリングが要求されたかどうかを管理
  const [renderRequested, setRenderRequested] = useState(false);

  // スプライトアニメーションを開始する関数
  const startSpriteAnimation = (
    ctx: CanvasRenderingContext2D, // キャンバスの2Dレンダリングコンテキスト
    jsonData: JsonData, // JSONデータ
    layer: Layer, // レイヤーデータ
    textureImage: HTMLImageElement // テクスチャ画像
  ) => {
    // アニメーションIDがない場合は早期リターン
    if (!layer.animationId) return;

    // アニメーション設定を取得
    const spriteConfigArray = jsonData.animations[0]?.[layer.animationId];
    // アニメーション設定がない場合は早期リターン
    if (!spriteConfigArray?.[0]) return;

    // スプライト設定を取得
    const spriteConfig: SpriteConfig = spriteConfigArray[0];
    // レイヤーIDがない場合は早期リターン
    if (!layer.id) return;

    // アニメーションフレームを初期化
    setAnimationFrames((prev) => ({ ...prev, [layer.id!]: 0 }));
    // アニメーションをアクティブにする
    setActiveAnimations((prev) => ({ ...prev, [layer.id!]: true }));

    // アニメーションフレームIDを初期化
    let animationFrameId: number | null = null;
    // 前回のフレーム時間を初期化
    let lastFrameTime: number | null = null;
    // アニメーションのメインループ
    const animate = () => {
      // レイヤーIDがない、またはアニメーションがアクティブでない場合は早期リターン
      if (!layer.id || !activeAnimations[layer.id]) {
        // アニメーションフレームIDがある場合はキャンセル
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }
      // 現在時間を取得
      const currentTime = performance.now();
      // 前回のフレーム時間がない場合は現在時間を設定
      if (!lastFrameTime) {
        lastFrameTime = currentTime;
      }
      // 経過時間を計算
      const deltaTime = currentTime - lastFrameTime;
      // フレームの表示間隔を計算
      const frameDuration = 1000 / spriteConfig.fps;
      
      // 経過時間がフレーム間隔以上の場合、前回のフレーム時間を更新
      if (deltaTime >= frameDuration) {
        lastFrameTime = currentTime;
      }

      // 現在のフレームを取得
      const currentFrame = animationFrames[layer.id];
      // フレームインデックスを計算
      const frameIndex = currentFrame % spriteConfig.frameIds.length;
      // フレームに割り当てるレイヤーIDを取得
      const frameAssignID = spriteConfig.frameIds[frameIndex];
      // フレームに割り当てるレイヤーを取得
      const frameLayer = jsonData.layers.find((l) => l.id === frameAssignID);

      // フレームレイヤーが存在する場合、描画
      if (frameLayer) {
        ctx.drawImage(
          textureImage, // テクスチャ画像
          frameLayer.x, // フレームレイヤーのX座標
          frameLayer.y, // フレームレイヤーのY座標
          frameLayer.width, // フレームレイヤーの幅
          frameLayer.height, // フレームレイヤーの高さ
          frameLayer.basePositionX, // フレームレイヤーのベースX座標
          frameLayer.basePositionY, // フレームレイヤーのベースY座標
          frameLayer.width, // フレームレイヤーの幅
          frameLayer.height // フレームレイヤーの高さ
        );
      }

      // アニメーションフレームを更新
      setAnimationFrames((prev) => ({
        ...prev,
        [layer.id!]: prev[layer.id!] + 1,
      }));

      // アニメーションをループするか、フレームが残っている場合はアニメーションを継続
      if (
        spriteConfig.loop === 1 ||
        currentFrame < spriteConfig.frameIds.length
      ) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // アニメーションを非アクティブにする
        setActiveAnimations((prev) => ({ ...prev, [layer.id!]: false }));
        // アニメーションフレームIDがある場合はキャンセル
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };

    animate();
  };

  // キャンバスにテクスチャを描画する関数
  const renderCanvas = () => {
    // キャンバス要素を取得
    const canvas = canvasRef.current;
    // 2Dレンダリングコンテキストを取得
    const ctx = canvas?.getContext("2d");
    // コンテキストまたはキャンバスがない場合は早期リターン
    if (!ctx || !canvas) return;

    // JSONデータリストをループ処理
    jsonDataList.forEach((jsonData, index) => {
      // テクスチャ情報を取得
      const textureInfo = jsonData.textures[0];
      // テクスチャ画像を生成
      const textureImage = new Image();
      // テクスチャ画像のURLを設定
      textureImage.src = textureInfo.imageUrls[0];

      // テクスチャ画像のロードが完了した場合の処理
      textureImage.onload = () => {
        // レイヤーをZインデックスでソート
        const sortedLayers = [...jsonData.layers].sort(
          (a, b) => a.zIndex - b.zIndex
        );

        // ソートされたレイヤーをループ処理
        sortedLayers.forEach((layer) => {
          // 最初のJSONデータの場合のみ描画
          if (index === 0) {
            ctx.drawImage(
              textureImage, // テクスチャ画像
              layer.x, // レイヤーのX座標
              layer.y, // レイヤーのY座標
              layer.width, // レイヤーの幅
              layer.height, // レイヤーの高さ
              layer.basePositionX, // レイヤーのベースX座標
              layer.basePositionY, // レイヤーのベースY座標
              layer.width, // レイヤーの幅
              layer.height // レイヤーの高さ
            );
          }
        });

        // レイヤーをループ処理
        jsonData.layers.forEach((layer) => {
          // レイヤーがスプライトの場合、アニメーションを開始
          if (layer.imageType === "Sprite") {
            startSpriteAnimation(ctx, jsonData, layer, textureImage);
          }
        });
      };

      // テクスチャ画像のロードに失敗した場合の処理
      textureImage.onerror = () => {
        console.error("Failed to load texture image:", textureImage.src);
      };
    });
  };

  // レンダリングを制御するuseEffectフック
  useEffect(() => {
    // レンダリングが要求された場合
    if (renderRequested) {
      // 50ms後にrenderCanvasを実行
      const timeoutId = setTimeout(() => {
        renderCanvas();
        setRenderRequested(false);
      }, 50);
      // クリーンアップ関数でタイムアウトをクリア
      return () => clearTimeout(timeoutId);
    } else if (jsonDataList.length > 0) {
      // JSONデータリストがある場合はレンダリングを要求
      setRenderRequested(true);
    }
  }, [renderRequested, jsonDataList]);

  // キャンバスのサイズを設定するuseEffectフック
  useEffect(() => {
    // キャンバス要素を取得
    const canvas = canvasRef.current;
    // キャンバス要素がない場合は早期リターン
    if (!canvas) return;
    // JSONデータリストがない場合は早期リターン
    if (jsonDataList.length === 0) return;
    // 最初のJSONデータを取得
    const jsonData = jsonDataList[0];
    // キャンバスの幅を設定
    canvas.width = jsonData.baseCanvasWidth;
    // キャンバスの高さを設定
    canvas.height = jsonData.baseCanvasHeight;
  }, [jsonDataList]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default TextureCanvas;
