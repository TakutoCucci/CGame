import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PrologueContractModal.css";

const PrologueContractModal = ({ isVisible, onSubmit, username, setUsername }) => (
	<AnimatePresence>
		{isVisible && (
			<motion.div
				className="contract-wrapper"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }} // フェードアウト時のアニメーション
				transition={{ duration: 0.5 }}>
				<h2>入社誓約書</h2>
				<p>〇〇コンサルティングへ仲間入りするにあたり、下記に同意し署名してください。</p>
				<p>1. クライアントの成功を第一に考え、常に努力し、最善の提案とサポートを提供します。どんな困難なミッションでも諦めることなく挑み続けます。</p>
				<p>2. 本ゲームは開発中でありバグが頻繁に出ることを理解しています。ゲームの改善のために積極的にフィードバックを行います。</p>
				<p>3. 制作チームは必要に応じ自由にプレイデータを収集、活用することができます。</p>
				<p>これらを踏まえ、私は誇りを持ってコンサルタントとしての道を進むことを誓います。</p>
				<div className="signature-line">
					<label htmlFor="signature">署名：</label>
					<input type="text" id="signature" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
				<button type="submit" onClick={onSubmit}>
					OK
				</button>
			</motion.div>
		)}
	</AnimatePresence>
);

export default PrologueContractModal;
