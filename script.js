const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    messageDiv.innerHTML = `
        <div class="msg-content">${content}</div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing-wrapper');
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="typing-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTyping() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    showTyping();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        removeTyping();

        if (data.reply) {
            addMessage(data.reply, 'bot'); // Parsed markdown support could be added here
        } else if (data.error) {
            addMessage(`⚠️ Error: ${data.error}`, 'bot');
        }

    } catch (error) {
        removeTyping();
        addMessage("⚠️ Gagal terhubung ke server. Pastikan server nyala!", 'bot');
        console.error('Error:', error);
    }
});
