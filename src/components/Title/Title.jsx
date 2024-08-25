import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

	return (
		<motion.div className={`start-screen-wrapper ${isFadingOut ? "fade-out" : ""}`} initial={{ opacity: 1 }} animate={{ opacity: isFadingOut ? 0 : 1 }} transition={{ duration: 1.5 }}>
			<motion.div className="start-screen-background-layer" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}></motion.div>
			<div className="title-layer">
				<h1>The Top Consultant</h1>
			</div>
			<div className="button-layer">
				<button onClick={handleStartClick} className="start-button">
					Start New
				</button>
				<button onClick={hasSavedGame ? onContinueGame : null} className="continue-button" disabled={!hasSavedGame}>
					Continue
				</button>
			</div>
		</motion.div>
	);
}

export default StartScreen;
