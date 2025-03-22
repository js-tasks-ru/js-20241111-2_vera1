import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';


export default class ProductForm {

  element;
  subElements = {};
  productForm = {};
  dataCategories = [];

  constructor (productId) {
    this.productId = productId;
    this.element = this.createElement(this.createTemplate());
    this.getSubElements();
  }

  async render() {
    try {

      const urlCategories = new URL("/api/rest/categories", BACKEND_URL);
      urlCategories.searchParams.set('_sort', 'weight');
      urlCategories.searchParams.set('_refs', 'subcategory');
      const dataCategories = await fetchJson(urlCategories);

      const urlProduct = new URL("/api/rest/products", BACKEND_URL);
      urlProduct.searchParams.set('id', this.productId);
      const data = await fetchJson(urlProduct);


      // if (data && Object.values(data).length && dataCategories && Object.values(dataCategories).length) {

      const {
        title,
        description,
        quantity,
        subcategory,
        status,
        price,
        discount,
        images
      } = data[0];

      let {productForm, imageListContainer} = this.subElements;

      productForm.querySelector(`[name="title"]`).value = title; //escapeHtml(String(title)); из-за тестов "10.1&quot; 
      productForm.querySelector(`[name="description"]`).innerHTML = escapeHtml(String(description));
      productForm.querySelector(`[name="price"]`).value = escapeHtml(String(price));
      productForm.querySelector(`[name="quantity"]`).value = escapeHtml(String(quantity));
      productForm.querySelector(`[name="status"]`).value = escapeHtml(String(status));
      productForm.querySelector(`[name="discount"]`).value = escapeHtml(String(discount));

      let elementSelectSubcategory = productForm.querySelector('#subcategory');

      const mapNamesCategories = new Map();

      const dataCategoriesArray = Object.values(dataCategories);
              
      for (const category of dataCategoriesArray) {
        for (const subcategory of category.subcategories) {
          mapNamesCategories.set(escapeHtml(String(subcategory.id)), `${escapeHtml(String(category.title))} > ${escapeHtml(String(subcategory.title))}`);
        }
      }//Здесь берётся из сервера из dataCategories и экранируется, а далее уже проверенные все идут значения

      for (let categoryKey of mapNamesCategories.keys()) {
        let option = document.createElement('option');
        option.value = categoryKey;
        option.innerHTML = mapNamesCategories.get(categoryKey);
        if (categoryKey === subcategory) {
          option.selected = true;
        }
        elementSelectSubcategory.appendChild(option);
      }

      let elementSortableList = imageListContainer.querySelector(`[class="sortable-list"]`);
      for (const image of images) {
        const {source, url} = image;
        const elementLi = this.createElementLi(escapeHtml(String(source)), escapeHtml(String(url)));
        elementSortableList.appendChild(elementLi);
      }
      // }

      productForm.addEventListener('submit', this.handleSubmit);

      return this.element;
    } catch (err) {
      console.log(err);
    }
  }

  createElementLi(source, url) {
    const elementLi = document.createElement('li');
    elementLi.className = 'products-edit__imagelist-item sortable-list__item';
    elementLi.innerHTML = this.createTemplateElementLi(source, url);
    return elementLi;
  }

  createTemplateElementLi(source, url) {
    return `<input type="hidden" name="url" value=${url}>
          <input type="hidden" name="source" value="${source}">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${url}">
        <span>${source}</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>`;
  }

  getSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
    <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
        <ul class="sortable-list">
          
          </ul></div>
        <button type="button" name="uploadImage" class="button-primary-outline">
            <span>Загрузить</span>
        </button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id="subcategory" class="form-control" name="subcategory">
          
          
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select id="status" class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `;
  }

  
  async save() {
    const {productForm } = this.subElements;
    const url = new URL("/api/rest/products", BACKEND_URL);//https://course-js.javascript.ru/api/rest/products
    try {
      const response = await fetchJson(url, {
        method: 'PATCH',
        body: new FormData(productForm)
      });

      // const result = await response.json();

      //Генерируем событие - запускаем событие - своё
      this.element.dispatchEvent(new CustomEvent('product-updated', {
        detail: { name: "CustomEvent - product-updated" }
      }));

    } catch (err) {
      console.log(err);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.save();
  }



  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
