export default async function handler(req, res) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, password } = req.body;

  // 1. Kiểm tra mật khẩu (Xác thực người dùng)
  if (password !== "123456") {
    return res.status(401).json({ error: "Xác thực thất bại! Sai mật khẩu." });
  }

  try {
    // 2. Gọi API Groq (Bảo mật: API Key lấy từ biến môi trường Vercel)
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
            content: "Bạn là chuyên gia về AI và AI Agent. Chỉ trả lời các câu hỏi liên quan đến AI và AI Agent. Trả lời bằng tiếng Việt lịch sự." 
          },
          ...messages
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error.message || "Lỗi từ phía AI" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
  }
}
