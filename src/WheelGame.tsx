import React, { useState, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import { Button, Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

interface Sector {
  option: string;
  description: string;
  style: { backgroundColor: string; textColor: string };
  type: "good" | "bad";
}

const data: Sector[] = [
  { option: "Hack", description: "Можно открыть любую букву по выбору", style: { backgroundColor: "#4caf50", textColor: "white" }, type: "good" },
  { option: "Deploy", description: "Открываются сразу две случайные буквы", style: { backgroundColor: "#2196f3", textColor: "white" }, type: "good" },
  { option: "Easter Egg", description: "Ведущий открывает одну случайную букву", style: { backgroundColor: "#ff9800", textColor: "white" }, type: "good" },
  { option: "Refactor", description: "Можно заменить уже названную букву на другую", style: { backgroundColor: "#9c27b0", textColor: "white" }, type: "good" },
  { option: "Blue Screen", description: "Пропуск хода", style: { backgroundColor: "#f44336", textColor: "white" }, type: "bad" },
  { option: "DDoS", description: "Минус 1 балл", style: { backgroundColor: "#795548", textColor: "white" }, type: "bad" },
  { option: "Bug Fix", description: "Можно крутить барабан два раза подряд", style: { backgroundColor: "#00bcd4", textColor: "white" }, type: "good" },
  { option: "Сектор Приз", description: "Организаторы получают подарок", style: { backgroundColor: "#ffeb3b", textColor: "black" }, type: "good" },
];

const WheelGame: React.FC = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const goodSoundRef = useRef<HTMLAudioElement | null>(null);
  const badSoundRef = useRef<HTMLAudioElement | null>(null);

  const spinTime = 0.8; // длительность вращения

  const handleSpinClick = () => {
    if (mustSpin) return;

    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);

    setTimeout(() => {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }
    }, spinTime*10000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        padding: "2%",
      }}
    >
      {/* Аудио файлы */}
      <audio ref={spinSoundRef} src="/baraban_1995_hq.mp3" preload="auto" />
      <audio ref={goodSoundRef} src="/1995-specialnyy-sektor.mp3" preload="auto" />
      <audio ref={badSoundRef} src="/pole_letter_wrong.mp3" preload="auto" />

      <Card style={{ textAlign: "center", padding: "20px" }}>
        <Title level={2}>Поле Чудес</Title>

        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data.map(({ option, style }) => ({ option, style }))}
          spinDuration={spinTime}
          outerBorderColor="#ccc"
          radiusLineColor="#ddd"
          fontSize={18}
          onStopSpinning={() => {
            setMustSpin(false);
            const sector = data[prizeNumber];
            setResult(sector.option);

            // Выбор звука по типу сектора
            if (sector.type === "good" && goodSoundRef.current) {
              goodSoundRef.current.currentTime = 0;
              goodSoundRef.current.play();
            } else if (sector.type === "bad" && badSoundRef.current) {
              badSoundRef.current.currentTime = 0;
              badSoundRef.current.play();
            }
          }}
        />

        <Button
          type="primary"
          size="large"
          onClick={handleSpinClick}
          disabled={mustSpin}
          style={{ marginTop: "20px" }}
        >
          Крутить колесо
        </Button>

        {result && (
          <div style={{ marginTop: "20px" }}>
            <Title level={4}>Выпал сектор: {result}</Title>
            <Paragraph>{data.find(item => item.option === result)?.description}</Paragraph>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WheelGame;
