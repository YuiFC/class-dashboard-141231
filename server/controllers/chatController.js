// server/controllers/chatController.js
const axios = require('axios');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body; // 用户发来的消息内容

    if (!message) {
      return res.status(400).json({ message: '消息内容不能为空' });
    }

    // 构造发给 LLM 的请求体 (OpenAI 兼容格式)
    const requestBody = {
      model: process.env.LLM_MODEL_NAME,
      messages: [
        { role: 'system', content: '你是一个乐于助人的班级智能助手，可以回答同学关于学习、情感等方面的所有问题。' },
        { role: 'user', content: message }
      ],
      temperature: 0.7 // 创意程度 (0-1)
    };

    // 发送请求给 LLM 服务商
    const response = await axios.post(
      `${process.env.LLM_API_URL}/chat/completions`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LLM_API_KEY}`
        }
      }
    );

    // 获取 LLM 的回复内容
    const aiReply = response.data.choices[0].message.content;

    // 返回给前端
    res.status(200).json({ 
      reply: aiReply 
    });

  } catch (error) {
    console.error('LLM API 调用失败:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'AI 暂时掉线了，请稍后再试' });
  }
};