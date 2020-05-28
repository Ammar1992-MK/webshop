function createNewProduct(event){

    //prevent the browser from submitting page
    //event.preventDefault();

    const productList = JSON.parse(window.localStorage.getItem("productList")) || [];
    const productId = productList.length;

    const name = document.querySelector("[name='name']").value;
    const price = document.querySelector("[name='price']").value;
    const description = document.querySelector("[name='description']").value;
    const image = document.querySelector("[name='image']").dataset.image;

    //Creating an object to put it in the poroduct list in localStorage

    const ProductsObject = {name, price, description,image,productId};
    productList.push(ProductsObject);

    window.localStorage.setItem("productList",JSON.stringify(productList));

    
    
    event.target.reset();

    const previewEl = document.getElementById("imagePreview");
    previewEl.innerHTML = "";

    
}





function renderProductList(){

    const productListJSON = JSON.parse(window.localStorage.getItem("productList")) || [];

    const productListEl = document.getElementById("productList");

    productListEl.innerHTML = "";

    for( product of productListJSON){

        const productEl = document.createElement("div");

        const {productId,name, price, description, image} = product;

        function handleDragStart(event){
            event.dataTransfer.setData("text/plain",productId);
        }


        const imageTag = (image ? `<div><img src='${image}' height= "170px" width = "170px" /></div>` : "");

        productEl.draggable = true;
        productEl.ondragstart = handleDragStart;

        productEl.innerHTML = `
           <div class="productEl"> <h2>${name}</h2>
           <button class="productEl-btn" onclick = 'handleClickAddToCart(event,${productId})' >Add to cart</button>
              ${imageTag}
            <p>Price: ${price}</p>
            <p>${description}</p> </div>
               
        `;

        
        productListEl.appendChild(productEl);
    }

    
}

function handleDragOverShippingCart(event){

    event.preventDefault();
}

function handleFileSelect(event){

   function handleFileLoad(event){

    const previewEl = document.getElementById("imagePreview");
    previewEl.innerHTML = `<img src='${event.target.result}' height='50px' width='50px'/>`;
    document.querySelector("[name='image']").dataset.image = event.target.result;

   } 

    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsDataURL(event.target.files[0]);
}

function handleClickAddToCart(event, productId){

    addToCart(productId);
}

function addToCart(productId){
    // Retrieve the existing shopping cart from local storage and parse it

    const shoppingCart = JSON.parse(window.localStorage.getItem("shoppingCart")) || {};

    if(!shoppingCart[productId]){

        shoppingCart[productId] = 0;
    }

    shoppingCart[productId] = shoppingCart[productId] + 1;

    //save the shopping cart back to the local storage

    window.localStorage.setItem("shoppingCart" , JSON.stringify(shoppingCart));

    renderShoppingList();

}

function renderShoppingList(){
 
    const productList = JSON.parse(window.localStorage.getItem("productList")) || [];
    const shoppingList = JSON.parse(window.localStorage.getItem("shoppingCart")) || [];

    // find the location to write the shopping cart

    const shoppingListEl = document.getElementById("items");

    // clear the current content of shopping cart

    shoppingListEl.innerHTML = "";

    let totalPrice = 0;

    // for each item in the shopping cart

    for( productId in shoppingList){

        const itemEl = document.createElement("div");
        const quantity = shoppingList[productId];
        const product = productList.find(p => p.productId == productId);
        const{name, price} = product;
        const orderLinePrice = quantity * price;
        totalPrice += orderLinePrice;

        itemEl.innerHTML = `<strong>${quantity} </strogn> x <strong>${name}</strong> = <strong>${orderLinePrice}</strong>`;

   
        shoppingListEl.appendChild(itemEl);
    }

    const totalEl = document.createElement("div");
    totalEl.innerHTML = `Total price  <strong>${totalPrice}</strong>`;

    shoppingListEl.appendChild(totalEl);

}





