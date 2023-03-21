const socket = io();

const productList = document.getElementById("productsList");
const deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const productId = document.getElementById("pid").value;
  fetch(`/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  })
});



socket.on("products", (products) => {
  let showProducts = "";
  products.forEach((prod) => {
    showProducts += `Product ${prod.code} is a ${prod.description} and its price is $${prod.price}</br>`;
  });
  productList.innerHTML = `${showProducts}`;
});
