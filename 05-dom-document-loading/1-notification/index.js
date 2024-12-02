export default class NotificationMessage {

    static lastNatification = null;

    constructor (message = '', { duration, type } = {}) {
      this.message = message;
      this.duration = duration;
      this.type = type;
      this.element = this.createElement();
    }

    // show(elementForParent = null) {
    //   this.destroy();
    //   document.body.appendChild(this.element);
    //   NotificationMessage.lastNatification = this.element;

    //   if (elementForParent !== null) {
    //     elementForParent.appendChild(this.element);
    //     this.element = elementForParent;
    //   }
    //   this.element.hidden = false;
    //   this.timerId = setTimeoutsetTimeout(()=>this.remove(), this.duration);
    // }

    show(elementForParent = document.body) {
      if (NotificationMessage.lastNatification) {
        NotificationMessage.lastNatification.destroy();
      }
      NotificationMessage.lastNatification = this;
      elementForParent.appendChild(this.element);
      this.timerId = setTimeout(()=>this.remove(), this.duration);
   }

    remove() {
      this.element.remove();
    }

    destroy() {
      clearTimeout(this.timerId);
      this.remove();
    }

    
    createElement() {
      const element = document.createElement('div');
      element.innerHTML = this.createTemplate();
      if (NotificationMessage.lastNatification === null) {
        NotificationMessage.lastNatification = element;
      }
      return element.firstElementChild;
    }

    createTemplate() {
      return `
         <div class="notification ${this.type}" style='--value:${this.duration}ms'> 
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
}
