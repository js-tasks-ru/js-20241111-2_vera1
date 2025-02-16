import fetchJson from './utils/fetch-json.js';
import ColumnChart1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChart1 {

  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    formatHeading = value => value
  } = {}) {
    super({label, link, formatHeading});
    this.url = url;
    const {from, to} = range;
    this.fetchData(from, to);
  }

  createUrl(from, to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);
    return url.toString();
  }

  fetchData(from, to) {
    fetch(this.createUrl(from, to))
      .then(response => response.json())
      .then(data => {
        this.data = Object.values(data);
        this.sumOfValuesData(this.data);
        console.log(this.element.parentElement);// Здесь есть 
        this.element.parentElement.innerHTML = this.createTemplate();

        console.log(this.element.parentElement);// А здесь ужк null - потому в тестах ошибка
      })
      .catch(err => console.log(err));
  }

  async update(from, to) {
    try {
      const url = this.createUrl(from, to);
      const response = await fetchJson(url);
      this.data = Object.values(response);

      this.element.getElementsByClassName('dashboard__chart_orders').parentElement.innerHTML = this.createTemplate();
     
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  sumOfValuesData(data) {
    let sumValues = 0;
    for (const value of data) {
      sumValues = sumValues + value;
    }
    this.value = sumValues;
  }
  
}
