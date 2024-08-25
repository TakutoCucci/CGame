import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { GameContext } from "../../context/GameContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dialogueTexts from "../../data/prologue_dialogue";
import "./Prologue.css";
import PrologueContractModal from "./PrologueContractModal";

function Prologue() {
	const [currentPhase, setCurrentPhase] = useState("fadeIn");
	const [dialogueIndex, setDialogueIndex] = useState(0);
	const [displayedText, setDisplayedText] = useState("");
	const [showDialogueArea, setShowDialogueArea] = useState(false);
	const [showText, setShowText] = useState(false);
	const [waitingForClick, setWaitingForClick] = useState(false);
	const [username, setUsername] = useState("");
	const [dialogueLoaded, setDialogueLoaded] = useState(false);
	const [isContractVisible, setIsContractVisible] = useState(true);

	const { updateGameState } = useContext(GameContext);
	const navigate = useNavigate();
	const autoProgressTimeoutRef = useRef(null);

	// ダイアログを次に進める処理
	const handleNextDialogue = useCallback(() => {
		if (autoProgressTimeoutRef.current) {
			clearTimeout(autoProgressTimeoutRef.current);
			autoProgressTimeoutRef.current = null;
		}

		if (currentPhase === "dialogue") {
			if (dialogueIndex < dialogueTexts.prologue.length - 1) {
				setShowText(false);
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setShowText(true);
				}, 500);
			} else {
				setShowText(false);
				setTimeout(() => {
					setShowDialogueArea(false);
					setCurrentPhase("nameInput");
				}, 500);
			}
		} else if (currentPhase === "afterNameDialogue") {
			if (dialogueIndex < dialogueTexts.afterNameInput.length - 1) {
				setShowText(false);
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setShowText(true);
				}, 500);
			} else {
				setWaitingForClick(true);
			}
		}
	}, [currentPhase, dialogueIndex]);

	// 初期フェーズの設定
	useEffect(() => {
		setTimeout(() => {
			setCurrentPhase("dialogue");
			setShowDialogueArea(true);
			setTimeout(() => {
				setShowText(true);
				setDialogueLoaded(true);
			}, 500);
		}, 1000);
	}, []);

	// ダイアログテキストのフェード表示・自動進行
	useEffect(() => {
		if ((currentPhase === "dialogue" || currentPhase === "afterNameDialogue") && dialogueLoaded) {
			const text = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].text : dialogueTexts.afterNameInput[dialogueIndex].text;

			const autoProgress = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].autoProgress : dialogueTexts.afterNameInput[dialogueIndex].autoProgress;

			const delay = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].delay : dialogueTexts.afterNameInput[dialogueIndex].delay;

			if (text) {
				setDisplayedText(text);
				if (autoProgress) {
					autoProgressTimeoutRef.current = setTimeout(handleNextDialogue, delay);
				}
			}
		}
	}, [dialogueIndex, currentPhase, dialogueLoaded, handleNextDialogue]);

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
		if (username.trim()) {
			updateGameState({ playerName: username });
			setIsContractVisible(false); // モーダルをフェードアウト
			setTimeout(() => {
				setShowDialogueArea(false);
				setTimeout(() => {
					setDialogueIndex(0);
					setDisplayedText("");
					setShowDialogueArea(true);
					setTimeout(() => {
						setShowText(true);
						setCurrentPhase("afterNameDialogue");
					}, 500);
				}, 500);
			}, 500); // モーダルが完全にフェードアウトした後にダイアログを表示
		}
	};

	const handleFinalClick = () => {
		if (waitingForClick) {
			navigate("/nextPage");
		} else {
			handleNextDialogue();
		}
	};

	return (
		<motion.div className="prologue-screen-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={handleFinalClick}>
			<div className="prologue-background-layer"></div>

			{showDialogueArea && (
				<motion.div className="dialogue-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
					{showText && (
						<motion.div className="dialogue-text" key={dialogueIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
							<p>{displayedText}</p>
						</motion.div>
					)}
				</motion.div>
			)}

			{currentPhase === "nameInput" && <PrologueContractModal isVisible={isContractVisible} onSubmit={handleSubmitName} username={username} setUsername={setUsername} />}
		</motion.div>
	);
}

export default Prologue;
