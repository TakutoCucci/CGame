import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import dialogueTexts from "../data/prologue_dialogue";
import "./Prologue.css";

function Prologue() {
	// State Variables
	const [fadeIn, setFadeIn] = useState(false); // 初期フェードイン制御
	const [currentPhase, setCurrentPhase] = useState("fadeIn"); // 現在のフェーズ ("dialogue" または "nameInput")
	const [dialogueIndex, setDialogueIndex] = useState(0); // 現在のダイアログのインデックス
	const [waitingForClick, setWaitingForClick] = useState(false); // 次のページに進むクリック待ち
	const [displayedText, setDisplayedText] = useState(""); // 表示されるテキスト
	const [isTextFading, setIsTextFading] = useState(false); // テキストのフェード制御
	const [isDialogueVisible, setIsDialogueVisible] = useState(false); // ダイアログの表示/非表示制御
	const [dialogueLoaded, setDialogueLoaded] = useState(false); // ダイアログがロードされたかどうか

	// GameContextとルーティングのフック
	const { updateGameState } = useContext(GameContext); // プレイヤー名の更新に使用
	const navigate = useNavigate(); // 次のページに移動するためのフック
	const [username, setUsername] = useState(""); // 名前入力の状態管理

	const autoProgressTimeoutRef = useRef(null); // 自動進行タイマーの参照

	// ダイアログを次に進める処理
	const handleNextDialogue = useCallback(() => {
		// 自動進行タイマーをクリア
		if (autoProgressTimeoutRef.current) {
			clearTimeout(autoProgressTimeoutRef.current);
			autoProgressTimeoutRef.current = null;
		}

		// ダイアログフェーズの処理
		if (currentPhase === "dialogue") {
			// ダイアログの終わりでなければ次に進む
			if (dialogueIndex < dialogueTexts.prologue.length - 1) {
				setIsTextFading(true);
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setIsTextFading(false);
				}, 500);
			} else {
				// 名前入力フェーズに移行
				setIsDialogueVisible(false);
				setTimeout(() => {
					setCurrentPhase("nameInput");
				}, 500);
			}
		} else if (currentPhase === "afterNameDialogue") {
			// 名前入力後のダイアログ進行
			if (dialogueIndex < dialogueTexts.afterNameInput.length - 1) {
				setIsTextFading(true);
				setTimeout(() => {
					setDialogueIndex(dialogueIndex + 1);
					setIsTextFading(false);
				}, 500);
			} else {
				// 最後のダイアログ後、クリック待ちに移行
				setWaitingForClick(true);
			}
		}
	}, [currentPhase, dialogueIndex]);

	// 初期フェードイン処理
	useEffect(() => {
		setTimeout(() => setFadeIn(true), 100);

		const startDialogueTimer = setTimeout(() => {
			setCurrentPhase("dialogue");
			setIsDialogueVisible(true); // ダイアログ表示開始
			setDialogueLoaded(true); // ダイアログがロードされたことを通知
		}, 1000);

		// クリーンアップ
		return () => clearTimeout(startDialogueTimer);
	}, []);

	// ダイアログテキストのフェード表示・自動進行
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

					// 自動進行が有効な場合、指定時間後に次のダイアログに進む
					if (autoProgress) {
						autoProgressTimeoutRef.current = setTimeout(handleNextDialogue, delay);
					}
				}, 500); // テキストフェード後に進行
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
			setIsDialogueVisible(false); // 名前入力前にダイアログを非表示
			setTimeout(() => {
				setCurrentPhase("afterNameDialogue");
				setDialogueIndex(0);
				setIsDialogueVisible(true); // 名前入力後にダイアログを再表示
			}, 500);
		}
	};

	// 誓約書表示コンポーネント
	const renderContract = () => (
		<div className="contract-wrapper">
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
		</div>
	);

	// ダイアログ終了後のクリック処理
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

			{/* ダイアログエリアの表示・非表示 */}
			<div className={`dialogue-area ${isDialogueVisible ? "fade-in" : "fade-out"}`}>
				<div className={`dialogue-text ${isTextFading ? "fade-out" : "fade-in"}`}>
					<p>{displayedText}</p>
				</div>
			</div>

			{/* 名前入力フェーズ */}
			{currentPhase === "nameInput" && renderContract()}
		</div>
	);
}

export default Prologue;
