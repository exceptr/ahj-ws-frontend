import Chat from "./Chat";

const chat = new Chat(document.querySelector('.user-panel-list'), 'ws://localhost:7070/ws');

// const chat = new Chat(document.querySelector('.user-panel-list'), 'ws://ahj-ws-backend-mm9f.onrender.com/ws');
chat.init();