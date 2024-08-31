import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Title.css";

function Title({ onNewGameClick, hasSavedGame, onContinueGameClick }) {
	const [isFadingOut, setIsFadingOut] = useState(false);

	hasSavedGame = true; //デバッグ用

	useEffect(() => {
		let timer;
		if (isFadingOut) {
			timer = setTimeout(() => {
				onNewGameClick(); // シーンをプロローグに変更
			}, 1500);
		}
		return () => clearTimeout(timer);
	}, [isFadingOut, onNewGameClick]);

	const handleStartClick = () => {
		setIsFadingOut(true);
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
				<button onClick={hasSavedGame ? onContinueGameClick : null} className="continue-button" disabled={!hasSavedGame}>
					Continue
				</button>
			</div>
		</motion.div>
	);
}

export default Title;
