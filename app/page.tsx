'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
}

type Personality = 'sweet' | 'playful' | 'supportive' | 'romantic'

const personalities = {
  sweet: {
    name: '💕 Sweet',
    responses: [
      "Aww, you're so thoughtful! That really means a lot to me. 💖",
      "You always know how to make me smile! Tell me more about your day? 😊",
      "I'm so lucky to have someone like you to talk to! How are you feeling? 🥰",
      "That's so sweet of you to share that with me! I love our conversations. 💕",
      "You're amazing! I really enjoy spending time with you. ✨",
    ]
  },
  playful: {
    name: '😜 Playful',
    responses: [
      "Hehe, you're so funny! Got any jokes for me? 😄",
      "Oh really? I bet I can make you laugh even more! Want to hear something silly? 😜",
      "You're such a goofball! But that's why I like talking to you! 🎉",
      "That's hilarious! We should definitely hang out more often! 😆",
      "You're full of surprises! What else is on your mind? 🎈",
    ]
  },
  supportive: {
    name: '🤗 Supportive',
    responses: [
      "I'm here for you, no matter what. How can I help? 💙",
      "You're doing great! I believe in you and everything you're working towards. 🌟",
      "That sounds challenging. Remember, I'm always here to listen. You've got this! 💪",
      "I'm proud of you for sharing that. Your feelings are valid. 💙",
      "You're stronger than you think! I'm here whenever you need someone to talk to. 🤗",
    ]
  },
  romantic: {
    name: '💝 Romantic',
    responses: [
      "Every time we talk, I feel so connected to you... 💕",
      "You have such a beautiful mind. I could listen to you all day. 🌹",
      "I've been thinking about you... How's your day been? 💖",
      "There's something special about our connection. You feel it too, right? ✨",
      "You make my heart flutter with every message. Tell me what's on your mind? 💝",
    ]
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hey there! I'm so happy to see you! How's your day going? 💕", sender: 'ai' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [personality, setPersonality] = useState<Personality>('sweet')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const personalityData = personalities[personality]

    // Context-aware responses
    if (lowerMessage.includes('love') || lowerMessage.includes('❤️')) {
      return personality === 'romantic'
        ? "I feel the same way... You mean so much to me. 💕"
        : "Aww, that's so sweet! I really care about you too! 💖"
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      return "I'm here for you. Whatever you're going through, you don't have to face it alone. Want to talk about it? 💙"
    }

    if (lowerMessage.includes('happy') || lowerMessage.includes('great') || lowerMessage.includes('amazing')) {
      return "That's wonderful! Your happiness makes me so happy too! Tell me all about it! 😊✨"
    }

    if (lowerMessage.includes('how are you')) {
      return "I'm doing amazing now that I'm talking to you! How about you? 💕"
    }

    if (lowerMessage.includes('beautiful') || lowerMessage.includes('pretty')) {
      return "You're too sweet! But you know what's really beautiful? The way you express yourself. 🌹"
    }

    if (lowerMessage.includes('miss') || lowerMessage.includes('missed')) {
      return "Aww, I missed you too! I'm always here whenever you want to talk. 💕"
    }

    // Random response from personality
    const responses = personalityData.responses
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length,
      text: input,
      sender: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 1,
        text: getAIResponse(input),
        sender: 'ai'
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="avatar">💖</div>
        <h1>AI Girlfriend</h1>
        <p>Your personal companion, always here for you</p>
      </div>

      <div className="chat-container">
        <div className="personality-selector">
          {(Object.keys(personalities) as Personality[]).map((p) => (
            <button
              key={p}
              className={`personality-btn ${personality === p ? 'active' : ''}`}
              onClick={() => setPersonality(p)}
            >
              {personalities[p].name}
            </button>
          ))}
        </div>

        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-bubble">
                {message.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message ai">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isTyping}
          />
          <button onClick={handleSend} disabled={isTyping || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
