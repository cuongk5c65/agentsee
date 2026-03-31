module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages, password } = req.body;

  // 1. Kiểm tra xác thực (Bảo mật cho bài tập)
  if (password !== "123456") {
    return res.status(401).json({ error: "Xác thực không hợp lệ. Hãy đăng nhập lại." });
  }

  // 2. Kiểm tra API Key (Bảo mật API của mày)
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Lỗi Server: Chưa cấu hình GROQ_API_KEY." });
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
          { 
            role: "system", 
            content: "Mày là một chuyên gia cao cấp về AI và AI Agent. Chỉ trả lời các câu hỏi về AI bằng tiếng Việt, súc tích, chuyên sâu. Nếu câu hỏi không liên quan đến AI, hãy từ chối lịch sự." 
          },
          ...messages
        ],
        temperature: 0.6,
        max_tokens: 1024
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Hệ thống gặp sự cố: " + error.message });
  }
};
