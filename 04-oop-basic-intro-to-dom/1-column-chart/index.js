export default class ColumnChart {

  element;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = value => value
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
  
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement(`div`);
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `    
    <div class="${this.creatChartClasses()}" style="--chart-height: 50">
      <div class="column-chart__title">
        ${this.label}
        ${this.createLinkElement()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
               ${this.createChartColumnTemplate()}
        </div>
      </div>
    </div>
  </div>`;
  }

  createChartColumnTemplate() {
    return this.getColumnProps().map(({value, percent})=> (`<div style="--value: ${value}" data-tooltip="${percent}"></div>`)).join('');
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;
  
    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
 
  createLinkElement() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  creatChartClasses() {
    return this.data.length ? 'column-chart' : 'column-chart column-chart_loading';
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(newData) {
    this.data = newData;
    this.element.querySelector(`[data-element="body"]`).innerHTML = this.createChartColumnTemplate();
  }
}  