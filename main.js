// Creo Array vacio, y luego una Función asincrónica para igualar ese Array al resultado de la respuesta que obtengo del metodo Fetch:

let allProducts = [];

const fetchData = async () => {
    try {
        const response = await fetch('./data.json');
        const result = await response.json();
        allProducts = result;
    } catch (error) {
        console.log(error)
    }
}

// Declaro Función para Renderizar en DOM todos los productos:

const productsContainer = document.querySelector(".products__gridGallery");

function renderProducts(productList) {
    productList.forEach((product) => {
        const {id, name, price, image} = product // Ejemplo de Desestructuración.
        const productElement = document.createElement("div");
        productElement.setAttribute("class", "gallery__newChild gallery__style");
        productElement.innerHTML = `<img class="galleryImg" src="${image}" alt="Producto">
                                    <h4 class="categoryTitle">${name}</h4>
                                    <p>Precio: $${price}</p>
                                    <button class="addToCartBtn" id="${id}" type="submit">Agregar al Carrito</button>`
        productsContainer.appendChild(productElement);

        // A cada botón generado le agrego el evento onclick, que es el que voy a necesitar escuchar para poder agregar productos al Carrito:
        const addToCartBtn = document.querySelectorAll(".addToCartBtn");

        addToCartBtn.forEach((button) => {
            button.onclick = () => {
                addToShoppingCart(button); // Esta función es declarada más adelante
                // Incorporo librería Toastify:
                Toastify({
                    text: "Agregaste un producto al Carrito!",
                    duration: 3000,
                    gravity: "bottom",
                    style: {
                        color: "white",
                        background: "black",
                    },
                    }).showToast();
            }
        });
    });
}

// Declaro Función para Eliminar del DOM todos los items:

function removeItems(container) {
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
}

// Llamo a fetchData() y renderProducts() como una IIFE asincrónica para inicializar el DOM con todos los productos disponibles:

(async () => {
    await fetchData();
    renderProducts(allProducts);
})()

// Declaro Constantes que voy a necesitar para Login y Logout:

const login = document.querySelector(".loginContainer");
const loginInput = document.querySelector(".loginInput");
const loginBtn = document.querySelector(".loginBtn");
const userNameStored = localStorage.getItem("userName");
const welcomeMessage__container = document.querySelector(".welcomeMessage__container");
const logout = document.querySelector(".logoutContainer");
const logoutBtn__container = document.querySelector(".logoutBtn__container");
const logoutBtn = document.querySelector(".logoutBtn");

// Declaro Función para setear un Mensaje de Bienvenida:

function setWelcomeMessage(Name) {
    const welcomeMessage = document.createElement("h3");
    welcomeMessage.setAttribute("class", "welcomeMessage");
    welcomeMessage.innerHTML = `Hola ${Name}, gracias por visitar Coder Records!`;
    welcomeMessage__container.appendChild(welcomeMessage);
}

// Declaro Función para Verificar si el Usuario está Logueado (utilizo Operador Ternario) y luego llamo a la función setWelcomeMessage():

function verifyUserLogIn() {
    userNameStored !== null
        ? ((setWelcomeMessage(userNameStored)), login.style.display = "none")
        : logout.style.display = "none";
} 

verifyUserLogIn();

// Si el usuario no está logueado, escucho evento en el botón de Login y llamo a las funciones removeItems() y setWelcomeMessage():

loginBtn.onclick = () => {
    localStorage.setItem("userName", loginInput.value);
    removeItems(welcomeMessage__container);
    setWelcomeMessage(loginInput.value);
    login.style.display = "none";
    logout.style.display = "flex";
}

// Si el usuario está logueado, escucho evento en el botón de Logout:

logoutBtn.onclick = () => {
    localStorage.removeItem("userName");
    loginInput.value = "";
    logout.style.display = "none"
    login.style.display = "flex";
}

// Escucho Evento en el SearchBar, y modifico Estilos (utilizo Operador Ternario):

const searchBar = document.querySelector(".searchBar");
const searchBar__input = document.querySelector(".searchBar__input");
const searchBar__btn = document.querySelector(".searchBar__btn");

document.addEventListener("click", e => {
    searchBar__input.contains(e.target)
        ? ((searchBar.style.backgroundColor = "#ece9f3"),
            (searchBar__input.style.backgroundColor = "#ece9f3"),
            (searchBar__btn.style.border = "1px solid #000000"))
        : ((searchBar.style.backgroundColor = ""),
            (searchBar__input.style.backgroundColor = ""),
            (searchBar__btn.style.border = ""));
});

