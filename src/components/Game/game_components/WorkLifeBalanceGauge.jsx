import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// 定数の定義
const width = 400; // ゲージの幅
const height = 40; // ゲージの高さ
const radius = 10; // 角の丸み
const maxBalance = 50; // ワークライフバランスの最大値（-50～50）
const leftMargin = 100; // 左側の余白
const rightMargin = 100; // 右側の余白
const verticalPadding = 30; // 上下の余白
const tickCount = 11; // 目盛りの数

const WorkLifeBalanceGauge = ({ workLifeBalance }) => {
	const svgRef = useRef();
	const gaugeClipRef = useRef();

	useEffect(() => {
		const svgHeight = height + verticalPadding * 2;
		const totalWidth = width + leftMargin + rightMargin;

		// SVGのセットアップ
		const svg = d3.select(svgRef.current).attr("width", totalWidth).attr("height", svgHeight);

		// 一度だけ背景フレームや塗りつぶしを追加する
		if (!svg.select(".background-frame").size()) {
			// 背景フレーム
			svg.append("rect")
				.attr("class", "background-frame")
				.attr("x", 0)
				.attr("y", verticalPadding - 10)
				.attr("width", totalWidth)
				.attr("height", height + 20)
				.attr("rx", radius + 5)
				.attr("ry", radius + 5)
				.attr("fill", "#6BB3FF")
				.attr("stroke", "#FFFFFF")
				.attr("stroke-width", 3);

			// ゲージの背景
			svg.append("rect")
				.attr("x", leftMargin)
				.attr("y", verticalPadding)
				.attr("width", width)
				.attr("height", height)
				.attr("rx", radius)
				.attr("ry", radius)
				.attr("fill", "#E0E0E0")
				.attr("stroke", "#FFFFFF")
				.attr("stroke-width", 2);

			// ゲージの塗りつぶし部分
			svg.append("rect")
				.attr("class", "gauge-fill")
				.attr("x", leftMargin)
				.attr("y", verticalPadding)
				.attr("width", width)
				.attr("height", height)
				.attr("rx", radius)
				.attr("ry", radius)
				.attr("fill", "#FFD700");

			// ゲージのクリップパス設定
			const clipPath = svg.append("defs").append("clipPath").attr("id", "balance-clip");

			clipPath
				.append("rect")
				.attr("x", leftMargin + width / 2)
				.attr("y", verticalPadding)
				.attr("height", height)
				.attr("width", 0);

			// 塗りつぶし部分にクリップパスを適用
			svg.select(".gauge-fill").attr("clip-path", "url(#balance-clip)");

			gaugeClipRef.current = svg.select("#balance-clip rect").node();
		}

		// 目盛りを表示（塗りつぶし後に表示するために描画順を調整）
		if (!svg.selectAll(".tick").size()) {
			const ticks = d3.range(-maxBalance, maxBalance + 1, (maxBalance * 2) / (tickCount - 1));

			svg.selectAll(".tick")
				.data(ticks)
				.enter()
				.append("line")
				.attr("class", "tick")
				.attr("x1", (d) => leftMargin + width / 2 + (d / maxBalance) * (width / 2))
				.attr("y1", verticalPadding + 5)
				.attr("x2", (d) => leftMargin + width / 2 + (d / maxBalance) * (width / 2))
				.attr("y2", verticalPadding + height - 5)
				.attr("stroke", "#FFFFFF")
				.attr("stroke-width", 2)
				.attr("opacity", 1);
		}

		// 「Work」と「Life」のラベルを追加
		if (!svg.selectAll(".work-life-label").size()) {
			svg.append("text")
				.attr("class", "work-life-label")
				.attr("x", leftMargin / 2)
				.attr("y", svgHeight / 2)
				.attr("dominant-baseline", "middle")
				.attr("text-anchor", "middle")
				.attr("font-size", "24px")
				.attr("font-weight", "bold")
				.attr("fill", "#FFFFFF")
				.text("Work");

			svg.append("text")
				.attr("class", "work-life-label")
				.attr("x", totalWidth - rightMargin / 2)
				.attr("y", svgHeight / 2)
				.attr("dominant-baseline", "middle")
				.attr("text-anchor", "middle")
				.attr("font-size", "24px")
				.attr("font-weight", "bold")
				.attr("fill", "#FFFFFF")
				.text("Life");
		}
	}, []);

	useEffect(() => {
		const balanceWidth = width / 2;
		const center = width / 2;

		const getFillColor = (balance) => {
			const absBalance = Math.abs(balance);
			if (absBalance <= 15) {
				return "#4CAF50"; // はっきりとしたグリーン (正常範囲)
			} else if (absBalance <= 30) {
				return "#8BC34A"; // ライトグリーン (軽い偏り)
			} else if (absBalance <= 40) {
				return "#FFC107"; // はっきりとしたイエロー (やや偏り)
			} else if (absBalance <= 45) {
				return "#FF7043"; // はっきりとしたオレンジ (偏りが大きい)
			} else {
				return "#F44336"; // はっきりとした赤 (警告状態)
			}
		};

		d3.select(".gauge-fill").attr("fill", getFillColor(workLifeBalance));

		if (gaugeClipRef.current) {
			const direction = workLifeBalance >= 0 ? 1 : -1;
			const absValue = Math.abs(workLifeBalance);

			// クリップパスの更新でゲージを塗りつぶす範囲を設定
			d3.select(gaugeClipRef.current)
				.transition()
				.duration(800)
				.ease(d3.easeCubicInOut)
				.attr("x", leftMargin + center - (direction === -1 ? (absValue / maxBalance) * balanceWidth : 0))
				.attr("width", (absValue / maxBalance) * balanceWidth);
		}
	}, [workLifeBalance]);

	return <svg ref={svgRef}></svg>;
};

export default WorkLifeBalanceGauge;
