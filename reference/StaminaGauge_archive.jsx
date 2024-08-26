import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const StaminaGauge = ({ stamina }) => {
	const svgRef = useRef();
	const gaugeClipRef = useRef();

	const width = 600;
	const height = 40;
	const radius = 10;
	const maxStamina = 100;

	useEffect(() => {
		// SVGのセットアップ
		const svg = d3
			.select(svgRef.current)
			.attr("width", width + 10)
			.attr("height", height + 20)
			.style("background", "transparent");

		// 背景フレームの描画
		svg.append("rect")
			.attr("x", 5)
			.attr("y", 10)
			.attr("width", width)
			.attr("height", height)
			.attr("rx", radius)
			.attr("ry", radius)
			.attr("fill", "#c4c4c4")
			.attr("stroke", "#FFFFFF")
			.attr("stroke-width", 5);

		// グラデーションの定義
		const defs = svg.append("defs");
		const gradient = defs.append("linearGradient").attr("id", "stamina-gradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");

		gradient.append("stop").attr("offset", "0%").attr("stop-color", "#EA5C54");
		gradient.append("stop").attr("offset", "15%").attr("stop-color", "#EA5C54");
		gradient.append("stop").attr("offset", "20%").attr("stop-color", "#F7E733");
		gradient.append("stop").attr("offset", "40%").attr("stop-color", "#F7E733");
		gradient.append("stop").attr("offset", "50%").attr("stop-color", "#3AA655");
		gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3AA655");

		// ゲージの描画とクリップパスの設定
		const gauge = svg.append("rect").attr("x", 5).attr("y", 10).attr("width", width).attr("height", height).attr("rx", radius).attr("ry", radius).attr("fill", "url(#stamina-gradient)");

		const clipPath = defs.append("clipPath").attr("id", "stamina-clip");
		clipPath
			.append("rect")
			.attr("x", 5)
			.attr("y", 10)
			.attr("height", height)
			//.attr("width", (stamina / maxStamina) * width) // 初期値を現在スタミナにしたい場合
			.attr("width", 0); // 初期値は0に設定
		gauge.attr("clip-path", "url(#stamina-clip)");

		gaugeClipRef.current = svg.select("#stamina-clip rect");
	}, [width, height, radius]);

	useEffect(() => {
		// staminaの変化に応じてクリップパスを更新
		if (gaugeClipRef.current) {
			gaugeClipRef.current
				.transition()
				.duration(800)
				.ease(d3.easeCubicInOut)
				.attr("width", (stamina / maxStamina) * width);
		}
	}, [stamina]);

	return <svg ref={svgRef}></svg>;
};

export default StaminaGauge;
