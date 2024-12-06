document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");
  const productForm = document.getElementById("product-form");
  const productList = document.getElementById("product-list");

  let editIndex = null; // Засах үед индекс хадгалах

  // Navigation functionality
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      sections.forEach((section) => {
        section.classList.add("hidden");
        if (section.id === targetId) {
          section.classList.remove("hidden");
        }
      });

      if (targetId === "home") {
        displayProducts();
      }
      if (targetId === "cart") {
        displayCart();
      }
    });
  });

  // Form submission
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const introduction = document.getElementById("introduction").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    const product = { title, introduction, price, image };

    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];

    if (editIndex !== null) {
      // Засах үед бүтээгдэхүүнийг шинэчлэх
      existingProducts[editIndex] = product;
      editIndex = null; // Засах төлвийг цэвэрлэх
    } else {
      // Шинэ бүтээгдэхүүн нэмэх
      existingProducts.push(product);
    }

    localStorage.setItem("products", JSON.stringify(existingProducts));
    productForm.reset();
    alert("Бүтээгдэхүүн амжилттай хадгалагдлаа!");
    displayProducts(); // Бүтээгдэхүүн жагсаалтыг шинэчлэх
  });

  // Display products
  function displayProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = '<p class="text-gray-500">Одоогоор нэмэгдсэн бүтээгдэхүүн байхгүй байна.</p>';

      return;
    }

    products.forEach((product, index) => {
      const productCard = document.createElement("div");
      productCard.className =
        "bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 hover:shadow-lg";

      productCard.innerHTML = `
            <img
              src="${product.image}"
              alt="${product.title}"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h2 class="text-xl font-semibold text-gray-800 truncate">
                ${product.title}
              </h2>
              <p class="text-sm text-gray-600 mt-2 line-clamp-2">
                ${product.introduction}
              </p>
              <div class="flex justify-between items-center mt-4">
                <span class="text-lg font-bold text-blue-500">${product.price}₮</span>
                <div class="space-x-2">
                  <button
                    class="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600"
                    onclick="editProduct(${index})"
                  >
                    Засах
                  </button>
                  <button
                    class="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                    onclick="deleteProduct(${index})"
                  >
                    Устгах
                  </button>
                  <button
                    class="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
                    onclick="addToCart(${index})"
                  >
                    Сагсанд нэмэх
                  </button>
                </div>
              </div>
            </div>
          `;

      productList.appendChild(productCard);
    });
  }

  // Edit product
  window.editProduct = (index) => {
    const products = JSON.parse(localStorage.getItem("products"));
    const product = products[index];

    document.getElementById("title").value = product.title;
    document.getElementById("introduction").value = product.introduction;
    document.getElementById("price").value = product.price;
    document.getElementById("image").value = product.image;

    editIndex = index;

    // Navigate to the product form
    links.forEach((link) => {
      if (link.getAttribute("href") === "#add-product") {
        link.click();
      }
    });
  };

  // Delete product
  window.deleteProduct = (index) => {
    const products = JSON.parse(localStorage.getItem("products"));
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  };

  // Add to cart
  window.addToCart = (index) => {
    const products = JSON.parse(localStorage.getItem("products"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(products[index]);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Navigate to the cart section
    links.forEach((link) => {
      if (link.getAttribute("href") === "#cart") {
        link.click();
      }
    });
  };

  // Display cart items
  function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartSection = document.getElementById("cart");
    cartSection.innerHTML =
      "<h1 class='text-2xl font-bold text-gray-800 mb-4'>Сагс</h1>";

    if (cart.length === 0) {
      cartSection.innerHTML += '<p class="text-gray-500">Сагс хоосон байна.</p>';

      return;
    }

    const cartList = document.createElement("div");
    cartList.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "p-4 bg-white rounded-lg shadow-md overflow-hidden";

      cartItem.innerHTML = `
          <img
            src="${item.image}"
            alt="${item.title}"
            class="w-full h-40 object-cover mb-4"
          />
          <div>
            <h2 class="text-lg font-semibold text-gray-800">${item.title}</h2>
            <p class="text-gray-600 mt-2">${item.introduction}</p>
            <span class="text-blue-500 font-bold mt-2 block">${item.price}₮</span>
          </div>
          <button
            class="bg-red-500 text-white text-sm px-4 py-2 mt-4 rounded hover:bg-red-600"
            onclick="removeFromCart(${index})"
          >
            Сагснаас устгах
          </button>
        `;

      cartList.appendChild(cartItem);
    });

    cartSection.appendChild(cartList);
  }

  // Remove item from cart
  window.removeFromCart = (index) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart(); // Update the cart view
  };

  // Display products on load
  displayProducts();
});