import React from "react";
import "./StartScreen.css";

function StartScreen({ onStartNewGame }) {
	return (
		<div className="start-screen">
			<div className="content">
				<h1>売れるコンサルを目指せ！</h1>
				<button onClick={onStartNewGame} className="start-button">
					新しいゲームを始める
				</button>
			</div>
		</div>
	);
}

export default StartScreen;
