import React, { useState, useEffect } from "react";
import StaminaGauge from "./StaminaGauge";
import backgroundImage from "../assets/background/background_office.webp";
import "./GameScreen.css";

function GameScreen({ username, onSaveAndExit, savedGame }) {
	const initialPlayerState = savedGame
		? savedGame.playerState
		: {
				rank: "アナリスト",
				stamina: 100,
				motivation: 3,
				stress: 0,
				workLifeBalance: 0,
				exp: {
					intellect: 0,
					mentalStrength: 0,
					communication: 0,
					focus: 0,
					creativity: 0,
					businessKnowledge: 0,
					itFundamentals: 0
				}
		  };

	const initialGameTime = savedGame
		? savedGame.gameTime
		: {
				year: 1,
				month: 4,
				week: 1
		  };

	const [player, setPlayer] = useState(initialPlayerState);
	const [year, setYear] = useState(initialGameTime.year);
	const [month, setMonth] = useState(initialGameTime.month);
	const [week, setWeek] = useState(initialGameTime.week);

	const handleAction = (action) => {
		if (action === "work") {
			updatePlayerState({
				stamina: Math.max(0, player.stamina - 20),
				stress: Math.min(50, player.stress + 10),
				exp: {
					intellect: (player.exp?.intellect ?? 0) + 5
				}
			});
		} else if (action === "rest") {
			updatePlayerState({
				stamina: Math.min(100, player.stamina + 30),
				stress: Math.max(0, player.stress - 10)
			});
		}
		advanceWeek(); // 1週間進める
	};

	const updatePlayerState = (newState) => {
		setPlayer((prevPlayer) => ({
			...prevPlayer,
			exp: {
				...prevPlayer.exp,
				...newState.exp
			},
			...newState
		}));
	};

	const advanceWeek = () => {
		setWeek((prevWeek) => {
			if (prevWeek === 4) {
				setMonth((prevMonth) => {
					if (prevMonth === 12) {
						setYear((prevYear) => prevYear + 1);
						return 1;
					} else {
						return prevMonth + 1;
					}
				});
				return 1;
			} else {
				return prevWeek + 1;
			}
		});
	};

	return (
		<div className="game-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
			<header className="header"></header>
			<div className="main-content">
				<h1>{username}のステータス</h1>
				<div className="status-panel">
					<h2>プレイヤーステータス</h2>
					<StaminaGauge value={player.stamina} max={100} />
					<div className="status-gauges">
						<p>やる気: {player.motivation}/5</p>
						<p>ストレス: {player.stress}/50</p>
						<p>ワークライフバランス: {player.workLifeBalance}</p>
					</div>
				</div>
				<div className="actions">
					<button onClick={() => handleAction("work")}>業務</button>
					<button onClick={() => handleAction("rest")}>休暇</button>
				</div>
			</div>
			<footer className="footer"></footer>
		</div>
	);
}

export default GameScreen;