// Declaro Función Filtrar por Nombre (utilizo Operador Ternario), y llamo a removeItems() y luego a renderProducts() dependiendo del resultado:

const filterResultMessage = document.querySelector(".filterResultMessage");

function filterByName() {
    let productName = searchBar__input.value.toUpperCase();
    let nameList = allProducts.filter((product) => product.name.toUpperCase().includes(productName)); 
    let categoryList = allProducts.filter((product) => product.category.toUpperCase().includes(productName)); // Ej: si busco "disco", quiero que también me traiga resultados, por eso incluyo la categoría.
    let resultList = nameList.concat(categoryList);

    removeItems(productsContainer);
    
    resultList.length === 0
        ? filterResultMessage.textContent = `Sin resultados para "${productName}".`
        : ((filterResultMessage.textContent = `Resultados para "${productName}":`), renderProducts(resultList));
}

// Escucho Eventos en el SearchBar Button y SearchBar Input, y llamo a la función filterByName():

searchBar__btn.onclick = () => {
    filterByName();
}

document.addEventListener("keyup", e => {
    (searchBar__input.contains(e.target) && (e.key === 'Enter')) && filterByName()
});


// Declaro Función Filtrar por Categoría, llamo a removeItems() y renderProducts():

function filterByCategory(category) {
    let resultList = [];

    allProducts.forEach((product) => {
        product.category === category && resultList.push(product);
    });
    
    if (resultList.length === 0) {
        resultList = allProducts;
    }

    filterResultMessage.textContent = `${category}:`;

    removeItems(productsContainer);
    renderProducts(resultList);
}

// Escucho Evento el Botón de Filtro por Categoría y llamo a la función filterByCategory():

const filterCategoryBtn = document.querySelector(".filterCategoryBtn");

filterCategoryBtn.onclick = () => {
    if (document.querySelector(".bandejas").checked) {
        filterByCategory("Bandejas Giradiscos");
    } else if (document.querySelector(".monitores").checked) {
        filterByCategory("Monitores de Estudio");
    } else if (document.querySelector(".discos").checked) {
            filterByCategory("Discos de Vinilo");
    } else if (document.querySelector(".destacados").checked) {
        filterByCategory("Productos Destacados");
    }
}

// Declaro Función Filtrar por Precio (utilizo Operador Ternario), llamo a removeItems() y renderProducts():

function filterByPrice() {
    const minPrice = document.querySelector(".inputMin").value;
    const maxPrice = document.querySelector(".inputMax").value;
    const resultList = allProducts.filter(product => (product.price >= minPrice) && (product.price <= maxPrice));

    resultList.length === 0
        ? filterResultMessage.textContent = `Sin Resultados para Productos entre $${minPrice} y $${maxPrice}.`
        : filterResultMessage.textContent = `Productos entre $${minPrice} y $${maxPrice}:`;

    removeItems(productsContainer);
    renderProducts(resultList);
}

// Escucho Evento en Botón de Filtrado por Precio y llamo a la función filterByPrice():

const filterPriceBtn = document.querySelector(".filterPriceBtn");

filterPriceBtn.onclick = () => {
    filterByPrice();
}

// Declaro Variables a utilizar en el Carrito de Compras (utilizo Operador || y ya no necesito declarar un array vacío):

const shoppingCartQuantity = document.querySelector(".shoppingCartQuantity");
let shoppingCart = JSON.parse(localStorage.getItem("shoppingCartStored")) || [];

// Declaro Función para Verificar si el Carrito ya tiene items o no (utilizo Operador &&), luego la llamo:

function verifyShoppingCartStored() {
    shoppingCart && (shoppingCartQuantity.textContent = shoppingCart.reduce((acumulator, product) => acumulator + product.quantity, 0));
}

verifyShoppingCartStored();

// Creo Función para Agregar Productos al Carrito / Considerar que variable addToCartBtn y addToCartBtn.onclick ya fueron declarados en renderProducts();

function addToShoppingCart(button) {
    allProducts.forEach((product) => {
        if (product.id === button.id && shoppingCart.some(cartItem => (cartItem.id === product.id))) {
            const cartItem = shoppingCart.find(cartItem => cartItem.id === product.id);
            cartItem.quantity++;
        } else if (product.id === button.id) {
            shoppingCart.push(product);
        }
    });
    
    localStorage.setItem("shoppingCartStored", JSON.stringify(shoppingCart));
    shoppingCartQuantity.textContent = shoppingCart.reduce((acumulator, product) => acumulator + product.quantity, 0);
}

