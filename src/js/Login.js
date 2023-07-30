export default class Login {
  constructor(parantEl, url) {
    this.parentEl = parantEl;
    this.url = url;
    this.choiceNicknameContainer = document.querySelector(
      ".choice-nickname-container"
    );
    this.choiceNicknameError = document.querySelector(".choice-nickname-error");
    this.choiceNicknameTextarea = document.querySelector(
      ".choice-nickname-textarea"
    );
    this.btnOk = document.querySelector(".btn-ok-choice-nickname-container");
    this.userPanelList = document.querySelector(".user-panel-list");
    this.chatWindowContainer = document.querySelector(".chat-window-container");
    this.login = this.login.bind(this);
  }

  init() {
    this.btnOk.addEventListener("click", this.login);
    this.choiceNicknameTextarea.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        this.login();
      }
    });
  }

  login(event) {
    event.preventDefault();
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener("open", () => {
      const data = JSON.stringify({
        event: "login",
        message: this.choiceNicknameTextarea.value,
      });
      this.ws.send(data);
      this.choiceNicknameContainer.classList.add("hidden");
      this.userPanelList.classList.remove("hidden");
      this.chatWindowContainer.classList.remove("hidden");
      this.choiceNicknameError.style.opacity = 0;
    });

    this.ws.addEventListener("message", (e) => {
      const request = JSON.parse(e.data);
      console.log(request);

      if (request.event === "connect") {
        this.userList = request.message;
        this.userPanelList.dispatchEvent(new Event("connect"));
      }
    });

    this.ws.addEventListener("close", (e) => {
      console.log(e.code);
      if (e.code === 1000) {
        this.choiceNicknameContainer.classList.remove("hidden");
        this.userPanelList.classList.add("hidden");
        this.chatWindowContainer.classList.add("hidden");
        this.choiceNicknameError.style.opacity = 1;
      }
    });
  }
}
