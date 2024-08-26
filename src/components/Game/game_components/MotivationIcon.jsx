import React, { useState } from "react";
// import Lottie from "react-lottie";
import { useSpring, animated } from "react-spring";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BoxGeometry } from "three";
import { FaSmile, FaMeh, FaFrown, FaBatteryFull, FaBatteryHalf, FaBatteryQuarter, FaBatteryEmpty, FaFire, FaHeart, FaLeaf, FaTachometerAlt, FaBolt, FaMusic } from "react-icons/fa";
// import animationDataHigh from './animations/highMotivation.json';
// import animationDataLow from './animations/lowMotivation.json';

// THREEのBoxGeometryを拡張
extend({ BoxGeometry });

const MotivationIcon = ({ motivation }) => {
	const [pattern, setPattern] = useState("emojiFace"); // デフォルトパターン

	const renderIcon = () => {
		switch (pattern) {
			// case "lottie":
			// return <LottieMotivation motivation={motivation} />;
			case "spring":
				return <SpringMotivation motivation={motivation} />;
			case "threeD":
				return <ThreeDMotivation motivation={motivation} />;
			case "battery":
				return getBatteryIcon(motivation);
			case "fire":
				return getFireIcon(motivation);
			case "heart":
				return getHeartIcon(motivation);
			case "flower":
				return getFlowerIcon(motivation);
			case "speed":
				return getSpeedIcon(motivation);
			case "lightning":
				return getLightningIcon(motivation);
			case "music":
				return getMusicIcon(motivation);
			case "emojiFace":
				return getEmojiFaceIcon(motivation);
			case "emoji":
			default:
				return getEmojiIcon(motivation);
		}
	};

	// // Lottieアニメーション
	// const LottieMotivation = ({ motivation }) => {
	// 	const defaultOptions = {
	// 		loop: true,
	// 		autoplay: true,
	// 		animationData: motivation > 3 ? animationDataHigh : animationDataLow,
	// 		rendererSettings: {
	// 			preserveAspectRatio: "xMidYMid slice"
	// 		}
	// 	};
	// 	return <Lottie options={defaultOptions} height={200} width={200} />;
	// };

	// Springアニメーション
	const SpringMotivation = ({ motivation }) => {
		const props = useSpring({
			transform: `scale(${1 + motivation * 0.1})`,
			config: { tension: 120, friction: 14 }
		});
		return (
			<animated.div style={props}>
				<div style={{ fontSize: "4rem" }}>{motivation > 3 ? "🔥" : "😐"}</div>
			</animated.div>
		);
	};

	// 3Dオブジェクト（Three.js）
	const Box = ({ motivation }) => {
		return (
			<mesh rotation={[motivation * 0.5, motivation * 0.5, 0]}>
				<boxGeometry attach="geometry" args={[1, 1, 1]} />
				<meshStandardMaterial attach="material" color={motivation > 3 ? "green" : "red"} />
			</mesh>
		);
	};

	const ThreeDMotivation = ({ motivation }) => {
		return (
			<Canvas style={{ height: "200px", width: "200px" }}>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} />
				<Box motivation={motivation} />
				<OrbitControls />
			</Canvas>
		);
	};

	// React Icons 表示関数
	const getEmojiIcon = (motivation) => {
		return (
			<div style={{ fontSize: "2rem" }}>
				{"⭐".repeat(motivation)}
				{"☆".repeat(5 - motivation)}
			</div>
		);
	};

	const getEmojiFaceIcon = (motivation) => {
		switch (motivation) {
			case 5:
				return "😁";
			case 4:
				return "😊";
			case 3:
				return "😐";
			case 2:
				return "😟";
			case 1:
				return "😞";
			default:
				return "😐";
		}
	};

	const getBatteryIcon = (motivation) => {
		switch (motivation) {
			case 5:
				return <FaBatteryFull size={50} color="#4CAF50" />;
			case 4:
				return <FaBatteryHalf size={50} color="#8BC34A" />;
			case 3:
				return <FaBatteryQuarter size={50} color="#FFC107" />;
			case 2:
				return <FaBatteryQuarter size={50} color="#FF7043" />;
			case 1:
				return <FaBatteryEmpty size={50} color="#F44336" />;
			default:
				return <FaBatteryEmpty size={50} color="#F44336" />;
		}
	};

	const getFireIcon = (motivation) => {
		const fireColors = ["#F44336", "#FF7043", "#FFC107", "#8BC34A", "#4CAF50"];
		return <FaFire size={50} color={fireColors[motivation - 1]} />;
	};

	const getHeartIcon = (motivation) => {
		return <FaHeart size={50} color={motivation > 3 ? "#F44336" : motivation > 1 ? "#FF7043" : "#E0E0E0"} />;
	};

	const getFlowerIcon = (motivation) => {
		return <FaLeaf size={50} color={motivation > 3 ? "#4CAF50" : motivation > 1 ? "#FFC107" : "#FF7043"} />;
	};

	const getSpeedIcon = (motivation) => {
		return <FaTachometerAlt size={50} color={motivation > 3 ? "#4CAF50" : motivation > 1 ? "#FFC107" : "#FF7043"} />;
	};

	const getLightningIcon = (motivation) => {
		return <FaBolt size={50} color={motivation > 3 ? "#4CAF50" : motivation > 1 ? "#FFC107" : "#FF7043"} />;
	};

	const getMusicIcon = (motivation) => {
		return <FaMusic size={50} color={motivation > 3 ? "#4CAF50" : motivation > 1 ? "#FFC107" : "#FF7043"} />;
	};

	return (
		<div style={styles.container}>
			<div style={styles.background}>
				<div style={styles.iconContainer}>{renderIcon()}</div>
				<div style={styles.textContainer}>
					<p style={styles.motivationLabel}>やる気</p>
				</div>
			</div>

			{/* <div style={styles.selectorContainer}>
				<label style={styles.label}>パターンを選択:</label>
				<select value={pattern} onChange={(e) => setPattern(e.target.value)} style={styles.select}>
					<option value="lottie">Lottieアニメーション</option>
					<option value="spring">Springアニメーション</option>
					<option value="threeD">3Dオブジェクト</option>
					<option value="emoji">星の絵文字</option>
					<option value="emojiFace">表情の絵文字</option>
					<option value="battery">バッテリー</option>
					<option value="fire">炎</option>
					<option value="heart">ハート</option>
					<option value="flower">花</option>
					<option value="speed">スピードメーター</option>
					<option value="lightning">雷</option>
					<option value="music">音符</option>
				</select>
			</div> */}
		</div>
	);
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "300px"
	},
	background: {
		width: "220px",
		height: "220px",
		backgroundColor: "#E0E0E0",
		borderRadius: "15px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
		marginBottom: "20px"
	},
	iconContainer: {
		//	marginBottom: "10px",
		fontSize: "5rem"
	},
	textContainer: {
		textAlign: "center"
	},
	motivationLabel: {
		fontSize: "30px", // フォントサイズを大きく
		fontWeight: "bold", // 太字にして強調
		color: "#FFFFFF" // テキストの色を白に変更
		// backgroundColor: "#4CAF50", // 背景色を緑に
		// padding: "5px 10px", // 内側の余白を追加
		// borderRadius: "10px", // 角を丸く
		// textAlign: "center", // テキストを中央揃え
		// boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 影を付けて立体感を追加
		// marginTop: "10px", // 上部に少し余白を追加
		// marginBottom: "0", // 下部の余白をなくす
		// display: "inline-block" // ラベルをインラインブロックにして調整しやすく
	},
	selectorContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	label: {
		marginRight: "10px",
		fontSize: "16px"
	},
	select: {
		padding: "5px",
		fontSize: "16px"
	}
};

export default MotivationIcon;
