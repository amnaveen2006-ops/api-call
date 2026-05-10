document.addEventListener("DOMContentLoaded", function () {

  let productList = document.getElementById("productList");
  let form = document.getElementById("productForm");
  let titleInput = document.getElementById("title");
  let priceInput = document.getElementById("price");
  let imageInput = document.getElementById("image");
  let searchInput = document.getElementById("searchInput");
  let loader = document.getElementById("loader");
  let submitBtn = document.getElementById("submitBtn");

  let allProducts = [];
  let editId = null;

  // ================= LOAD PRODUCTS =================
  async function getProducts() {
    try {
      loader.style.display = "block";

      let response = await fetch("https://fakestoreapi.com/products");
      let data = await response.json();

      allProducts = data;

      displayProducts(allProducts);

      loader.style.display = "none";
    } catch (error) {
      loader.innerText = "Error loading data";
    }
  }

  // ================= DISPLAY PRODUCTS =================
  function displayProducts(products) {
    productList.innerHTML = "";

    products.forEach(function (item) {
      productList.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm">
            <img src="${item.image}" class="card-img-top">

            <div class="card-body d-flex flex-column">
              <h6 class="card-title">${item.title}</h6>
              <p class="fw-bold">₹ ${item.price}</p>

              <div class="mt-auto d-flex gap-2">
                <button onclick="editProduct(${item.id})" class="btn btn-warning btn-sm w-50">Edit</button>
                <button onclick="deleteProduct(${item.id})" class="btn btn-danger btn-sm w-50">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }

  // ================= ADD / UPDATE =================
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let title = titleInput.value;
    let price = priceInput.value;
    let image = imageInput.value;

    if (title == "" || price == "" || image == "") {
      alert("Please fill all fields");
      return;
    }

    // ===== UPDATE =====
    if (editId != null) {

      await fetch(`https://fakestoreapi.com/products/${editId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: title,
          price: price,
          image: image
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      let updatedList = [];

      allProducts.forEach(function (item) {
        if (item.id == editId) {
          item.title = title;
          item.price = price;
          item.image = image;
        }
        updatedList.push(item);
      });

      allProducts = updatedList;

      editId = null;
      submitBtn.innerText = "Add Product";

    } else {
      // ===== ADD =====
      let response = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          price: price,
          image: image
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      let data = await response.json();

      allProducts.push(data);
    }

    displayProducts(allProducts);
    form.reset();
  });

  // ================= EDIT =================
  window.editProduct = function (id) {

    let selected = null;

    allProducts.forEach(function (item) {
      if (item.id == id) {
        selected = item;
      }
    });

    titleInput.value = selected.title;
    priceInput.value = selected.price;
    imageInput.value = selected.image;

    editId = id;
    submitBtn.innerText = "Update Product";
  };

  // ================= DELETE =================
  window.deleteProduct = async function (id) {

    await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE"
    });

    let newList = [];

    allProducts.forEach(function (item) {
      if (item.id != id) {
        newList.push(item);
      }
    });

    allProducts = newList;

    displayProducts(allProducts);
  };

  // ================= SEARCH =================
  searchInput.addEventListener("input", function () {
    let text = searchInput.value.toLowerCase();

    let filtered = [];

    allProducts.forEach(function (item) {
      if (item.title.toLowerCase().includes(text)) {
        filtered.push(item);
      }
    });

    displayProducts(filtered);
  });

  // ================= INITIAL LOAD =================
  getProducts();

});


