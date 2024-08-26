import React, { useState } from "react";
//import { GameContext } from "../../context/GameContext";
//import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StaminaGauge from "./game_components/StaminaGauge";
import WorkLifeBalanceGauge from "./game_components/WorkLifeBalanceGauge";
import MotivationIcon from "./game_components/MotivationIcon";
import "./Game.css";

function Game() {
	const [stamina, setStamina] = useState(100);
	const [workLifeBalance, setWorkLifeBalance] = useState(0);
	const [motivation, setMotivation] = useState(3);
	console.log(stamina);
	console.log(workLifeBalance);
	return (
		<motion.div className="game-screen-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<div className="game-background-layer">
				<div className="devControl">
					<button onClick={() => setStamina(Math.max(stamina - 10, 0))}>Reduce Stamina</button>
					<button onClick={() => setStamina(Math.min(stamina + 10, 100))}>Increase Stamina</button>
					<button onClick={() => setWorkLifeBalance(Math.max(workLifeBalance - 5, -50))}>work</button>
					<button onClick={() => setWorkLifeBalance(Math.min(workLifeBalance + 5, 50))}>life</button>
					<button onClick={() => setMotivation(Math.max(motivation - 1, 1))}>demotivate</button>
					<button onClick={() => setMotivation(Math.min(motivation + 1, 5))}>motivate</button>
				</div>
				<div className="status-container">
					<div className="motivation-icon-container">
						<MotivationIcon motivation={motivation} />
					</div>
					<div className="gauge-wrapper">
						<div className="stamina-gauge-container">
							<StaminaGauge stamina={stamina} />
						</div>
						<div className="worklifebalance-gauge-container">
							<WorkLifeBalanceGauge workLifeBalance={workLifeBalance} />
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default Game;
