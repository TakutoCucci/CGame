import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import dialogueTexts from "../data/prologue_dialogue";
import "./Prologue.css";

function Prologue() {
	const [fadeIn, setFadeIn] = useState(false);
	const [currentPhase, setCurrentPhase] = useState("fadeIn");
	const [dialogueIndex, setDialogueIndex] = useState(0);
	const [waitingForClick, setWaitingForClick] = useState(false);
	const [displayedText, setDisplayedText] = useState("");
	const [isTextFading, setIsTextFading] = useState(false);
	const [isDialogueVisible, setIsDialogueVisible] = useState(false);
	const [dialogueLoaded, setDialogueLoaded] = useState(false);
	const navigate = useNavigate();

	const { updateGameState } = useContext(GameContext);
	const [username, setUsername] = useState("");

	const autoProgressTimeoutRef = useRef(null); // 自動進行のタイマーを管理

	// 次のダイアログに進む処理 (useCallbackでメモ化)
	const handleNextDialogue = useCallback(() => {
		// 自動進行のタイマーをクリア
		if (autoProgressTimeoutRef.current) {
			clearTimeout(autoProgressTimeoutRef.current);
			autoProgressTimeoutRef.current = null;
		}

		if (currentPhase === "dialogue") {
			if (dialogueIndex < dialogueTexts.prologue.length - 1) {
				setIsTextFading(true);
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setIsTextFading(false);
				}, 500);
			} else {
				setIsDialogueVisible(false); // 名前入力フェーズ前にダイアログエリアをフェードアウト
				setTimeout(() => {
					setCurrentPhase("nameInput");
				}, 500);
			}
		} else if (currentPhase === "afterNameDialogue") {
			if (dialogueIndex < dialogueTexts.afterNameInput.length - 1) {
				setIsTextFading(true);
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setIsTextFading(false);
				}, 500);
			} else {
				setWaitingForClick(true);
			}
		}
	}, [currentPhase, dialogueIndex]);

	// 初期フェードイン処理
	useEffect(() => {
		setTimeout(() => {
			setFadeIn(true);
		}, 100);

		const startDialogueTimer = setTimeout(() => {
			setCurrentPhase("dialogue");
			setIsDialogueVisible(true); // ダイアログエリアを表示
			setDialogueLoaded(true); // ダイアログがロードされた状態にする
		}, 1000);

		return () => clearTimeout(startDialogueTimer);
	}, []);

	// テキストがセットされてからダイアログエリアを表示する処理
	useEffect(() => {
		if ((currentPhase === "dialogue" || currentPhase === "afterNameDialogue") && dialogueLoaded) {
			const text = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].text : dialogueTexts.afterNameInput[dialogueIndex].text;
			const autoProgress = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].autoProgress : dialogueTexts.afterNameInput[dialogueIndex].autoProgress;
			const delay = currentPhase === "dialogue" ? dialogueTexts.prologue[dialogueIndex].delay : dialogueTexts.afterNameInput[dialogueIndex].delay;

			if (text) {
				setIsTextFading(true);
				setTimeout(() => {
					setDisplayedText(text);
					setIsTextFading(false);

					// autoProgress が true の場合、指定時間後に自動で次のダイアログに進む
					if (autoProgress) {
						autoProgressTimeoutRef.current = setTimeout(() => {
							handleNextDialogue(); // 自動進行
						}, delay);
					}
				}, 500); // 0.5秒のフェードアウト後にテキストを変更
			}
		}
	}, [dialogueIndex, currentPhase, dialogueLoaded, handleNextDialogue]);

	// 名前入力処理
	const handleSubmitName = (e) => {
		e.preventDefault();
		if (username.trim()) {
			updateGameState({ playerName: username });
			setIsDialogueVisible(false); // 名前入力前にダイアログエリアを一時的にフェードアウト
			setTimeout(() => {
				setCurrentPhase("afterNameDialogue");
				setDialogueIndex(0);
				setIsDialogueVisible(true); // 名前入力後にダイアログエリアを再表示
			}, 500);
		}
	};

	// 最後のダイアログ後のクリック処理
	const handleFinalClick = () => {
		if (waitingForClick) {
			navigate("/nextPage");
		} else {
			handleNextDialogue(); // 手動で次に進む
		}
	};

	return (
		<div className={`prologue-screen-wrapper ${fadeIn ? "fade-in" : ""}`} onClick={handleFinalClick}>
			<div className="prologue-background-layer"></div>

			{/* ダイアログエリアをフェードで表示・非表示 */}
			<div className={`dialogue-area ${isDialogueVisible ? "fade-in" : "fade-out"}`}>
				<div className={`dialogue-text ${isTextFading ? "fade-out" : "fade-in"}`}>
					<p>{displayedText}</p>
				</div>
			</div>

			{/* 名前入力表示 */}
			{currentPhase === "nameInput" && (
				<div className="contract-wrapper">
					<h2>入社誓約書</h2>
					<p>〇〇コンサルティングへ仲間入りするにあたり、下記に同意し署名してください。</p>
					<p>1. クライアントの成功を第一に考え、常に努力し、最善の提案とサポートを提供します。</p>
					<p>2. どんな困難なミッションでも諦めることなく、挑み続けます。</p>
					<p>3. 本ゲームは開発中でありバグが頻繁に出ることを理解しています。</p>
					<p>4. 本ゲームの改善のために積極的にフィードバックを行います。</p>
					<p>5. 制作チームは必要に応じ自由にプレイデータを収集、活用することができます。</p>
					<p>これらを踏まえ、私は誇りを持ってコンサルタントとしての道を進むことを誓います。</p>

					{/* 署名欄 */}
					<div className="signature-line">
						<label htmlFor="signature">署名：</label>
						<input type="text" id="signature" value={username} onChange={(e) => setUsername(e.target.value)} />
					</div>

					{/* 提出ボタン */}
					<button type="submit" onClick={handleSubmitName}>
						OK
					</button>
				</div>
			)}
		</div>
	);
}

export default Prologue;
