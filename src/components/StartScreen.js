import React, { useEffect, useRef } from "react";
import "./StartScreen.css";

function StartScreen({ onStartNewGame, onContinueGame, hasSavedGame }) {
	const backgroundRef = useRef(null);

	useEffect(() => {
		let animationFrameId;
		let start = null;
		const initialScale = 1.1; // 初期ズーム倍率（少しズームイン）
		let currentScale = initialScale;
		const targetScale = 1; // 最終的なズーム倍率（フレームに合わせる）
		const slowDownRate = 0.5; // ズームアウト速度

		const animateBackground = (timestamp) => {
			if (!start) start = timestamp;

			// ズームアウトの処理
			if (currentScale > targetScale) {
				currentScale -= slowDownRate;
				if (backgroundRef.current) {
					backgroundRef.current.style.transform = `scale(${currentScale})`;
				}
				animationFrameId = requestAnimationFrame(animateBackground);
			} else {
				if (backgroundRef.current) {
					backgroundRef.current.style.transform = `scale(1)`; // 静止時にscale(1)
				}
			}
		};

		// アニメーション開始
		animationFrameId = requestAnimationFrame(animateBackground);

		return () => {
			cancelAnimationFrame(animationFrameId); // クリーンアップ
		};
	}, []);

	return (
		<div className="start-screen-wrapper">
			<div ref={backgroundRef} className="background-layer"></div> {/* 背景レイヤー */}
			<div className="title-layer">
				{" "}
				{/* タイトルレイヤー */}
				<h1>The Top Consultant</h1>
			</div>
			<div className="button-layer">
				{" "}
				{/* ボタンレイヤー */}
				<button onClick={onStartNewGame} className="start-button">
					Start New
				</button>
				{hasSavedGame && (
					<button onClick={onContinueGame} className="continue-button">
						Continue
					</button>
				)}
			</div>
		</div>
	);
}

export default StartScreen;