// Declaro variables a utilizar en el Modal:

const modalContainer = document.querySelector(".modalContainer");
const modalContainerClose = document.querySelector(".modalContainerClose");
const shoppingCartProducts = document.querySelector(".shoppingCartProducts");
const totalAmout = document.querySelector(".totalAmout");
const modalMessage = document.querySelector(".modalMessage");

// Declaro Función para setear el Mensaje del Modal:

function setModalMessage() {
    const userNameStored = localStorage.getItem("userName");
    if (userNameStored !== null && shoppingCart.length >= 1) {
        modalMessage.textContent = `${userNameStored}, estás a un paso de tu compra!`
    } else if (userNameStored !== null && shoppingCart.length < 1) {
        modalMessage.textContent = `${userNameStored}, todavía no has agregado productos al carrito.`
    } else if (userNameStored === null && shoppingCart.length >= 1) {
        modalMessage.textContent = `Estás a un paso de tu compra!`
    } else {
        modalMessage.textContent = `Todavía no has agregado productos al carrito.`
    }
}

// Delcaro Función para Renderizar los productos agregados al Carrito dentro del Modal:

function renderModalProducts() {
    shoppingCart.forEach((product) => {
        const shoppingCartProduct = document.createElement("div");
        shoppingCartProduct.setAttribute("class", "shoppingCartProduct");
        shoppingCartProduct.setAttribute("id", `"modalProduct${product.id}"`)
        shoppingCartProduct.innerHTML = `<img class="shoppingCartProductImg" src="${product.image}" alt="Producto">
                                    <h5 class="categoryTitle">${product.name}</h5>
                                    <p>x${product.quantity}</p>
                                    <p>$${product.price * product.quantity}</p>
                                    <button class="removeFromCartBtn" id="${product.id}" type="submit"/>X</button>`
        shoppingCartProducts.appendChild(shoppingCartProduct);
    });

    // Escucho evento onclick en el botón de Eliminar Producto y llamo a setModalMessage():

    const removeFromCartBtn = document.querySelectorAll(".removeFromCartBtn");

    removeFromCartBtn.forEach((button) => {
        button.onclick = () => {
            shoppingCart = shoppingCart.filter((product => product.id !== button.id));
            localStorage.setItem("shoppingCartStored", JSON.stringify(shoppingCart));
            shoppingCartQuantity.textContent = shoppingCart.reduce((acumulator, product) => acumulator + product.quantity, 0);
            const productToRemoveFromModal = document.getElementById(`"modalProduct${button.id}"`);
            productToRemoveFromModal.style.display = "none";
            const totalShoppingCartValue = shoppingCart.reduce((acumulator, product) => acumulator + (product.price * product.quantity), 0);
            totalAmout.textContent = `Importe Total: $${totalShoppingCartValue}.`
            setModalMessage();
        }
    });
}

// Escucho evento onclick en el Carrito de Compras y llamo a setModalMessage() y renderModalProducts():

const shoppingCartBtn = document.querySelector(".shoppingCartBtn");

shoppingCartBtn.onclick = () => {
    modalContainer.classList.add("show");
    setModalMessage();
    renderModalProducts();

    const totalShoppingCartValue = shoppingCart.reduce((acumulator, product) => acumulator + (product.price * product.quantity), 0);
    totalAmout.textContent = `Importe Total: $${totalShoppingCartValue}.`
}

// Delcaro Función para Vaciar el Carrito de Compras:

function emptyShoppingCart() {
    shoppingCart = [];
    localStorage.setItem("shoppingCartStored", JSON.stringify(shoppingCart));
}

// Escucho evento onclick en el boton de Vaciar Carrito y llamo a removeItems(), emptyShoppingCart() y setModalMessage():

const emptyCartBtn = document.querySelector(".emptyCartBtn");

emptyCartBtn.onclick = () => {
    removeItems(shoppingCartProducts);
    emptyShoppingCart();
    setModalMessage();
    const totalShoppingCartValue = shoppingCart.reduce((acumulator, product) => acumulator + (product.price * product.quantity), 0);
    totalAmout.textContent = `Importe Total: $${totalShoppingCartValue}.`
    shoppingCartQuantity.textContent = shoppingCart.reduce((acumulator, product) => acumulator + product.quantity, 0);
}

// Esucho evento onclick en el boton de Cerrar Modal y llamo a la función removeItems():

modalContainerClose.onclick = () => {
    modalContainer.classList.remove("show");
    removeItems(shoppingCartProducts);
};

