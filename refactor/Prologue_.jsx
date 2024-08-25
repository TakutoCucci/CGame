import React, { useReducer, useEffect, useContext, useCallback, useRef } from "react";
import { GameContext } from "../../context/GameContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dialogueTexts from "../../data/prologue_dialogue";
import "./Prologue.css";
import PrologueContractModal from "./PrologueContractModal";

// 初期状態を定義
const initialState = {
	currentPhase: "fadeIn",
	dialogueIndex: 0,
	displayedText: "",
	showDialogueArea: false,
	showText: false,
	waitingForClick: false,
	dialogueLoaded: false,
	isContractVisible: true
};

// reducer関数を定義
function prologueReducer(state, action) {
	switch (action.type) {
		case "SET_PHASE":
			return { ...state, currentPhase: action.payload };
		case "SET_DIALOGUE_INDEX":
			return { ...state, dialogueIndex: action.payload };
		case "SET_DISPLAYED_TEXT":
			return { ...state, displayedText: action.payload };
		case "TOGGLE_DIALOGUE_AREA":
			return { ...state, showDialogueArea: !state.showDialogueArea };
		case "TOGGLE_TEXT_VISIBILITY":
			return { ...state, showText: !state.showText };
		case "SET_WAITING_FOR_CLICK":
			return { ...state, waitingForClick: action.payload };
		case "SET_DIALOGUE_LOADED":
			return { ...state, dialogueLoaded: action.payload };
		case "TOGGLE_CONTRACT_VISIBILITY":
			return { ...state, isContractVisible: !state.isContractVisible };
		default:
			return state;
	}
}

function Prologue() {
	const { updateGameState } = useContext(GameContext); // グローバル状態の管理
	const navigate = useNavigate();
	const autoProgressTimeoutRef = useRef(null);

	// useReducerを使用して状態管理
	const [state, dispatch] = useReducer(prologueReducer, initialState);

	// ダイアログを次に進める処理
	const handleNextDialogue = useCallback(() => {
		if (autoProgressTimeoutRef.current) {
			clearTimeout(autoProgressTimeoutRef.current);
			autoProgressTimeoutRef.current = null;
		}

		if (state.currentPhase === "dialogue") {
			if (state.dialogueIndex < dialogueTexts.prologue.length - 1) {
				dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
				setTimeout(() => {
					dispatch({ type: "SET_DIALOGUE_INDEX", payload: state.dialogueIndex + 1 });
					dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
				}, 500);
			} else {
				dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
				setTimeout(() => {
					dispatch({ type: "TOGGLE_DIALOGUE_AREA" });
					dispatch({ type: "SET_PHASE", payload: "nameInput" });
				}, 500);
			}
		} else if (state.currentPhase === "afterNameDialogue") {
			if (state.dialogueIndex < dialogueTexts.afterNameInput.length - 1) {
				dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
				setTimeout(() => {
					dispatch({ type: "SET_DIALOGUE_INDEX", payload: state.dialogueIndex + 1 });
					dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
				}, 500);
			} else {
				dispatch({ type: "SET_WAITING_FOR_CLICK", payload: true });
			}
		}
	}, [state.currentPhase, state.dialogueIndex]);

	// 初期フェーズの設定
	useEffect(() => {
		setTimeout(() => {
			dispatch({ type: "SET_PHASE", payload: "dialogue" });
			dispatch({ type: "TOGGLE_DIALOGUE_AREA" });
			setTimeout(() => {
				dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
				dispatch({ type: "SET_DIALOGUE_LOADED", payload: true });
			}, 500);
		}, 1000);
	}, []);

	// ダイアログテキストのフェード表示・自動進行
	useEffect(() => {
		if ((state.currentPhase === "dialogue" || state.currentPhase === "afterNameDialogue") && state.dialogueLoaded) {
			const text = state.currentPhase === "dialogue" ? dialogueTexts.prologue[state.dialogueIndex].text : dialogueTexts.afterNameInput[state.dialogueIndex].text;

			const autoProgress = state.currentPhase === "dialogue" ? dialogueTexts.prologue[state.dialogueIndex].autoProgress : dialogueTexts.afterNameInput[state.dialogueIndex].autoProgress;

			const delay = state.currentPhase === "dialogue" ? dialogueTexts.prologue[state.dialogueIndex].delay : dialogueTexts.afterNameInput[state.dialogueIndex].delay;

			if (text) {
				dispatch({ type: "SET_DISPLAYED_TEXT", payload: text });
				if (autoProgress) {
					autoProgressTimeoutRef.current = setTimeout(handleNextDialogue, delay);
				}
			}
		}
	}, [state.dialogueIndex, state.currentPhase, state.dialogueLoaded, handleNextDialogue]);

	// クリーンアップ処理：コンポーネントのアンマウント時にタイマーをクリア
	useEffect(() => {
		return () => {
			if (autoProgressTimeoutRef.current) {
				clearTimeout(autoProgressTimeoutRef.current);
			}
		};
	}, []);

	// 名前入力の処理
	const handleSubmitName = (e) => {
		e.preventDefault();
		if (state.username.trim()) {
			updateGameState({ playerName: state.username });
			dispatch({ type: "TOGGLE_CONTRACT_VISIBILITY" });
			setTimeout(() => {
				dispatch({ type: "TOGGLE_DIALOGUE_AREA" });
				setTimeout(() => {
					dispatch({ type: "SET_DIALOGUE_INDEX", payload: 0 });
					dispatch({ type: "SET_DISPLAYED_TEXT", payload: "" });
					dispatch({ type: "TOGGLE_DIALOGUE_AREA" });
					setTimeout(() => {
						dispatch({ type: "TOGGLE_TEXT_VISIBILITY" });
						dispatch({ type: "SET_PHASE", payload: "afterNameDialogue" });
					}, 500);
				}, 500);
			}, 500);
		}
	};

	const handleFinalClick = () => {
		if (state.waitingForClick) {
			navigate("/nextPage");
		} else {
			handleNextDialogue();
		}
	};

	return (
		<motion.div className="prologue-screen-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={handleFinalClick}>
			<div className="prologue-background-layer"></div>

			{state.showDialogueArea && (
				<motion.div className="dialogue-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
					{state.showText && (
						<motion.div className="dialogue-text" key={state.dialogueIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
							<p>{state.displayedText}</p>
						</motion.div>
					)}
				</motion.div>
			)}

			{state.currentPhase === "nameInput" && (
				<PrologueContractModal
					isVisible={state.isContractVisible}
					onSubmit={handleSubmitName}
					username={state.username}
					setUsername={(name) => dispatch({ type: "SET_USERNAME", payload: name })}
				/>
			)}
		</motion.div>
	);
}

export default Prologue;
