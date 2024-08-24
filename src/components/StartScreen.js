import React from "react";
import "./StartScreen.css";

function StartScreen({ onStartNewGame, onContinueGame, hasSavedGame }) {
	return (
		<div className="start-screen">
			<h1>売れるコンサルを目指せ！</h1>
			<button onClick={onStartNewGame}>新しいゲームを始める</button>
			{hasSavedGame && <button onClick={onContinueGame}>前回の続きから</button>}
		</div>
	);
}

export default StartScreen;
