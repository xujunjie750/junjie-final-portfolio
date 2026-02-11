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

function normalizeTextContent(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((c) => c?.text ?? "").join("");
  return "";
}

function tryParseJsonBlock(text) {
  if (!text) return null;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export function CiYiShengHua() {
  const hint = useMemo(() => showcase.ciYIShengHua.hint, []);
  const [theme, setTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [poem, setPoem] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  async function onGenerate() {
    setError("");
    setIsLoading(true);
    setPoem("");
    setImagePrompt("");
    setImageUrl("");

    try {
      const chat = await postJson("/api/chat", {
        mode: "chat",
        messages: [
          {
            role: "user",
            content:
              `请以“${theme || "春风入墨"}”为主题生成一首短宋词（4-8 句），并给出一段“古风国画风格”的文生图提示词。\n` +
              "请输出严格 JSON：{ \"poem\": \"...\", \"imagePrompt\": \"...\" }，不要输出任何多余文本。"
          }
        ]
      });

      const content = normalizeTextContent(chat?.choices?.[0]?.message?.content);
      const parsed = tryParseJsonBlock(content);

      const poemText = parsed?.poem ?? content;
      const promptText = parsed?.imagePrompt ?? "";

      setPoem(poemText);
      setImagePrompt(promptText);

      if (promptText) {
        const img = await postJson("/api/chat", { mode: "image", prompt: promptText });
        const url = img?.images?.[0]?.url ?? "";
        setImageUrl(url);
      }
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
          {isLoading ? "生成中…" : "生成"}
        </button>
      </div>

      {error ? <div className="errorText">{error}</div> : null}

      {poem ? (
        <div className="paperCard">
          <div className="paperTitle">宋词</div>
          <pre className="poemPre">{poem}</pre>
        </div>
      ) : null}

      {imagePrompt ? (
        <div className="paperCard">
          <div className="paperTitle">画面提示词</div>
          <div className="paperText">{imagePrompt}</div>
        </div>
      ) : null}

      {imageUrl ? (
        <div className="paperCard">
          <div className="paperTitle">生成画面</div>
          <img className="resultImage" src={imageUrl} alt="生成画面" />
        </div>
      ) : null}
    </div>
  );
}

