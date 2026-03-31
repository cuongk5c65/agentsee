module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Vercel tự parse JSON cho Node.js
  const { messages, password } = req.body;

  // 1. Kiểm tra mật khẩu
  if (password !== "123456") {
    return res.status(401).json({ error: "Sai mật khẩu!" });
  }

  // 2. Kiểm tra Key bí mật
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Thiếu GROQ_API_KEY trên Vercel!" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Mày là một chuyên gia về AI và AI Agent. Trả lời bằng tiếng Việt." },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
