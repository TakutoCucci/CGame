import React, { useReducer, useEffect } from "react";
import { motion } from "framer-motion";
import "./Frame.css";

// フレームのスケール、オフセット、準備完了状態を管理するための初期値を設定
const initialState = {
	scale: 1, // フレームのスケール倍率
	offsetX: 0, // X軸のオフセット
	offsetY: 0, // Y軸のオフセット
	isReady: false // フレームの初期化が完了したかどうかを示すフラグ
};

function frameReducer(state, action) {
	switch (action.type) {
		case "SET_SCALE":
			return {
				...state,
				scale: action.payload.scale,
				offsetX: action.payload.offsetX,
				offsetY: action.payload.offsetY
			};
		case "SET_READY":
			return { ...state, isReady: action.payload };
		default:
			return state;
	}
}

function Frame({ children }) {
	const [state, dispatch] = useReducer(frameReducer, initialState);

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

			dispatch({
				type: "SET_SCALE",
				payload: { scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY }
			});
			dispatch({ type: "SET_READY", payload: true });
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!state.isReady) {
		return null;
	}

	return (
		<motion.div
			className="game-frame-wrapper"
			initial={false}
			animate={{ scale: state.scale, x: state.offsetX, y: state.offsetY }}
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
