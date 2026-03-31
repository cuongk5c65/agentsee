module.exports = async (req, res) => {
  try {
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
        // ĐÃ CẬP NHẬT MODEL MỚI NHẤT (Llama 3.3 70B)
        model: "llama-3.3-70b-versatile", 
        messages: [
          { 
            role: "system", 
            content: "Mày là trợ lý chuyên gia AI của MR CƯỜNG. Hãy trả lời súc tích, thông minh bằng tiếng Việt về chủ đề AI và AI Agent." 
          },
          ...messages
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || JSON.stringify(data);
      return res.status(response.status).json({ error: errorMsg });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Lỗi kết nối AI: " + error.message });
  }
};
