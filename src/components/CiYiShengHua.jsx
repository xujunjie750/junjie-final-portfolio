import { useMemo, useState } from "react";

const CI_PAI = ["自动选择", "念奴娇", "水调歌头", "蝶恋花", "浣溪沙", "虞美人", "满江红", "西江月", "如梦令"];
const STYLE = ["水墨画", "工笔画", "泼墨", "写意"];

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = typeof data?.error === "string" ? data.error : "请求失败";
    throw new Error(err);
  }
  return data;
}

export function CiYiShengHua() {
  const [mood, setMood] = useState("");
  const [ciPai, setCiPai] = useState("自动选择");
  const [style, setStyle] = useState("水墨画");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  async function onGenerate() {
    setError("");
    setIsLoading(true);
    setImageUrl("");

    try {
      const img = await postJson("/api/chat", { 
        mode: "image", 
        prompt: `${mood || "今天下雪了,心情很冷"}`,
        ciPai,
        style,
      });
      const url = img?.output?.images?.[0]?.url ?? "";
      if (!url) {
        throw new Error(img.message || "未能获取图片 URL");
      }
      setImageUrl(url);
    } catch (e) {
      setError(e?.message || "生成失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="cys-panel">
      <div className="cys-row">
        <div className="cys-label">诉说你的心情</div>
        <textarea
          className="cys-textarea"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="今天下雪了,心情很冷"
        />
      </div>

      <div className="cys-row">
        <div className="cys-label">词牌名 (可选)</div>
        <div className="cys-button-group">
          {CI_PAI.map((item) => (
            <button
              key={item}
              className={`cys-button ${ciPai === item ? "active" : ""}`}
              onClick={() => setCiPai(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="cys-row">
        <div className="cys-label">选择画风</div>
        <div className="cys-button-group">
          {STYLE.map((item) => (
            <button
              key={item}
              className={`cys-button ${style === item ? "active" : ""}`}
              onClick={() => setStyle(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button className="cys-generate-button" type="button" onClick={onGenerate} disabled={isLoading}>
        {isLoading ? "生成中…" : "生成宋词与插图"}
      </button>

      {error ? <div className="errorText">{error}</div> : null}

      {imageUrl ? (
        <div className="cys-image-card">
          <img className="resultImage" src={imageUrl} alt="生成画面" />
        </div>
      ) : null}
    </div>
  );
}

