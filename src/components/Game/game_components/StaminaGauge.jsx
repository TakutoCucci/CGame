import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// 定数をコンポーネント外で定義
const width = 600; // ゲージの横幅
const height = 30; // ゲージの縦幅（高さ）
const radius = 10; // ゲージの角の丸みの半径
const maxStamina = 100; // スタミナの最大値（ゲージが最大のときの値）
const leftMargin = 100; // 左側の余白の幅
const rightMargin = 15; // 右側の余白の幅
const verticalPadding = 30; // ゲージの上下に配置される余白

const StaminaGauge = ({ stamina }) => {
	const svgRef = useRef(); // SVG要素への参照を保持
	const gaugeClipRef = useRef(); // クリップパスのrect要素への参照を保持

	useEffect(() => {
		const svgHeight = height + verticalPadding * 2; // ゲージに上下の余白を含んだSVG全体の高さを計算
		const totalWidth = width + leftMargin + rightMargin + 10; // ゲージ本体と余白を含んだ全体の幅
		// SVGのセットアップ
		const svg = d3
			.select(svgRef.current) // svgRefを使って現在のSVG要素を選択
			.attr("width", totalWidth) // SVGの幅を設定
			.attr("height", svgHeight) // SVGの高さを設定
			.style("background", "transparent"); // 背景を透明に設定

		// 全体の背景フレーム (光沢感のある青色の枠)
		svg.append("rect")
			.attr("x", 0) // 左端に配置
			.attr("y", verticalPadding / 2) // 上下の余白を均等に配置
			.attr("width", totalWidth) // 全体の幅
			.attr("height", svgHeight - verticalPadding) // 縦の余白を除いた高さ
			.attr("rx", radius + 5) // 背景フレームの角の丸み（ゲージより少し大きい）
			.attr("ry", radius + 5)
			.attr("fill", "#3d94ff") // 背景色（青）
			.attr("stroke", "#FFFFFF") // 枠線の色（白）
			.attr("stroke-width", 5) // 枠線の太さ
			.attr("filter", "url(#drop-shadow)"); // 光沢効果のフィルターを適用

		// 背景フレームの描画
		svg.append("rect")
			.attr("x", leftMargin) // 左の余白分、ゲージを右に配置
			.attr("y", verticalPadding) // 上下の余白を反映した中央揃え
			.attr("width", width) // ゲージの幅
			.attr("height", height) // ゲージの高さ
			.attr("rx", radius) // ゲージの角の丸み
			.attr("ry", radius)
			.attr("fill", "#b3b3b3") // ゲージの背景色
			.attr("stroke", "#FFFFFF") // 枠線の色（白）
			.attr("stroke-width", 4); // 枠線の太さ

		// グラデーションの定義
		const defs = svg.append("defs"); // グラデーションやクリップパスなどの定義要素を追加
		const gradient = defs
			.append("linearGradient")
			.attr("id", "stamina-gradient") // グラデーションのID
			.attr("x1", "0%") // グラデーションの開始点（左端）
			.attr("y1", "0%")
			.attr("x2", "100%") // グラデーションの終了点（右端）
			.attr("y2", "0%");

		// グラデーションの色の設定（赤→黄→緑）
		gradient.append("stop").attr("offset", "0%").attr("stop-color", "#EA5C54"); // 赤
		gradient.append("stop").attr("offset", "50%").attr("stop-color", "#F7E733"); // 黄
		gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3AA655"); // 緑

		// ゲージの描画とクリップパスの設定
		const gauge = svg
			.append("rect")
			.attr("x", leftMargin) // 左の余白を考慮した位置に配置
			.attr("y", verticalPadding) // 縦の余白分だけ中央揃え
			.attr("width", width) // ゲージの幅
			.attr("height", height) // ゲージの高さ
			.attr("rx", radius) // 角の丸み
			.attr("ry", radius)
			.attr("fill", "url(#stamina-gradient)"); // グラデーションを適用

		// クリップパスを使用してゲージを切り取る
		const clipPath = defs.append("clipPath").attr("id", "stamina-clip"); // クリップパスのIDを設定
		clipPath
			.append("rect")
			.attr("x", leftMargin)
			.attr("y", verticalPadding)
			.attr("height", height)
			//.attr("width", (stamina / maxStamina) * width) // スタミナに応じた幅に設定する場合（消さないこと）
			.attr("width", 0); // 初期状態は0に設定

		gauge.attr("clip-path", "url(#stamina-clip)"); // ゲージにクリップパスを適用
		gaugeClipRef.current = svg.select("#stamina-clip rect").node(); // クリップパスのrect要素を取得

		// 「体力」のテキストを追加（垂直方向に中央揃え）
		svg.append("text")
			.attr("x", leftMargin / 2) // 左の余白の中央に配置
			.attr("y", svgHeight / 2) // SVG全体の中央に配置
			.attr("dominant-baseline", "middle") // テキストを垂直中央揃え
			.attr("text-anchor", "middle") // テキストを水平方向に中央揃え
			.attr("font-size", "24px") // フォントサイズ
			.attr("font-weight", "bold") // テキストをボールド（太字）にする
			// .attr("font-family", "Arial, sans-serif") // フォントファミリーを指定
			.attr("fill", "#FFFFFF") // テキストの色（白）
			.text("体力"); // 表示されるテキスト

		// 光沢効果の追加（消さないこと）
		/*
		const filter = defs.append("filter").attr("id", "drop-shadow");
		filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3); // ぼかし効果
		filter.append("feOffset").attr("dx", 2).attr("dy", 2).attr("result", "offsetblur"); // 影のオフセット
		const feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode"); // ぼかしの結合
		feMerge.append("feMergeNode").attr("in", "SourceGraphic"); // オリジナルの図形と合成
		*/
	}, []);

	useEffect(() => {
		// staminaの変化に応じてクリップパスを更新
		if (gaugeClipRef.current) {
			d3.select(gaugeClipRef.current)
				.transition() // トランジション（アニメーション）を開始
				.duration(800) // アニメーションの時間を800ミリ秒に設定
				.ease(d3.easeCubicInOut) // アニメーションに加速・減速を適用
				.attr("width", (stamina / maxStamina) * width); // スタミナに応じてゲージの幅を更新
		}
	}, [stamina]);

	return <svg ref={svgRef}></svg>; // SVGをレンダリング
};

export default StaminaGauge;
