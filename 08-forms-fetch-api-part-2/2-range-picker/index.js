export default class RangePicker {

  element;
  selected;
  subElements = {};
  tempDate = new Date();
  flagCellSelected = false;

  constructor({
    from = new Date(),
    to = new Date()
  } = {}) {

    this.selected = {from, to};

    this.tempDate = new Date(to);

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.createElementTemplate();
    this.element = element.firstElementChild;

    this.selectSubElements();

    this.initEventListeners();
  }

  createElementTemplate() {
    const from = this.formatDate(this.selected.from);
    const to = this.formatDate(this.selected.to);

    return `<div class="rangepicker">
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${from}</span> -
        <span data-element="to">${to}</span>
      </div>
      <div class="rangepicker__selector" data-element="selector"></div>
    </div>`;
  }

  initEventListeners() {
    const {input, selector} = this.subElements;
    input.addEventListener('click', this.handleClickInput);
    selector.addEventListener('click', this.handleClickSelector);
    document.addEventListener('click', this.handleClickDocument, {capture: true });

  }

  handleClickDocument = (event) => {

    const targetElement = event.target.dataset.element;
    const target = event.target.closest('button') || event.target.closest('span');

    if (targetElement !== 'input' && targetElement !== 'selector' && target === null) {
      this.сloseCalender();
    }
  }

  handleClickSelector = (event) => {

    const cellElement = event.target.closest('.rangepicker__cell');
    if (cellElement) {
      const newSelectedDate = new Date(cellElement.dataset.value);

      if (!this.flagCellSelected) {
        this.selected.from = newSelectedDate;
        this.selected.to = newSelectedDate;
        this.flagCellSelected = true;
      } else {
        if (newSelectedDate > this.selected.from) {
          this.selected.to = newSelectedDate;
        } else if (newSelectedDate < this.selected.from) {
          this.selected.to = this.selected.from;
          this.selected.from = newSelectedDate;
        } else if (newSelectedDate === this.selected.from) {
          this.selected.to = newSelectedDate;
          this.selected.from = newSelectedDate;
        }
        this.сloseCalender();
        this.flagCellSelected = false;
      }

      this.renderHighlightCell();
    } 
  }

  сloseCalender() {
    this.element.classList.remove('rangepicker_open');

    const from = this.formatDate(this.selected.from);
    const to = this.formatDate(this.selected.to);
    
    this.subElements.from.innerHTML = from;
    this.subElements.to.innerHTML = to;

    this.element.dispatchEvent(new CustomEvent('date-select', {bubbles: true, detail: this.selected}));
  }

  handleClickInput = (event) =>{

    this.element.classList.toggle('rangepicker_open');

    this.renderElementRangePickerSelector();
  }

  renderElementRangePickerSelector () {
    const selectorElement = this.subElements.selector;
    selectorElement.innerHTML = this.createElementRangePickerSelectorTemplate();

    this.addEventListenerClickNavigation();
    this.renderHighlightCell();
  }

  addEventListenerClickNavigation() {
    const elementRghtNavigation = this.element.querySelector('.rangepicker__selector-control-right');
    const elementLeftNavigation = this.element.querySelector('.rangepicker__selector-control-left');

    elementRghtNavigation.addEventListener('click', this.handleClicRghtkNavigation);
    elementLeftNavigation.addEventListener('click', this.handleClicLeftkNavigation);
  }

  handleClicRghtkNavigation = (event) => {
    this.tempDate.setMonth(this.tempDate.getMonth() + 1);
    this.renderElementRangePickerSelector();
  }

  handleClicLeftkNavigation = (event) => {
    this.tempDate.setMonth(this.tempDate.getMonth() - 1);
    this.renderElementRangePickerSelector();
  }

  renderHighlightCell() {

    const {from, to} = this.selected;

    for (const cell of this.element.querySelectorAll('.rangepicker__cell')) {
      const { value } = cell.dataset;
      const cellDate = new Date(value);

      cell.classList.remove('rangepicker__selected-from');
      cell.classList.remove('rangepicker__selected-between');
      cell.classList.remove('rangepicker__selected-to');
      
      if (cellDate.getTime() === to.getTime()) {
        cell.classList.add("rangepicker__selected-to");
      } else 
      
      if (cellDate.getTime() === from.getTime()) {
        cell.classList.add("rangepicker__selected-from");
      } else

      if ((cellDate.getTime() < to && cellDate.getTime() > from)) {
        cell.classList.add("rangepicker__selected-between");
      }
    }
  }

  createElementRangePickerSelectorTemplate() {
    const dispalayDateTo = new Date(this.tempDate);
    const dispalayDateFrom = new Date(this.tempDate);
    dispalayDateFrom.setMonth(dispalayDateTo.getMonth() - 1);

    return `<div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
       ${this.createElementCalendarTemplate(dispalayDateFrom)}
       ${this.createElementCalendarTemplate(dispalayDateTo)}`;
  }

  getLastDayOfMonth(year, month) {
    let lastDate = new Date(year, month + 1, 0);
    return lastDate.getDate();
  }

  createElementCalendarTemplate(date) {
    
    const month = date.toLocaleString('ru', { month: 'long'});

    return `<div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${month}">${month}</time>
        </div>
        <div class="rangepicker__day-of-week">
          ${this.createTemplateDaysOfWeek()}
        </div>
        <div class="rangepicker__date-grid">
          ${this.createTemplateDateOfGrid(date)}
        </div>
      </div>`;
  }

  createTemplateDaysOfWeek() {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return days.map(day => `<div>${day}</div>`).join('');
  }


  createTemplateDateOfGrid(date) {

    const countDaysMonth = this.getLastDayOfMonth(date.getFullYear(), date.getMonth());

    let i = 1;
    let strDateOfGrid = '';

    date.setDate(1);

    strDateOfGrid = `<button type="button" class="rangepicker__cell" data-value="${date.toISOString()}" style="--start-from: ${this.getStartIndexDay(date.getDay())}">${i}</button>`;
    i++;

    while (i <= countDaysMonth) {
      date.setDate(date.getDate() + 1);
      strDateOfGrid += `<button type="button" class="rangepicker__cell" data-value="${date.toISOString()}">${i}</button>`;
      i++;
    }

    return strDateOfGrid;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  formatDate(date) {
    return date.toLocaleString('ru', {dateStyle: 'short'});
  }

  getStartIndexDay (day) {
    const index = day === 0 ? 6 : (day - 1);
    return index + 1;
  }

  destroyListners() {
    const {input, selector} = this.subElements;
    input.removeEventListener('click', this.handleClickInput);
    selector.removeEventListener('click', this.handleClickSelector);
    document.removeEventListener('click', this.handleClickDocument, {capture: true});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyListners();
    this.remove();
  }

}

