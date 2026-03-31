module.exports = async (req, res) => {
  try {
    // Vercel tự parse body cho chúng ta
    const { messages, password } = req.body;

    if (password !== "123456") {
      return res.status(401).json({ error: "Sai mật khẩu!" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Thiếu API Key trên Vercel!" });
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
          { role: "system", content: "Bạn là trợ lý của MR CƯỜNG. Hãy trả lời chuyên sâu về AI Agent bằng tiếng Việt." },
          ...messages
        ]
      }),
    });

    const data = await response.json();
    
    // Gửi thẳng cái data này về cho Frontend
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Lỗi Server: " + error.message });
  }
};
