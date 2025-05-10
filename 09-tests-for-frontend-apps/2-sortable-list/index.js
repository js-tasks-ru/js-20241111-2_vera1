export default class SortableList {

  element;
  draggingElement;
  placeHolderElement;

  constructor({items} = {}) {
    this.items = items;
    
    this.render();
    this.initEventListeners();
  }

  render() {

    this.element = document.createElement('ul');
    this.element.className = 'sortable-list';
    
    for (let item of this.items) {
      item.className = 'sortable-list__item';
      this.element.append(item);
    }
  }

  handlePointerDown = (event) => {

    const itemElement = event.target.closest('.sortable-list__item');
    this.draggingElement = itemElement;

    if (itemElement) {
     
      if (event.target.closest('[data-delete-handle]')) {
        event.preventDefault();
        itemElement.remove();
      }
          
      if (event.target.closest('[data-grab-handle]')) {
        event.preventDefault();

        this.shiftX = event.clientX - itemElement.getBoundingClientRect().left;
        this.shiftY = event.clientY - itemElement.getBoundingClientRect().top;

        this.placeHolderElement = document.createElement('div');
        this.placeHolderElement.className = "sortable-list__placeholder";
        itemElement.style.width = itemElement.offsetWidth + "px";
        itemElement.style.height = itemElement.offsetHeight + "px";
        this.placeHolderElement.style.width = itemElement.style.width;
        this.placeHolderElement.style.height = itemElement.style.height;
    
        itemElement.classList.add("sortable-list__item_dragging");
        itemElement.after(this.placeHolderElement);
    
        this.element.append(itemElement);
    
        this.moveElementAt(event.pageX, event.pageY);
    
        document.addEventListener('pointermove', this.handlePointerMove);

      }
    }
  }

  moveElementAt(pageX, pageY) {
    this.draggingElement.style.left = pageX - this.shiftX + 'px';
    this.draggingElement.style.top = pageY - this.shiftY + 'px';
  }  

  handlePointerMove = (event) => {

    this.moveElementAt(event.pageX, event.pageY);

    const items = this.element.children;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      if (item === this.draggingElement) {
        return;
      }

      const { top, bottom, height} = item.getBoundingClientRect();

      if (event.clientY > top && event.clientY < bottom) {
        if (event.clientY < top + height / 2) {
          this.movePlaceHolderAt(i);
        } else {
          this.movePlaceHolderAt(i + 1);
        }
        
        break;
      }
    }
  }

  movePlaceHolderAt(index) {
    if (this.element.children[index] !== this.placeHolderElement) {
      this.element.insertBefore(this.placeHolderElement, this.element.children[index]);
    }
  }

  handlePointerUp = (event) => {

    document.removeEventListener('pointermove', this.handlePointerMove);

    this.placeHolderElement.replaceWith(this.draggingElement);
   
    this.draggingElement.classList.remove("sortable-list__item_dragging");
    this.draggingElement.style.left = "";
    this.draggingElement.style.top = "";
    this.draggingElement.style.width = "";
    this.draggingElement.style.height = "";

  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.handlePointerDown);
    document.addEventListener('pointerup', this.handlePointerUp);
  }

  remove() {
    document.removeEventListener('pointerdown', this.handlePointerDown);
    document.removeEventListener('pointerup', this.handlePointerUp);
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
