export default class DoubleSlider {
    element;
    subElements = {};
    min;
    max;

    constructor({
      min = 100,
      max = 200,
      formatValue = value => '$' + value,
      selected = {}, 
    } = {}) {
      this.min = min ? min : 100;
      this.max = max ? max : 200;

      this.formatValue = formatValue;

      this.from = selected.from ? selected.from : min;
      this.to = selected.to ? selected.to : max;

      this.element = this.createElement(this.createTemplate());

      this.selectSubElements();
      this.createEventListneres();
    }

    createElement(template) {
      const element = document.createElement(`div`);
      element.innerHTML = template;
      return element.firstElementChild;
    }

    createTemplate() {

      const leftSlider = this.getLeftPercent();
      const rightSlider = this.getRightPercent();

      return `<div class="range-slider">
         <span data-element="from">${this.formatValue(this.from)}</span>
        <div data-element="container" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${leftSlider}%; right: ${rightSlider}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftSlider}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightSlider}%"></span>
        </div>
         <span data-element="to">${this.formatValue(this.to)}</span>
     </div>`;
    }

    getLeftPercent() {
      const total = this.max - this.min;
      const value = this.from - this.min;

      return Math.round(value / total * 100);
    }

    getRightPercent() {
      const total = this.max - this.min;
      const value = this.max - this.to;

      return Math.round(value / total * 100);
    }

    processPointerMove = (event) => {
      const {left, width} = this.subElements.container.getBoundingClientRect();

      const containerLeftX = left;
      const containerRightX = left + width; 
      const pointerX = event.clientX;

      const normalizedPointerX = Math.min(containerRightX, Math.max(left, pointerX));

      const percentPointerX = Math.round((normalizedPointerX - containerLeftX) / (containerRightX - containerLeftX) * 100);

      return this.min + (this.max - this.min) * percentPointerX / 100;
    }

    createEventListneres() {
      this.subElements.thumbLeft.addEventListener('pointerdown', this.handleThumbPointerDown);
      this.subElements.thumbRight.addEventListener('pointerdown', this.handleThumbPointerDown);

    }

    handleThumbPointerDown = (event) => {

      this.activeThumb = event.target.dataset.element;

      document.addEventListener('pointermove', this.handleDocumentPointerMove);
      document.addEventListener('pointerup', this.handleDocumentPointerUp);
    }

    handleDocumentPointerMove = (event) => {

      if (this.activeThumb === "thumbLeft") {
        this.from = Math.min(this.to, this.processPointerMove(event));

        this.subElements.from.textContent = this.formatValue(this.from);
        this.subElements.progress.style.left = this.getLeftPercent() + '%';
        this.subElements.thumbLeft.style.left = this.getLeftPercent() + '%';
      }

      if (this.activeThumb === "thumbRight") {
        this.to = Math.max(this.from, this.processPointerMove(event));

        this.subElements.to.textContent = this.formatValue(this.to);
        this.subElements.progress.style.right = this.getRightPercent() + '%';
        this.subElements.thumbRight.style.right = this.getRightPercent() + '%';
      }
    }

    handleDocumentPointerUp = (event) => {
      this.activeThumb = null;

      this.dispatchCustomEvent();

      document.removeEventListener('pointermove', this.handleDocumentPointerMove);
      document.removeEventListener('pointerup', this.handleDocumentPointerUp);
    }

    dispatchCustomEvent() {
      const event = new CustomEvent('range-select', {
        detail: {
          from: this.from,
          to: this.to
        }
      });

      this.element.dispatchEvent(event);
    }

    destroyEventListneres() {
      this.subElements.thumbLeft.removeEventListener('pointerdown', this.handleThumbPointerDown);
      this.subElements.thumbRight.removeEventListener('pointerdown', this.handleThumbPointerDown);

    }

    selectSubElements() {
      this.element.querySelectorAll('[data-element]').forEach(element => {
        this.subElements[element.dataset.element] = element;
      });
    }
      
    remove() {
      this.element.remove();
    }

    destroy() {
      this.destroyEventListneres();
      this.remove();
    }
}
