import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Title.css";

function StartScreen({ onStartNewGame, onContinueGame, hasSavedGame }) {
	const navigate = useNavigate();
	const [isFadingOut, setIsFadingOut] = useState(false);

	const handleStartClick = () => {
		setIsFadingOut(true); // フェードアウトを開始
		setTimeout(() => {
			navigate("/prologue"); // 0.5秒後にページ遷移
		}, 1500); // アニメーションの時間と合わせる
	};

	const backgroundRef = useRef(null);
	hasSavedGame = false; //セーブデータ作成までのデバッグ用の値の変更フラグ

	useEffect(() => {
		let animationFrameId;
		let start = null;
		const initialScale = 1.1; // 初期ズーム倍率（少しズームイン）
		let currentScale = initialScale;
		const targetScale = 1; // 最終的なズーム倍率（フレームに合わせる）
		const slowDownRate = 0.01; // ズームアウト速度

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
		<div className={`start-screen-wrapper ${isFadingOut ? "fade-out" : ""}`}>
			<div ref={backgroundRef} className="start-screen-background-layer"></div>
			<div className="title-layer">
				<h1>The Top Consultant</h1>
			</div>
			<div className="button-layer">
				<button onClick={handleStartClick} className="start-button">
					Start New
				</button>
				<button
					onClick={hasSavedGame ? onContinueGame : null}
					className="continue-button"
					disabled={!hasSavedGame} // hasSavedGame が false の場合、無効化
				>
					Continue
				</button>
			</div>
		</div>
	);
}

export default StartScreen;
