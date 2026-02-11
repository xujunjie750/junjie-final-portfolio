import { useEffect, useMemo, useRef, useState } from "react";

async function postChat(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "chat", messages })
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

export function ChatWidget() {
  const welcome = useMemo(
    () => "你好！我是郡婕的数字分身，想了解我的 AI 进化史吗？",
    []
  );

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: welcome }
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages, isTyping]);

  async function onSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setIsTyping(true);

    try {
      const data = await postChat(next.filter((m) => m.role === "user" || m.role === "assistant"));
      const reply = normalizeTextContent(data?.choices?.[0]?.message?.content) || "我这边没有拿到有效回复。";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `请求失败：${e?.message || "未知错误"}` }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="chatRoot">
      {open ? (
        <div className="chatWindow">
          <div className="chatHeader">
            <div className="chatTitle">你好，我是郡婕</div>
            <button className="iconButton" type="button" onClick={() => setOpen(false)} aria-label="关闭">
              ×
            </button>
          </div>
          <div className="chatBody">
            {messages.map((m, i) => (
              <div key={i} className={`chatMsg ${m.role}`}>
                <div className="chatBubble">{m.content}</div>
              </div>
            ))}
            {isTyping ? (
              <div className="chatMsg assistant">
                <div className="chatBubble typing">正在输入…</div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>
          <div className="chatComposer">
            <textarea
              className="chatInput"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="问我：这七周你最难的点是什么？"
            />
            <button className="primaryButton" type="button" onClick={onSend} disabled={isTyping}>
              发送
            </button>
          </div>
        </div>
      ) : null}

      <button className="chatFab" type="button" onClick={() => setOpen((v) => !v)} aria-label="打开聊天">
        {open ? "收起" : "聊天"}
      </button>
    </div>
  );
}

