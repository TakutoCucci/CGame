import React from "react";
import { GameProvider } from "./context/GameContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Frame from "./components/Common/Frame";
import Title from "./components/Title/Title";
import Prologue from "./components/Prologue/Prologue";
import Game from "./components/Game/Game";

// function App() {
// 	return (
// 		<GameProvider>
// 			<Router basename="/CGame">
// 				<Frame>
// 					<Routes>
// 						<Route path="/" element={<Game />} />
// 						<Route path="/prologue" element={<Prologue />} />
// 						<Route path="/game" element={<Game />} />
// 						<Route path="/title" element={<Title />} />
// 					</Routes>
// 				</Frame>
// 			</Router>
// 		</GameProvider>
// 	);
// }

function App() {
	return (
		<GameProvider>
			<Router basename="/CGame">
				<Frame>
					<Routes>
						<Route path="/" element={<Title />} />
						<Route path="/prologue" element={<Prologue />} />
						<Route path="/game" element={<Game />} />
					</Routes>
				</Frame>
			</Router>
		</GameProvider>
	);
}

export default App;
