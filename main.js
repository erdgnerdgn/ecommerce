const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

document.addEventListener("DOMContentLoaded", () => {
  // callback> icerisinde farkli fonksiyonlari calistirir;
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  fetch("https://api.escuelajs.co/api/v1/categories")
    // gelen veriyi işleme
    .then((res) => res.json())
    // işlenen veriyi foreach ile herbir obje için ekrana basma
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const { image, name } = category;
        // gelen herbir obje için div oluşturma
        const categoryDiv = document.createElement("div");
        // dive class ekleme
        categoryDiv.classList.add("category");
        // divin içeriğini değiştirme
        categoryDiv.innerHTML = `
            <img src="https://picsum.photos/200/300" />
            <span>${name}</span>
        `;
        // oluşan divi htmldeki listeye atma
        categoryList.appendChild(categoryDiv);
      })
    )
    .catch();
}

//Urunleri Cekme

function fetchProduct() {
  fetch("https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((item) => {
        //div olusturuyoruz
        const productDiv = document.createElement("div");
        //div'e class ekliyoruz
        productDiv.classList.add("product");
        //div in icerigini degistirme
        productDiv.innerHTML = `<img src="https://picsum.photos/640/640?r=4367" />
            <p>${item.title}</p>
            <p>${item.category.name}</p>
            <div class="product-action">
              <p>${item.price} £</p>
              <button onclick = "addToBasket({id: ${item.id}, title:'${item.title}', price:'${item.price}',img:'${item.images[0]}', amount:1})">Add to Basket</button>
            </div>`;
        //olusan urunu htmldeki listeye gonderme
        productList.appendChild(productDiv);
      })
    );
}
//Basket
let basket = [];
let total = 0;

//Add to Basket
function addToBasket(product) {
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);
  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}
// Open and Close

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  //sepetin icine urunlerin listelenmesi
  addList();
  //Toplam bilgisini guncelleme
  modalInfo.innerText = total;
});
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  //sepeti kapatinca icini temizleme
  modalList.innerHTML = " ";
  //toplam degerini sifirlama
  total = 0;
});
//sepete listeleme
function addList() {
  basket.forEach((product) => {
    //sepet dizisindeki her bir obje icin div olusturma
    const listItem = document.createElement("div");
    //dive class ekleme
    listItem.classList.add("list-item");
    //icerigini degistirme
    listItem.innerHTML = ` <img src="https://picsum.photos/640/640?r=4367" />
              <h2>${product.title}</h2>
              <h2 class= "price">${product.price} £</h2>
              <p>Amount: ${product.amount}</p>
              <button id="del" onclick="deleteItem({id:${product.id}, price:${product.price} , amount:${product.amount} })">Delete</button>`;
    //elemani html deki listeye gonderme
    modalList.appendChild(listItem);
    //toplam degsikenini guncelleme
    total += product.price * product.amount;
  });
}

function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  //silinen elemani total den cikarma
  total -= deletingItem.price * deletingItem.amount;
  modalInfo.innerText = total;
}
modalList.addEventListener("click", (e) => {
  if (e.target.id === "del") {
    e.target.parentElement.remove();
  }
});
//eger disari tiklanirsa kapatma
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
