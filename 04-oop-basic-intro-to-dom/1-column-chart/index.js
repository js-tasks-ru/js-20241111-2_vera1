export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = ''
  }) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    console.log(this.formatHeading);
    this.element = this.createElement(this.getTemplate());
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  getFormatHeading(value) {
    return this.formatHeading !== '' ? this.formatHeading(value) : value;
  }

  getTemplate() {
    return `<div class="column-chart" style="--chart-height: 50">
              <div class="column-chart__title">
                  ${this.label}
                  ${this.getLink()}
              </div>
              <div class="column-chart__container">
                   ${this.getTemplateContainer(this.data)}
            </div>`;
  }

  getTemplateContainer(arr) {
    if (arr.length === 0) {
      return `<img src="charts-skeleton.svg" />`;
    } else {
      return `<div class="column-chart__header">
                    ${this.getFormatHeading(this.value)}
              </div>
              <div data-element="body" class="column-chart__chart">
                  ${this.getColumnBody(this.data)}
              </div`;
    }
  }

  getColumnBody(arr) {
    if (arr.length === 0) {
      return `<img src="charts-skeleton.svg" />`;
    }

    let result = '';

    for (let i = 0; i < arr.length; i++) {
      result += `<div style="--value: ${arr[i]}" ></div>`;
    }

    return result;
  }

  createElement(template) {
    const element = document.createElement(`div`);
    element.innerHTML = template;
    return element.firstElementChild;
  }

  myFunction() {
    //console.log(this.label);
  }

}
