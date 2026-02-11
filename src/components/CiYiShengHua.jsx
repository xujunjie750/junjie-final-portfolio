import { useMemo, useState } from "react";
import { showcase } from "../data";

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
  const hint = useMemo(() => showcase.ciYIShengHua.hint, []);
  const [theme, setTheme] = useState("");
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
        prompt: `古风, ${theme || "春风入墨"}` 
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
    <div className="glassPanel">
      <div className="panelHeader">
        <div className="panelTitle">{showcase.ciYIShengHua.title}</div>
        <div className="panelHint">{hint}</div>
      </div>

      <div className="panelRow">
        <input
          className="textInput"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="例如：疏雨、梅影、江南、归舟、月下"
        />
        <button className="primaryButton" type="button" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? "生成中…" : "词意生花"}
        </button>
      </div>

      {error ? <div className="errorText">{error}</div> : null}

      {imageUrl ? (
        <div className="paperCard">
          <div className="paperTitle">生成画面</div>
          <img className="resultImage" src={imageUrl} alt="生成画面" />
        </div>
      ) : null}
    </div>
  );
}

