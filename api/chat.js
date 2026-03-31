export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const body = JSON.parse(req.body);
  const { messages, password } = body;

  // KIỂM TRA MẬT KHẨU (Xác thực người dùng)
  if (password !== "123456") {
    return res.status(401).json({ error: "Sai mật khẩu!" });
  }

  // GỌI AI GROQ (Bảo mật API Key nằm ở biến môi trường)
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Bạn là chuyên gia về AI và AI Agent. Chỉ trả lời các câu hỏi về AI." },
        ...messages
      ],
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
