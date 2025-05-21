"use client";
import { useState, useEffect, useRef } from "react"; 

// 遅刻や寝坊に関する運勢とコメント（敬語なし）
const lateFortunesWithComments = [
  {
    fortune: "大吉",
    comments: [
      "目覚まし前にスッキリ起床！ 今日は時間に余裕を持って最高のスタートを切れるでしょう。",
      "アラームが鳴る前に目が覚める幸運！ 今日は何事もスムーズに進みそうです。",
      "早朝から活動開始！ 今日は一日を通してエネルギッシュに過ごせるでしょう。",
    ],
  },
  {
    fortune: "中吉",
    comments: [
      "二度寝の誘惑をなんとか撃退！ まずまずのスタートです。油断せずに行きましょう。",
      "予定通りの時間に起床。今日のタスクも落ち着いてこなせそうです。",
      "まあまあの目覚め。いつも通り、マイペースで一日を過ごせるでしょう。",
    ],
  },
  {
    fortune: "吉",
    comments: [
      "ギリギリセーフで起床！ 慌てずに支度すれば、遅刻はなさそうです。",
      "なんとか起きられた！ 今日は小さな幸せを見つけられるかもしれません。",
      "ぼちぼちの目覚め。今日は平凡な一日になりそうですが、それもまた良し。",
    ],
  },
  {
    fortune: "小吉",
    comments: [
      "少し寝坊気味… でも、まだ挽回できるはず！ 焦らず行動しましょう。",
      "うーん、もう少し寝たかった… 今日は控えめに行動するのが吉かもしれません。",
      "あとちょっとでアウトだった！ 今日は慎重に過ごしましょう。",
    ],
  },
  {
    fortune: "末吉",
    comments: [
      "危うく寝過ごすところだった！ 今日は時間に追われる予感…？",
      "もう少し寝坊していたら大変なことに！ 今日は気を引き締めて過ごしましょう。",
      "ふぅ、間一髪で起床。今日は何事もギリギリになりそうです。",
    ],
  },
  {
    fortune: "凶",
    comments: [
      "やってしまった… 寝坊で遅刻確定か。今日の挽回は難しそうです。",
      "あちゃー… 目覚まし聞こえなかった？ 今日は散々な一日になるかも。",
      "朝からトラブル発生！ 今日は大人しくしていましょう。",
    ],
  },
  {
    fortune: "大凶",
    comments: [
      "最悪の寝坊！ 今日は全てが裏目に出る可能性大。無理せず静かに過ごしましょう。",
      "歴史に残る大寝坊！ 今日は諦めて家でゆっくりするのが賢明かも。",
      "カタストロフィー！ 今日は何をやってもうまくいかないでしょう。",
    ],
  },
];

// 確率に基づいて遅刻や寝坊に関する運勢（とコメント）を取得する関数（幅を持たせる）
function getLateFortuneWithComment(probability: number): { fortune: string; comment: string } {
  let possibleFortunes = [];

  if (probability >= 85) {
    possibleFortunes.push(lateFortunesWithComments[0]); // 大吉
    possibleFortunes.push(lateFortunesWithComments[1]); // 中吉
  } else if (probability >= 65) {
    possibleFortunes.push(lateFortunesWithComments[1]); // 中吉
    possibleFortunes.push(lateFortunesWithComments[2]); // 吉
  } else if (probability >= 45) {
    possibleFortunes.push(lateFortunesWithComments[2]); // 吉
    possibleFortunes.push(lateFortunesWithComments[3]); // 小吉
  } else if (probability >= 25) {
    possibleFortunes.push(lateFortunesWithComments[3]); // 小吉
    possibleFortunes.push(lateFortunesWithComments[4]); // 末吉
  } else if (probability >= 10) {
    possibleFortunes.push(lateFortunesWithComments[4]); // 末吉
    possibleFortunes.push(lateFortunesWithComments[5]); // 凶
  } else {
    possibleFortunes.push(lateFortunesWithComments[5]); // 凶
    possibleFortunes.push(lateFortunesWithComments[6]); // 大凶
  }

  const randomFortune = possibleFortunes[Math.floor(Math.random() * possibleFortunes.length)];
  const randomIndex = Math.floor(Math.random() * randomFortune.comments.length);
  return { fortune: randomFortune.fortune, comment: randomFortune.comments[randomIndex] };
}

