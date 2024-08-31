import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Frame from "./components/Common/Frame";
import Title from "./components/Title/Title";
import Prologue from "./components/Prologue/Prologue";
import Game from "./components/Game/Game";

function App() {
	const [currentScene, setCurrentScene] = useState("title");
	return (
		// Frame：ブラウザの画面サイズに合わせてゲーム画面を拡大縮小させるフレーム。
		// GameProvider：ゲームのグローバルな状態を管理し、全ての子コンポーネントで共有するためのコンテキストプロバイダー。
		// Router：URLを"/CGame"で固定し、ルーティングを管理する。
		<Frame>
			<GameProvider>
				<Router basename="/CGame">
					<Routes>
						<Route path="/" element={<SceneManager currentScene={currentScene} setCurrentScene={setCurrentScene} />} />
					</Routes>
				</Router>
			</GameProvider>
		</Frame>
	);
}

/**
 * SceneManagerは、currentScene の状態に基づいて異なるシーンをレンダリングする。
 * 各シーンには、適切なプロパティが渡され、シーン間の遷移が管理されます。
 *
 * @param {string} currentScene - 現在のシーン名。
 * @param {function} setCurrentScene - シーンの状態を更新する関数。
 * @returns {JSX.Element} - 現在のシーンに対応するコンポーネント。
 */
function SceneManager({ currentScene, setCurrentScene }) {
	const navigate = useNavigate();

	/**
	 * シーンを変更し、現在のURLを固定したまま新しいシーンを表示します。
	 *
	 * @param {string} scene - 遷移先のシーン名。
	 */
	const changeScene = (scene) => {
		setCurrentScene(scene);
		navigate("/", { replace: true });
	};

	return (
		// DevNote：この部分はシーンルートマッピングデータとして管理できるようにしたい
		<>
			{/* Title シーン: ゲームのタイトル画面 */}
			{currentScene === "title" && <Title onNewGameClick={() => changeScene("prologue")} onContinueGameClick={() => changeScene("game")} />}
			{/* Prologue シーン: プロローグ画面 */}
			{currentScene === "prologue" && <Prologue onPrologueFinish={() => changeScene("game")} />}
			{/* Game シーン: メインのゲーム画面 */}
			{currentScene === "game" && <Game />}
		</>
	);
}

export default App;
