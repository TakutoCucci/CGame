import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { GameContext } from "../../context/GameContext";
import { motion } from "framer-motion";
import dialogueTexts from "../../data/prologue_dialogue";
import "./Prologue.css";
import PrologueContractModal from "./PrologueContractModal";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Prologue({ onPrologueFinish }) {
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
	const autoProgressTimeoutRef = useRef(null);

	const handleNextDialogue = useCallback(async () => {
		if (autoProgressTimeoutRef.current) {
			clearTimeout(autoProgressTimeoutRef.current);
			autoProgressTimeoutRef.current = null;
		}

		if (currentPhase === "dialogue") {
			if (dialogueIndex < dialogueTexts.prologue.length - 1) {
				setShowText(false);
				await delay(500);
				setDialogueIndex(dialogueIndex + 1);
				setShowText(true);
			} else {
				setShowText(false);
				await delay(500);
				setShowDialogueArea(false);
				setCurrentPhase("nameInput");
			}
		} else if (currentPhase === "afterNameDialogue") {
			if (dialogueIndex < dialogueTexts.afterNameInput.length - 1) {
				setShowText(false);
				await delay(500);
				setDialogueIndex(dialogueIndex + 1);
				setShowText(true);
			} else {
				setWaitingForClick(true);
			}
		}
	}, [currentPhase, dialogueIndex]);

	useEffect(() => {
		(async () => {
			await delay(1000);
			setCurrentPhase("dialogue");
			setShowDialogueArea(true);
			await delay(500);
			setShowText(true);
			setDialogueLoaded(true);
		})();
	}, []);

	useEffect(() => {
		if ((currentPhase === "dialogue" || currentPhase === "afterNameDialogue") && dialogueLoaded) {
			const text = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].text : dialogueTexts.afterNameInput[dialogueIndex].text;
			const autoProgress = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].autoProgress : dialogueTexts.afterNameInput[dialogueIndex].autoProgress;
			const delayTime = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].delay : dialogueTexts.afterNameInput[dialogueIndex].delay;

			if (text) {
				setDisplayedText(text);
				if (autoProgress) {
					autoProgressTimeoutRef.current = setTimeout(handleNextDialogue, delayTime);
				}
			}
		}
	}, [dialogueIndex, currentPhase, dialogueLoaded, handleNextDialogue]);

	useEffect(() => {
		return () => {
			if (autoProgressTimeoutRef.current) {
				clearTimeout(autoProgressTimeoutRef.current);
			}
		};
	}, []);

	const handleSubmitName = async (e) => {
		e.preventDefault();
		if (username.trim()) {
			updateGameState({ playerName: username });
			setIsContractVisible(false);
			await delay(500);
			setShowDialogueArea(false);
			await delay(500);
			setDialogueIndex(0);
			setDisplayedText("");
			setShowDialogueArea(true);
			await delay(500);
			setShowText(true);
			setCurrentPhase("afterNameDialogue");
		}
	};

	const handleClick = () => {
		console.log("clicked");
		if (waitingForClick) {
			onPrologueFinish();
		} else {
			handleNextDialogue();
		}
	};

	return (
		<motion.div className="prologue-screen-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={handleClick}>
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
