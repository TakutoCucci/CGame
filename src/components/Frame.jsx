import React, { useState, useEffect } from "react";
import "./Frame.css";

function Frame({ children }) {
	const [scale, setScale] = useState(1);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			const frameWidth = 1920;
			const frameHeight = 1080;

			// スケールの計算
			const scaleWidth = windowWidth / frameWidth;
			const scaleHeight = windowHeight / frameHeight;
			const newScale = Math.min(scaleWidth, scaleHeight);

			// フレームを中央に配置
			const newOffsetX = (windowWidth - frameWidth * newScale) / 2;
			const newOffsetY = (windowHeight - frameHeight * newScale) / 2;

			setScale(newScale);
			setOffsetX(newOffsetX);
			setOffsetY(newOffsetY);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div
			className="game-frame-wrapper"
			style={{
				transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
				width: "1920px",
				height: "1080px",
				position: "absolute",
				top: 0,
				left: 0,
				transformOrigin: "top left"
			}}>
			<div className="game-frame-content">{children}</div>
		</div>
	);
}

export default Frame;
