import React, { useState } from "react";
import "./UsernameInputScreen.css";

function UsernameInputScreen({ onSubmit }) {
	const [name, setName] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name.trim()) {
			onSubmit(name);
		}
	};

	return (
		<div className="username-input-screen">
			<h1>ユーザー名を入力してください</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ユーザー名" />
				<button type="submit">ゲームを開始する</button>
			</form>
		</div>
	);
}

export default UsernameInputScreen;
