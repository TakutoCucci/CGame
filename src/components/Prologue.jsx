import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dialogueTexts from "../data/prologue_dialogue";
import "./Prologue.css";

function Prologue() {
	const [currentPhase, setCurrentPhase] = useState("fadeIn");
	const [dialogueIndex, setDialogueIndex] = useState(0);
	const [displayedText, setDisplayedText] = useState("");
	const [showDialogueArea, setShowDialogueArea] = useState(false);
	const [showText, setShowText] = useState(false);
	const [waitingForClick, setWaitingForClick] = useState(false);
	const [username, setUsername] = useState("");
	const [dialogueLoaded, setDialogueLoaded] = useState(false);
	const [isContractVisible, setIsContractVisible] = useState(true); // モーダルの表示管理

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
				setShowText(false); // テキストを一旦非表示にする
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setShowText(true); // 新しいテキストを表示
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

	// 誓約書表示コンポーネント
	const renderContract = () => (
		<motion.div
			className="contract-wrapper"
			initial={{ opacity: 0 }}
			animate={{ opacity: isContractVisible ? 1 : 0 }} // OKを押されたらフェードアウト
			transition={{ duration: 0.5 }}>
			<h2>入社誓約書</h2>
			<p>〇〇コンサルティングへ仲間入りするにあたり、下記に同意し署名してください。</p>
			<p>1. クライアントの成功を第一に考え、常に努力し、最善の提案とサポートを提供します。どんな困難なミッションでも諦めることなく、挑み続けます。</p>
			<p>2. 本ゲームは開発中でありバグが頻繁に出ることを理解しています。ゲームの改善のために積極的にフィードバックを行います。</p>
			<p>3. 制作チームは必要に応じ自由にプレイデータを収集、活用することができます。</p>
			<p>これらを踏まえ、私は誇りを持ってコンサルタントとしての道を進むことを誓います。</p>
			<div className="signature-line">
				<label htmlFor="signature">署名：</label>
				<input type="text" id="signature" value={username} onChange={(e) => setUsername(e.target.value)} />
			</div>
			<button type="submit" onClick={handleSubmitName}>
				OK
			</button>
		</motion.div>
	);

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

			{currentPhase === "nameInput" && renderContract()}
		</motion.div>
	);
}

export default Prologue;
