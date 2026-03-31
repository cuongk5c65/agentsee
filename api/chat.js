module.exports = async (req, res) => {
  try {
    const { messages, password } = req.body;

    if (password !== "123456") {
      return res.status(401).json({ error: "Sai mật khẩu!" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Mày chưa dán API Key vào Vercel!" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Mày là trợ lý của MR CƯỜNG. Trả lời súc tích bằng tiếng Việt." },
          ...messages
        ]
      }),
    });

    const data = await response.json();

    // NẾU AI BÁO LỖI, TRẢ VỀ CÂU CHỬI CỦA NÓ LUÔN ĐỂ BIẾT ĐƯỜNG SỬA
    if (!response.ok) {
      const errorMsg = data.error?.message || JSON.stringify(data);
      return res.status(response.status).json({ error: errorMsg });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
