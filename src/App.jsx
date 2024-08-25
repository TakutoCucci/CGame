import React from "react";
import { GameProvider } from "./context/GameContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Frame from "./components/Common/Frame";
import Title from "./components/Title/Title";
import Prologue from "./components//Prologue/Prologue";

function App() {
	return (
		<GameProvider>
			<Router basename="/CGame">
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
