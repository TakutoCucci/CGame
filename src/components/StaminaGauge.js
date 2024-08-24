import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./StaminaGauge.css";

function StaminaGauge({ value, max }) {
	const svgRef = useRef();

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove(); // 既存のSVGをクリア

		const width = window.innerWidth * 0.4; // フレームの幅はページ幅の40%
		const rightHeight = window.innerHeight * 0.1; // 右側の高さはページの10%
		const leftHeight = rightHeight * 0.3; // 左側の高さは右側の30%

		// ゲージの色を決定
		const getGaugeColor = (stamina) => {
			if (stamina >= 50) return "#28a745"; // 緑
			if (stamina >= 20) return "#ffc107"; // 黄
			return "#dc3545"; // 赤
		};

		// フレームの座標を定義（台形）
		const framePoints = [
			[0, rightHeight - leftHeight], // 左下
			[width, 0], // 右下
			[width, rightHeight], // 右上
			[0, rightHeight] // 左上
		];

		// スタミナに応じてゲージの塗り部分を計算
		const staminaRatio = value / max;
		const gaugeWidth = staminaRatio * width; // 塗りのX軸方向の増減
		const gaugePoints = [
			[0, rightHeight - leftHeight], // 左下
			[gaugeWidth, (gaugeWidth / width) * rightHeight], // 右下
			[gaugeWidth, rightHeight], // 右上
			[0, rightHeight] // 左上
		];

		// フレームを描画
		svg.append("polygon")
			.attr("points", framePoints.map((d) => d.join(",")).join(" "))
			.attr("fill", "none")
			.attr("stroke", "#333")
			.attr("stroke-width", 2);

		// スタミナゲージをフレームの中に描画
		svg.append("polygon")
			.attr("points", gaugePoints.map((d) => d.join(",")).join(" "))
			.attr("fill", getGaugeColor(value))
			.attr("clip-path", "polygon(0% 70%, 100% 0%, 100% 100%, 0% 100%)");
	}, [value]);

	return <svg ref={svgRef} className="stamina-gauge-svg" />;
}

export default StaminaGauge;
