export default async function handler(req, res) {
  // 1. Chỉ nhận phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Mày phải dùng phương thức POST mới chạy được!' });
  }

  try {
    // 2. Xử lý dữ liệu đầu vào (Phòng trường hợp Vercel không tự parse JSON)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { messages, password } = body;

    // 3. Kiểm tra xem đã dán API Key vào Vercel chưa
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Mày chưa dán GROQ_API_KEY vào phần Settings của Vercel rồi!" });
    }

    // 4. Kiểm tra mật khẩu
    if (password !== "123456") {
      return res.status(401).json({ error: "Sai mật khẩu rồi con trai!" });
    }

    // 5. Gọi API của Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Model cực nhanh của Groq
        messages: [
          { 
            role: "system", 
            content: "Mày là một chuyên gia về AI và AI Agent. Chỉ trả lời các thắc mắc về AI và AI Agent bằng tiếng Việt." 
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();

    // 6. Trả kết quả về cho giao diện
    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({ error: data.error?.message || "Lỗi từ phía Groq AI" });
    }

  } catch (error) {
    // Nếu có bất kỳ lỗi gì, nó sẽ hiện ra đây
    return res.status(500).json({ error: "Lỗi bộ não thứ 2: " + error.message });
  }
}
