import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAudio } from "../hooks/useAudio";

const initialItems = [
  { id: "1", content: "ヒアリング実施" },
  { id: "2", content: "課題整理" },
  { id: "3", content: "提案準備" },
  { id: "4", content: "プレゼン実施" },
];

const correctOrder = ["1", "2", "3", "4"];

export default function DeckSorterGame() {
  const [items, setItems] = useState(initialItems);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { playSound, stopSound, stopAllSounds } = useAudio();

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || completed) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (soundEnabled) {
            playSound("timeUp", 0.6);
            stopSound("bgm");
          }
          setCompleted(true);
          setScore(0);
          return 0;
        }

        // 残り10秒以下でティック音を再生
        if (prevTime <= 10 && soundEnabled) {
          playSound("tick", 0.3);
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, completed, soundEnabled, playSound, stopSound]);

  const onDragEnd = (result) => {
    if (!result.destination || completed) return;

    // 最初のドラッグでゲーム開始
    if (!gameStarted) {
      setGameStarted(true);
      if (soundEnabled) {
        playSound("start", 0.5);
        playSound("bgm", 0.3);
      }
    }

    if (soundEnabled) {
      playSound("drop", 0.4);
    }

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
  };

  const onDragStart = () => {
    if (soundEnabled) {
      playSound("drag", 0.3);
    }
  };

  const handleCheck = () => {
    if (completed) return;

    if (soundEnabled) {
      playSound("button", 0.4);
    }

    const currentIds = items.map((item) => item.id);
    const isCorrect =
      JSON.stringify(currentIds) === JSON.stringify(correctOrder);
    const calculatedScore = isCorrect ? timeLeft : 0;
    setScore(calculatedScore);
    setCompleted(true);

    if (soundEnabled) {
      if (isCorrect) {
        playSound("correct", 0.6);
      } else {
        playSound("incorrect", 0.5);
      }
      stopSound("bgm");
    }
  };

  const resetGame = () => {
    if (soundEnabled) {
      playSound("button", 0.4);
    }

    setItems(initialItems);
    setTimeLeft(30);
    setCompleted(false);
    setScore(null);
    setGameStarted(false);
    stopAllSounds();
  };

  const startGame = () => {
    if (soundEnabled) {
      playSound("start", 0.5);
      playSound("bgm", 0.3);
    }
    setGameStarted(true);
  };

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);

    if (!newSoundState) {
      stopAllSounds();
    } else if (gameStarted && !completed) {
      playSound("bgm", 0.3);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>順番を正しく並べよう！</h2>
        <button
          onClick={toggleSound}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            backgroundColor: soundEnabled ? "#4CAF50" : "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {soundEnabled ? "🔊 音ON" : "🔇 音OFF"}
        </button>
      </div>

      <div
        style={{
          marginBottom: 20,
          padding: 16,
          backgroundColor: timeLeft <= 10 ? "#ffebee" : "#f5f5f5",
          borderRadius: 8,
          border: timeLeft <= 10 ? "2px solid #f44336" : "1px solid #ddd",
        }}
      >
        <p style={{ margin: 0, fontSize: "18px" }}>
          残り時間:{" "}
          <strong
            style={{
              color: timeLeft <= 10 ? "#f44336" : "#000",
              fontSize: "24px",
            }}
          >
            {timeLeft}
          </strong>
          秒
        </p>
        {!gameStarted && (
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
            カードを動かすとゲームが開始されます
          </p>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="deck">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: 200,
                background: snapshot.isDraggingOver ? "#e3f2fd" : "transparent",
                padding: 8,
                borderRadius: 4,
                transition: "background-color 0.2s ease",
              }}
            >
              {items.map((item, index) => (
                <Draggable draggableId={item.id} index={index} key={item.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: 16,
                        marginBottom: 12,
                        background: snapshot.isDragging ? "#f0f0f0" : "#ffffff",
                        border: "2px solid #ddd",
                        borderRadius: 8,
                        boxShadow: snapshot.isDragging
                          ? "0 5px 10px rgba(0,0,0,0.15)"
                          : "0 2px 4px rgba(0,0,0,0.1)",
                        opacity: completed ? 0.6 : 1,
                        cursor: "grab",
                        userSelect: "none",
                        transition: "all 0.2s ease",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {item.content}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        {!completed && gameStarted && (
          <button
            onClick={handleCheck}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            並びを確認する
          </button>
        )}

        {!gameStarted && (
          <button
            onClick={startGame}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ゲーム開始
          </button>
        )}

        {completed && (
          <div>
            <p style={{ marginBottom: "16px", fontSize: "18px" }}>
              結果:{" "}
              <strong style={{ color: score > 0 ? "#4CAF50" : "#f44336" }}>
                {score > 0
                  ? `正解！スコア ${score}`
                  : timeLeft === 0
                  ? "時間切れ！再挑戦してみよう！"
                  : "不正解。再挑戦してみよう！"}
              </strong>
            </p>
            <button
              onClick={resetGame}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              もう一度挑戦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
