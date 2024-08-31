import React, { useReducer, useEffect } from "react";
import { motion } from "framer-motion";
import "./Frame.css";

// 初期状態の定義
const initialState = {
	scale: 1,
	offsetX: 0,
	offsetY: 0,
	isReady: false
};

// reducer関数の定義
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
				// backgroundColor: "lightgray", // デバッグ用の背景色
				// overflow: "visible", // コンテンツが切り取られないようにする
				// border: "2px solid red" // デバッグ用の境界線
			}}>
			<div
				className="game-frame-content"
				// style={
				// 	{
				// 		// border: "2px solid blue", // デバッグ用の境界線
				// 		// height: "100%", // コンテンツが親要素にフィットするように
				// 		// overflow: "visible" // 必要に応じて、コンテンツが隠れないようにする
				// 	}
				// }
			>
				{children}
			</div>
		</motion.div>
	);
}

export default Frame;
