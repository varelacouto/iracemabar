//SELEÇÃO DE ELEMENTOS

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// FECHAR MODAL DO CARRINHO
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event) {
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //ADICIONAR NO CARRINHO
        addToCart(name, price)

        
    }
})

//FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        //SE O ITEM JÁ EXITE, AUMENTA APENAS A QUANTIDADE + 1
        existingItem.quantity +=1;
        return;
    
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

//ATUALIZAR O CARRINHO
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemELement = document.createElement("div");
        cartItemELement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemELement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

            </div>

        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemELement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//FUNÇÃO PARA REMOVER O ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }

})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("borde-red-500")
        addressWarn.classList.add("hidden")
    }
})

//FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestauranteOpen();
    if(!isOpen){

        Toastify({
            text: "RESTAURANTE FECHADO NO MOMENTO!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #F06143, #F04343)",
            //    background: "#EF4444",
            },
            
          }).showToast();

          return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //ENVIAR PEDIDO PELO WHATSAPP

    const cartItems = cart.map((item) => {

        let total = 0;

        return (
               `
                Item: ${item.name}
                Quantidade: ( ${item.quantity} )
                Preço: R$ ${item.price.toFixed(2)}
                Total: R$ ${item.quantity * item.price.toFixed(2)}
                -----
                `
            
        )
    }).join("")
    
    
    const message = encodeURIComponent(cartItems);
    const phone = "5585999341628"

    window.open(`https://wa.me/${phone}?text=${message} Nome: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
    addressInput.classList.add("hidden")
    
})

//VERIFICAR A HORA E MANIPLULAR O CARD HORARIO
function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 16 && hora < 22;
    //TRUE = RESTAURANTE ESTÁ ABERTO
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");

} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");

}
