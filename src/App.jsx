import React from "react";
import { GameProvider } from "./context/GameContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Frame from "./components/Frame";
import Title from "./components/Title";
import Prologue from "./components/Prologue";

function App() {
	return (
		<GameProvider>
			{" "}
			{/* GameProvider で全体をラップ */}
			<Router>
				<Frame>
					<Routes>
						<Route path="/" element={<Title />} />
						<Route path="/prologue" element={<Prologue />} />
					</Routes>
				</Frame>
			</Router>
		</GameProvider>
	);
}

export default App;