// 現在時刻と予定時刻と所要時間から、間に合う確率を推定する関数
function estimateArrivalProbability(currentTime: string, targetTime: string, requiredTime: number): number {
  const [currentH, currentM] = currentTime.split(":").map(Number);
  const [targetH, targetM] = targetTime.split(":").map(Number);
  const currentMinutes = currentH * 60 + currentM;
  const targetMinutes = targetH * 60 + targetM;
  const availableMinutes = targetMinutes - currentMinutes;
  const marginMinutes = availableMinutes - requiredTime;

  if (marginMinutes < 0) return 0;
  if (marginMinutes >= 60) return 90 + Math.random() * 9;
  if (marginMinutes >= 30) return 70 + Math.random() * 15;
  if (marginMinutes >= 15) return 50 + Math.random() * 15;
  if (marginMinutes >= 5) return 30 + Math.random() * 15;
  return 5 + Math.random() * 20;
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [targetTime, setTargetTime] = useState("10:30"); 
  const [requiredTime, setRequiredTime] = useState<number>(15); 
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultProbability, setResultProbability] = useState<number | null>(null);
  const [probabilityColor, setProbabilityColor] = useState<React.CSSProperties>({});
  const [lateFortuneResult, setLateFortuneResult] = useState<{ fortune: string; comment: string } | null>(null);
  const [diagnosed, setDiagnosed] = useState(false);
  const [arrivalProbForFortune, setArrivalProbForFortune] = useState<number | null>(null); 

  const imgRef = useRef<HTMLImageElement>(null); 
  const overlayRef = useRef<HTMLDivElement>(null); 

  const adjustOverlay = () => {
    if (imgRef.current && overlayRef.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      overlayRef.current.style.width = `${imgRect.width}px`;
      overlayRef.current.style.height = `${imgRect.height}px`;
      overlayRef.current.style.top = `${imgRect.top}px`;
      overlayRef.current.style.left = `${imgRect.left}px`;
    }
  };

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setCurrentTime(`${hours}:${minutes}`);

    const currentImgRef = imgRef.current; 

    const handleLoad = () => {
      adjustOverlay();
    };

    if (currentImgRef) {
      if (currentImgRef.complete) { 
        handleLoad();
      } else {
        currentImgRef.addEventListener('load', handleLoad);
      }
    }
    
    window.addEventListener('resize', adjustOverlay);

    return () => {
      if (currentImgRef) {
        currentImgRef.removeEventListener('load', handleLoad);
      }
      window.removeEventListener('resize', adjustOverlay);
    };
  }, []); 

  const getProbabilityColor = (probability: number): React.CSSProperties => {
    let style: React.CSSProperties = {};
    if (probability === 0) {
      style.color = "black";
    } else if (probability >= 99.9) { 
      style = { ...style, fontSize: "3em", fontWeight: "bold", color: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(45deg, red, orange, yellow, green, cyan, blue, purple, magenta, red)" } as React.CSSProperties;
    } else if (probability >= 80) { 
      style = { ...style, fontSize: "3em", fontWeight: "bold", color: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)" } as React.CSSProperties;
    } else if (probability >= 60) {
      style.color = "red"; style.fontWeight = "bold";
    } else if (probability >= 40) {
      style.color = "#FF69B4"; style.fontWeight = "bold";
    } else if (probability >= 20) {
      style.color = "yellow"; style.fontWeight = "bold";
    } else if (probability >= 5) {
      style.color = "green"; style.fontWeight = "bold";
    } else {
      style.color = "blue"; style.fontWeight = "bold";
    }
    return style;
  };

  function handleDiagnose() {
    const arrivalProbability = estimateArrivalProbability(currentTime, targetTime, requiredTime);
    setArrivalProbForFortune(arrivalProbability); 
    const latenessProbability = 100 - arrivalProbability; 
    const colorStyle = getProbabilityColor(latenessProbability); 
    setResultText(`⏰ 現在時刻：${currentTime}\n⏰ 予定時刻：${targetTime}\n\n⏳ 所要時間：${requiredTime}分\n\nあなたが遅刻する確率は… ` );
    setResultProbability(latenessProbability); 
    setProbabilityColor(colorStyle); 
    setDiagnosed(true);
    setLateFortuneResult(null); 
    console.log("probabilityColor ステート:", colorStyle);
  }

  function handleDrawProbabilityFortune() {
    if (diagnosed && arrivalProbForFortune !== null) { 
      setLateFortuneResult(getLateFortuneWithComment(arrivalProbForFortune)); 
    } else {
      setLateFortuneResult({ fortune: "未診断", comment: "先に診断を受けてください。" });
    }
  }

  return (
    <>
      <div className="background-wrapper"> 
        <img 
          ref={imgRef} 
          src="/shrine-background.png" 
          alt="背景" 
          className="actual-background-image"
        />
        <div ref={overlayRef} className="semi-transparent-overlay-on-image"></div>
      </div>
      <style jsx global>{`
        html {
          overflow-y: scroll;
        }

        .background-wrapper { 
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex; 
          justify-content: center;
          align-items: center;
          z-index: -2; 
          overflow: hidden; 
        }

        .actual-background-image { 
          display: block; 
          max-width: 100%;
          max-height: 100%;
          object-fit: contain; 
          z-index: 1; 
        }

        .semi-transparent-overlay-on-image { 
          position: absolute; 
          background-color: rgba(0, 0, 0, 0.15); 
          z-index: 2; 
          pointer-events: none; 
        }

        body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start; 
          box-sizing: border-box;
          padding-top: 0; 
          margin: 0; 
        }

        main {
          padding: 2rem; 
          padding-top: 5vh; 
          padding-bottom: 5vh; 
          border-radius: 10px;
          width: 90%;
          max-width: 400px; 
          text-align: center;
          font-family: sans-serif;
          box-sizing: border-box;
          color: white; 
          position: relative; 
          z-index: 0; 
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        p { 
          font-size: 1rem;
          margin-bottom: 1rem;
          font-weight: normal;
        }

        .input-group {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        label {
          margin-bottom: 0.5rem;
          font-weight: bold;
          text-align: left;
          width: 80%;
          max-width: 300px;
        }

        input, select {
          padding: 0.8rem;
          font-size: 1rem;
          border: 1px solid #aaa; 
          border-radius: 4px;
          width: 80%;
          max-width: 300px;
          box-sizing: border-box;
          margin-bottom: 0.8rem;
          color: white; 
          background-color: transparent; 
        }
        
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1); 
        }
        select {
          /* スタイル調整 */
        }

        /* 診断するボタンのデフォルトスタイル */
        button {
          background-color: #ff4d4f; /* 赤色 */
          color: white; 
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
        }

        button:hover {
          opacity: 0.9;
        }

        /* ★ 運勢を見るボタンの専用スタイル */
        .btn-fortune {
          background-color: #87CEEB; /* 水色 (SkyBlue) */
          /* 他のスタイルは汎用buttonから継承されるか、必要なら上書き */
        }
        .btn-fortune:hover {
          opacity: 0.85; /* ホバー時の透明度を少し調整 */
        }


        .result-container {
          margin-top: 2rem;
          text-align: center;
        }
        .result-container h2 { 
           margin-bottom: 0.5rem; 
        }

        .result-probability { 
          font-size: 2em; 
          font-weight: bold; 
          display: block;
          margin-top: 0.5rem;
        }

        .fortune-container {
          margin-top: 1rem;
          text-align: center;
        }

        .fortune-title { 
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .fortune-result-main {
          font-size: 2.2em; 
          font-weight: bold;
          margin-bottom: 0.5rem; 
        }

        .fortune-text { 
          font-size: 1.1rem;
          font-weight: normal;
          overflow-wrap: break-word; 
        }
      `}</style>
      <main>
        <h1>寝坊神社⛩️</h1>
        <p>≪終わりのない朝の社≫</p>

        <div className="input-group">
          <label htmlFor="currentTime">現在時刻：</label>
          <input type="time" id="currentTime" value={currentTime} onChange={(e) => setCurrentTime(e.target.value)} />
        </div>

        <div className="input-group">
          <label htmlFor="targetTime">予定時刻：</label>
          <input type="time" id="targetTime" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} />
        </div>

        <div className="input-group">
          <label htmlFor="requiredTime">所要時間：</label>
          <select id="requiredTime" value={requiredTime} onChange={(e) => setRequiredTime(Number(e.target.value))}>
            <option value={15}>15分</option>
            <option value={30}>30分</option>
            <option value={45}>45分</option>
            <option value={60}>60分</option>
            <option value={90}>90分</option>
          </select>
        </div>

        {/* 「診断する」ボタンにはクラス名なし (デフォルトスタイル適用) */}
        <button onClick={handleDiagnose}>🚨 診断する</button>

        {diagnosed && resultText && resultProbability !== null && (
          <div key={diagnosed ? `${currentTime}-${targetTime}-${requiredTime}-${resultProbability}` : 'initial'} className="result-container">
            <h2>診断結果</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{resultText}
              <span className="result-probability" style={probabilityColor}>
                {resultProbability.toFixed(1)}%
              </span>
            </p>
            {/* ★ 「運勢を見る」ボタンにクラス名を追加 */}
            <button onClick={handleDrawProbabilityFortune} className="btn-fortune">🙏 運勢を見る</button>
          </div>
        )}

        {lateFortuneResult && (
          <div className="fortune-container">
            <h2 className="fortune-title">🔮 今日の運勢</h2>
            <p className="fortune-result-main">{lateFortuneResult.fortune}</p>
            <p className="fortune-text">{lateFortuneResult.comment}</p>
          </div>
        )}
      </main>
    </>
  );
}