export default class NotificationMessage {

    static lastNatification = null;

    constructor (message = '', { duration, type } = {}) {
      this.message = message;
      this.duration = duration;
      this.type = type;
      this.element = this.createElement();
    }

    show(elementForParent = null) {
      this.destroy();
      document.body.appendChild(this.element);
      NotificationMessage.lastNatification = this.element;

      if (elementForParent !== null) {
        elementForParent.appendChild(this.element);
        this.element = elementForParent;
      }
      this.element.hidden = false;
      setTimeout(()=>this.remove(), this.duration);
    }

    remove() {
      this.element.hidden = true;
      this.destroy();
    }

    createElement() {
      const element = document.createElement('div');
      element.innerHTML = this.createTemplate();
      if (NotificationMessage.lastNatification === null) {
        NotificationMessage.lastNatification = element;
      }
      return element.firstElementChild;
    }

    destroy() {
      if (NotificationMessage.lastNatification !== null) {
        let elements = document.querySelectorAll(`div`);
        for (let elem of elements) {
          elem.remove(); 
        }
        NotificationMessage.lastNatification.remove();
        NotificationMessage.lastNatification = null;
      }
    }

    createTemplate() {
      return `
         <div class="${this.getClassForNotification()}" style='--value:${this.duration}ms'> 
         <div class="timer"></div>
          <div class="inner-wrapper">
              <div class="notification-header">
                  Notification
              </div>
              <div class="notification-body">
                  ${this.message}
          </div>
          </div>`;
    }
  
    getClassForNotification() {
      if (this.type === "success") {
        return "notification success";
      } else if (this.type === "error") {
        return "notification error";
      } else {
        return 'notification';
      }
    }

}
