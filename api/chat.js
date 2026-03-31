module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages, password } = req.body;

  // KIỂM TRA MẬT KHẨU Ở SERVER (Bảo mật tuyệt đối cho bài tập)
  if (password !== "123456") {
    return res.status(401).json({ error: "Xác thực không hợp lệ! Mật khẩu sai ở Backend." });
  }

  // KIỂM TRA API KEY (Bảo mật cho ví tiền của mày)
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Chưa cấu hình API Key trên Vercel." });
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
            content: "Bạn là trợ lý chuyên gia của MR CƯỜNG. Chỉ trả lời các vấn đề liên quan đến AI và AI Agent bằng tiếng Việt một cách chuyên nghiệp." 
          },
          ...messages
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
