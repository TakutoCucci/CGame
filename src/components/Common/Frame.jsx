import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Frame.css";

function Frame({ children }) {
	const [scale, setScale] = useState(1);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [isReady, setIsReady] = useState(false); // 初期状態を管理するためのフラグ

	useEffect(() => {
		const handleResize = () => {
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			const frameWidth = 1920;
			const frameHeight = 1080;

			const scaleWidth = windowWidth / frameWidth;
			const scaleHeight = windowHeight / frameHeight;
			const newScale = Math.min(scaleWidth, scaleHeight);

			const newOffsetX = (windowWidth - frameWidth * newScale) / 2;
			const newOffsetY = (windowHeight - frameHeight * newScale) / 2;

			setScale(newScale);
			setOffsetX(newOffsetX);
			setOffsetY(newOffsetY);
			setIsReady(true); // サイズ計算が完了した後に表示する
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!isReady) {
		return null; // 初期サイズ計算が完了するまでは描画しない
	}

	return (
		<motion.div
			className="game-frame-wrapper"
			initial={false} // 初期アニメーションを無効化
			animate={{ scale, x: offsetX, y: offsetY }}
			transition={{ type: "tween", ease: "linear", duration: 0.2 }}
			style={{
				width: "1920px",
				height: "1080px",
				position: "absolute",
				top: 0,
				left: 0,
				transformOrigin: "top left"
			}}>
			<div className="game-frame-content">{children}</div>
		</motion.div>
	);
}

export default Frame;
