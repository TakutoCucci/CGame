import React, { useState, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import IntroScreen from "./components/IntroScreen";
import UsernameInputScreen from "./components/UsernameInputScreen";
import "./App.css";

function App() {
	const [gameState, setGameState] = useState("start"); // 'start', 'inputUsername', 'intro', 'playing'
	const [savedGame, setSavedGame] = useState(null);
	const [username, setUsername] = useState("");

	useEffect(() => {
		const savedData = localStorage.getItem("savedGameData");
		if (savedData) {
			setSavedGame(JSON.parse(savedData));
		} else {
			setSavedGame(null);
		}
	}, [gameState]);

	const handleStartNewGame = () => {
		setUsername("");
		setGameState("inputUsername");
	};

	const handleUsernameSubmit = (name) => {
		setUsername(name);
		setGameState("intro"); // ユーザー名入力後にイントロ画面へ
	};

	const handleProceedFromIntro = () => {
		setGameState("playing"); // イントロ終了後にゲーム画面へ
	};

	const handleSaveAndExit = (playerState, gameTime) => {
		const gameData = {
			playerState,
			gameTime,
			username
		};
		localStorage.setItem("savedGameData", JSON.stringify(gameData));
		setGameState("start");
	};

	const handleContinueGame = () => {
		if (savedGame) {
			setUsername(savedGame.username);
			setGameState("playing");
		}
	};

	return (
		<div className="App">
			{gameState === "start" && <StartScreen onStartNewGame={handleStartNewGame} onContinueGame={handleContinueGame} hasSavedGame={savedGame !== null} />}
			{gameState === "inputUsername" && <UsernameInputScreen onSubmit={handleUsernameSubmit} />}
			{gameState === "intro" && <IntroScreen onProceed={handleProceedFromIntro} />}
			{gameState === "playing" && <GameScreen username={username} onSaveAndExit={handleSaveAndExit} savedGame={savedGame} />}
		</div>
	);
}

export default App;
