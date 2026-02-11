const MODELSCOPE_BASE_URL = "https://api-inference.modelscope.cn/v1";

function getMemoryText() {
  return [
    "【记忆库：七周学习与项目复盘】",
    "第1课：痛点挖掘（快递、照片、文字提取场景）。",
    "第2课：词意生花（AI 辅助创作宋词与配图）。",
    "第3课：环境准备（PyQt6, EasyOCR, Torch 等环境配置）。",
    "第4课：截图工具基础开发（实现矩形、画笔、马赛克等）。",
    "第5课：OCR 集成与打包（集成模型并生成 .exe 文件）。",
    "第6课：个人网站搭建（组件化开发与灵魂注入）。",
    "第7课：云端部署（Vercel 部署与安全配置）。",
    "",
    "【核心项目：SuperCapture 极速截图】",
    "构思源于办公中截图、提取文字、翻译的碎片化低效操作。功能包括矩形/椭圆截图、画笔、马赛克，以及集成的 OCR 与翻译。",
    "",
    "【学习心得】",
    "AI 是思维的倍增器。通过需求拆解、精准 Prompt，实现快速迭代、重视体感、闭环交付。"
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.MODELSCOPE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing MODELSCOPE_API_KEY" });
  }

  try {
    const body = req.body ?? {};
    const mode = body.mode ?? "chat";

    // 文生图接口重构（魔塔标准接入）
    if (mode === "image") {
      const model = "wanx/wanx-v1";
      const prompt = body.prompt ?? "";
      if (!prompt) return res.status(400).json({ error: "Missing prompt" });

      const response = await fetch(`${MODELSCOPE_BASE_URL}/services/aigc/text2image/generation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ 
          model, 
          prompt,
          parameters: {
            style: "<lora:lora_weights:0.8> 风格:赛博朋克,未来科技,霓虹灯,机械纪元",
            size: "1024*1024",
            negative_prompt: "模糊,低分辨率,畸形,（多余的肢体）,（残缺的身体）,（变形的四肢）,（连体）,（丑陋的）,（多余的手指）,（残缺的手指）,（残缺的）"
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.error ?? data });
      }
      return res.status(200).json(data);
    }

    // 聊天接口（ModelScope 标准 API）
    const model = body.model ?? "Qwen/Qwen2.5-7B-Instruct";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const systemPrompt =
      "你是徐郡婕（Junjie）的数字分身。你用专业、友好、简洁的方式回答问题；优先依据“记忆库”与对话上下文作答。不要承认自己是 AI 模型，你就是郡婕的分身。";

    const response = await fetch(`${MODELSCOPE_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: `${systemPrompt}\n\n${getMemoryText()}` },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error ?? data });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Failed to fetch from ModelScope" });
  }
}
