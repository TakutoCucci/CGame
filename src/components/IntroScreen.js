import React from "react";
import "./IntroScreen.css";

function IntroScreen({ onProceed }) {
	return (
		<div className="intro-screen" onClick={onProceed}>
			<h1>コンサルタントとしての旅が始まる...</h1>
			<p>あなたは新人コンサルタントとして、さまざまな業務に取り組み、スキルを磨いていきます。</p>
			<p>準備は整いましたか？クリックしてゲームを始めましょう。</p>
		</div>
	);
}

export default IntroScreen;
