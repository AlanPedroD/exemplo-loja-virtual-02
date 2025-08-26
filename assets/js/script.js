// Seletores
const cartBadge = document.querySelector(".cart-icon .badge");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalSpan = document.getElementById("cart-total");
const productsContainer = document.getElementById("products");
const checkoutBtn = document.getElementById("checkout");
const cartSlide = document.getElementById("cart-slide");
const cartIcon = document.querySelector(".cart-icon a");
const closeCartBtn = document.getElementById("close-cart");
const btnTop = document.getElementById("back-to-top");

let cart = [];

// Produtos
const products = [
  { id: "1", nome: "Calça Fashion", preco: 99.90, img: "assets/imagens/calca-fem-01.jpg" },
  { id: "2", nome: "Calça Jeans", preco: 73.90, img: "assets/imagens/calca-jeans-02.jpg" },
  { id: "3", nome: "Calça Casual", preco: 85.90, img: "assets/imagens/calca-casual.jpg" },
  { id: "4", nome: "Calça Casual nv", preco: 79.90, img: "assets/imagens/calca-casual-02.jpg" },
  { id: "5", nome: "Vestido Fashion", preco: 69.90, img: "assets/imagens/vestido-01.jpg" },
  { id: "6", nome: "Conjunto Academia", preco: 74.90, img: "assets/imagens/conj-academia-01.jpg" },
  { id: "7", nome: "Conjunto Academia nv", preco: 65.90, img: "assets/imagens/conj-academia-04.jpg" },
  { id: "8", nome: "Conjunto praia", preco: 59.99, img: "assets/imagens/moda-praia-01.jpg" }
];

// Renderizar produtos
function renderProducts() {
  productsContainer.innerHTML = "";
  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = prod.id;
    card.dataset.preco = prod.preco;
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco.toFixed(2)}</p>
      <button class="add-to-cart">Adicionar ao Carrinho</button>
    `;
    productsContainer.appendChild(card);
  });

  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach(btn => btn.addEventListener("click", addToCart));
}

// Adicionar ao carrinho
function addToCart(e) {
  
  const card = e.target.closest(".card");
  showToast("Adicionado com sucesso!", card);


  const id = card.dataset.id;
  const nome = card.querySelector("h3").textContent;
  const preco = parseFloat(card.dataset.preco);

  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantidade++;
  else cart.push({ id, nome, preco, quantidade: 1 });

  updateBadge();
  updateTotal();
  renderCartItems();

    // Só abre automático em telas grandes (>=768px)
  if (window.innerWidth >= 768) {
    cart.classList.add("active");
  }

}

// Atualizar badge
function updateBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
  cartBadge.textContent = totalItems;
}

// Atualizar total
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  cartTotalSpan.textContent = total.toFixed(2);
}

// Renderizar itens do carrinho
function renderCartItems() {
  cartItemsContainer.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.nome} x ${item.quantidade} - R$ ${(item.preco*item.quantidade).toFixed(2)}</span>
      <button class="remove-item" data-id="${item.id}" aria-label="Remover item">&times;</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach(btn => btn.addEventListener("click", removeFromCart));
}

// Remover item
function removeFromCart(e) {
  const id = e.target.dataset.id;
  cart = cart.filter(item => item.id !== id);
  updateBadge();
  updateTotal();
  renderCartItems();
}

// Finalizar compra via WhatsApp
function finalizarCompraWhatsApp() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // Monta a mensagem
  let mensagem = "Olá! Segue o meu pedido:\n";
  cart.forEach(item => {
    mensagem += `- ${item.nome} x ${item.quantidade} = R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  mensagem += `Total: R$ ${total.toFixed(2)}`;

  const numero = "5500000000000"; // substitua pelo número da loja
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");

  // Limpa carrinho
  cart = [];
  updateBadge();
  updateTotal();
  renderCartItems();
  cartSlide.classList.remove("active");
}

// Eventos
checkoutBtn.addEventListener("click", finalizarCompraWhatsApp);

// Abrir/fechar carrinho
cartIcon.addEventListener("click", (e) => { e.preventDefault(); cartSlide.classList.toggle("active"); });
closeCartBtn.addEventListener("click", () => { cartSlide.classList.remove("active"); });

// Botão voltar ao topo
btnTop.style.display = "none";
btnTop.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });
window.addEventListener("scroll", () => { btnTop.style.display = window.scrollY > 300 ? "flex" : "none"; });

// Inicializar
renderProducts();

function showToast(message, cardElement) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
      <path fill="currentColor" d="M13.485 1.929a1 1 0 0 1 0 1.414L6.707 10.121a1 1 0 0 1-1.414 0L2.515 7.343a1 1 0 1 1 1.414-1.414l2.121 2.122 6.364-6.364a1 1 0 0 1 1.414 0z"/>
    </svg>
    <span>${message}</span>
  `;

  cardElement.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.remove(), 2000);
}
