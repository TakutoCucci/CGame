import React, { createContext, useState } from "react";

// 初期ゲームパラメータ
const initialGameState = {
	playerName: "",
	rank: "アナリスト",
	gauges: {
		stamina: 100,
		motivation: 3,
		stress: 0,
		workLifeBalance: 0
	},
	experiencePoints: {
		intellect: 0,
		mentalStrength: 0,
		communication: 0,
		focus: 0,
		creativity: 0,
		businessKnowledge: 0,
		itFundamentals: 0
	},
	skills: {
		coreSkills: {
			problemSolving: 0,
			facilitation: 0,
			presentation: 0,
			documentation: 0,
			research: 0
		},
		projectPromotion: {
			leadership: 0,
			projectPlanning: 0,
			projectManagement: 0,
			riskManagement: 0
		},
		knowledge: {
			industryKnowledge: 0,
			businessKnowledge: 0,
			itKnowledge: 0
		}
	}
};

// コンテキストの作成
export const GameContext = createContext();

// プロバイダーコンポーネント
export const GameProvider = ({ children }) => {
	const [gameState, setGameState] = useState(initialGameState);

	// ゲーム状態の更新関数
	const updateGameState = (updates) => {
		setGameState((prevState) => ({
			...prevState,
			...updates
		}));
	};

	return <GameContext.Provider value={{ gameState, updateGameState }}>{children}</GameContext.Provider>;
};
