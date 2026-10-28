const PRODUCTS = [
  {id:"p1",name:"Form Studio Watch",category:"Lifestyle",price:8999,oldPrice:10999,rating:4.9,badge:"Bestseller",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",description:"A simple everyday watch that works with casual and dressy outfits."},
  {id:"p2",name:"Studio Headphones",category:"Tech",price:12499,rating:4.8,badge:"Popular",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",description:"Comfortable headphones for music, calls, and getting things done."},
  {id:"p3",name:"Ceramic Pour-Over",category:"Home",price:2499,rating:4.9,badge:"Small batch",image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85",description:"For a fresh cup of coffee at home, without making things complicated."},
  {id:"p4",name:"Everyday Carry Tote",category:"Lifestyle",price:2999,rating:4.7,badge:"New",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85",description:"A roomy everyday tote for errands, classes, work, and weekends."},
  {id:"p5",name:"Wireless Speaker",category:"Tech",price:499999,rating:4.8,badge:"Fan favorite",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85",description:"A compact speaker for your room, desk, or small get-togethers."},
  {id:"p6",name:"Soft Glow Lamp",category:"Home",price:4999,rating:4.6,badge:"Editor's pick",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",description:"A warm little lamp for your bedside table or reading corner."},
  {id:"p7",name:"Daily Water Bottle",category:"Lifestyle",price:1799,rating:4.8,badge:"Everyday essential",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85",description:"A reusable bottle to keep water close while you are out and about."},
  {id:"p8",name:"Desk Essentials Set",category:"Tech",price:3999,rating:4.7,badge:"Gift idea",image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=85",description:"A tidy desk set to make your study or work space feel more organised."}
];
const FREE_SHIPPING = 7500;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat("en-PK",{style:"currency",currency:"PKR",maximumFractionDigits:0}).format(n);
const safeParse = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key))?? fallback; } catch { return fallback; } };
let cart = safeParse("novacart_cart", []);
let orders = safeParse("novacart_orders", []);
let activeCategory = "All";
let toastTimer;

function saveCart(){ localStorage.setItem("novacart_cart", JSON.stringify(cart)); }
function saveOrders(){ localStorage.setItem("novacart_orders", JSON.stringify(orders)); }
function productById(id){ return PRODUCTS.find(p=>p.id===id); }
function toast(message){ const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2400); }

function renderProducts(){
  const term=$("#searchInput").value.trim().toLowerCase();
  let filtered=PRODUCTS.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term));
  const sort=$("#sortSelect").value;
  if(sort==="price-low") filtered.sort((a,b)=>a.price-b.price);
  if(sort==="price-high") filtered.sort((a,b)=>b.price-a.price);
  if(sort==="name") filtered.sort((a,b)=>a.name.localeCompare(b.name));
  $("#productGrid").innerHTML=filtered.map(p=>`
    <article class="product-card">
      <div class="product-image" data-product="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.opacity='.15'">
        <span class="product-badge">${p.badge}</span>
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-meta"><h3 class="product-name">${p.name}</h3><span class="product-rating">★ ${p.rating}</span></div>
      <div class="product-category">${p.category}</div>
      <div class="product-bottom"><div class="product-price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div><div class="color-dots" aria-hidden="true"><i></i><i></i><i></i></div></div>
    </article>`).join("");
  $("#resultCount").textContent=`Showing ${filtered.length} product${filtered.length===1?"":"s"}`;
  $("#allCount").textContent=PRODUCTS.length;
  $("#productGrid").classList.toggle("hidden",filtered.length===0);
  $("#emptyProducts").classList.toggle("hidden",filtered.length!==0);
}

function openProductDetails(id){
  const p=productById(id);
  if(!p)return;
  $("#productModalTitle").textContent=p.name;
  $("#productDetailsContent").innerHTML=`
    <div class="product-detail-layout">
      <div class="product-detail-image"><img src="${p.image}" alt="${escapeHtml(p.name)}"></div>
      <div class="product-detail-copy">
        <div class="product-detail-kicker">${escapeHtml(p.category)} <span>★ ${p.rating}</span></div>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="product-detail-price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div>
        <p>${escapeHtml(p.description)}</p>
        <div class="detail-info"><span>✓</span><div><strong>Everyday favourite</strong><small>Selected for practical use and simple style.</small></div></div>
        <div class="detail-info"><span>✓</span><div><strong>Delivery available</strong><small>Delivery cost is shown during checkout.</small></div></div>
        <button class="primary-button detail-add" data-detail-add="${p.id}">Add to bag <span>→</span></button>
        <p class="detail-note">Product images are illustrative. Availability may vary.</p>
      </div>
    </div>`;
  openModal("productModal");
}

function addToCart(id){
  const item=cart.find(i=>i.id===id);
  if(item)item.qty++; else cart.push({id,qty:1});
  saveCart(); renderCart(); toast(`${productById(id).name} added to your bag`);
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart(); renderCart();
}
function removeItem(id){cart=cart.filter(i=>i.id!==id);saveCart();renderCart();toast("Item removed from your bag");}
function subtotal(){return cart.reduce((sum,i)=>sum+(productById(i.id)?.price||0)*i.qty,0);}
function renderCart(){
  const qty=cart.reduce((n,i)=>n+i.qty,0), sub=subtotal(), remaining=Math.max(0,FREE_SHIPPING-sub);
  $("#cartCount").textContent=qty; $("#drawerItemCount").textContent=`(${qty})`; $("#cartSubtotal").textContent=money(sub);
  $("#cartItems").innerHTML=cart.map(i=>{const p=productById(i.id);if(!p)return"";return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><div class="cart-variant">${p.category}</div><div class="cart-price">${money(p.price)}</div><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}">Remove</button></div>`}).join("");
  $("#cartEmpty").classList.toggle("hidden",qty>0); $("#cartFooter").classList.toggle("hidden",qty===0); $("#cartItems").classList.toggle("hidden",qty===0);
  $("#shippingMessage").textContent=remaining===0?"You've unlocked free delivery!":`Add ${money(remaining)} more for free delivery`;
  $("#shippingProgress").style.width=`${Math.min(100,sub/FREE_SHIPPING*100)}%`;
}
function openCart(){ $("#overlay").classList.add("open");$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"; }
function closeDrawer(){ $("#overlay").classList.remove("open");$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""; }
function openModal(id){ closeDrawer(); $("#"+id).classList.remove("hidden");document.body.style.overflow="hidden"; }
function closeModals(){ $$(".modal-wrap").forEach(m=>m.classList.add("hidden"));document.body.style.overflow=""; }
function prepareCheckout(){
  if(!cart.length){toast("Your bag is empty");return;}
  const sub=subtotal(),shipping=sub>=FREE_SHIPPING?0:7.5;
  $("#checkoutSummary").innerHTML=cart.map(i=>{const p=productById(i.id);return `<div class="summary-product"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>Qty ${i.qty}</small></div><span>${money(p.price*i.qty)}</span></div>`}).join("");
  $("#checkoutSubtotal").textContent=money(sub);$("#checkoutShipping").textContent=shipping===0?"Free":money(shipping);$("#checkoutTotal").textContent=money(sub+shipping);
  openModal("checkoutModal");
}
function placeOrder(event){
  event.preventDefault();if(!cart.length)return;
  const form=new FormData(event.currentTarget);
  const sub=subtotal(),shipping=sub>=FREE_SHIPPING?0:7.5;
  const order={id:"NC-"+Date.now().toString().slice(-8),date:new Date().toISOString(),status:"Confirmed",customer:{name:form.get("name").trim(),email:form.get("email").trim(),address:form.get("address").trim(),city:form.get("city").trim(),postal:form.get("postal").trim()},payment:form.get("payment"),items:cart.map(i=>({id:i.id,qty:i.qty,price:productById(i.id).price,name:productById(i.id).name})),subtotal:sub,shipping,total:sub+shipping};
  orders.unshift(order);saveOrders();cart=[];saveCart();renderCart();event.currentTarget.reset();closeModals();$("#orderReference").textContent=order.id;openModal("successModal");
}
function renderOrders(){
  const host=$("#ordersList");
  if(!orders.length){host.innerHTML='<div class="no-orders"><div style="font-size:32px;margin-bottom:12px">▱</div><strong>No orders yet</strong><p>Orders you place will show up here.</p></div>';return;}
  host.innerHTML=orders.map(o=>`<article class="order-card"><div class="order-card-top"><div><h3>Order ${o.id}</h3><small>${new Date(o.date).toLocaleString()} · ${o.items.length} product type${o.items.length===1?"":"s"}</small></div><span class="status-pill">${o.status}</span></div><div class="order-card-bottom"><span><strong>${money(o.total)}</strong> · ${o.payment}</span><button data-order-detail="${o.id}">View details ↗</button></div><div class="order-detail hidden" id="detail-${o.id}"><strong>Delivery:</strong> ${escapeHtml(o.customer.name)}, ${escapeHtml(o.customer.address)}, ${escapeHtml(o.customer.city)} ${escapeHtml(o.customer.postal)}<br><strong>Email:</strong> ${escapeHtml(o.customer.email)}<br><strong>Items:</strong> ${o.items.map(i=>`${escapeHtml(i.name)} × ${i.qty} (${money(i.price*i.qty)})`).join(", ")}<br><strong>Subtotal:</strong> ${money(o.subtotal)} · <strong>Shipping:</strong> ${o.shipping===0?"Free":money(o.shipping)}</div></article>`).join("");
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showOrders(){renderOrders();closeModals();openModal("ordersModal");}
function setCategory(category){activeCategory=category;$$(".category-pill").forEach(b=>b.classList.toggle("active",b.dataset.category===category));renderProducts();}


$("#productDetailsContent").addEventListener("click",e=>{
 const b=e.target.closest("[data-detail-add]");
 if(!b)return;
 const id=b.dataset.detailAdd;
 closeModals();
 addToCart(id);
});

$("#productGrid").addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){e.stopPropagation();addToCart(add.dataset.add);return;}
  const card=e.target.closest("[data-product]");if(card){openProductDetails(card.dataset.product);}
});
$("#productGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-product]")){e.preventDefault();openProductDetails(e.target.dataset.product);}});
$("#categoryPills").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b)setCategory(b.dataset.category);});
$$("[data-category-link]").forEach(a=>a.addEventListener("click",()=>setCategory(a.dataset.categoryLink)));
$("#searchInput").addEventListener("input",renderProducts);
$("#sortSelect").addEventListener("change",renderProducts);
$("#searchFocus").addEventListener("click",()=>{$("#searchInput").focus();$("#shop").scrollIntoView({behavior:"smooth"});});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#searchInput").focus();}if(e.key==="Escape"){closeDrawer();closeModals();}});
$("#openCart").addEventListener("click",openCart);
$("#overlay").addEventListener("click",closeDrawer);
$("#cartDrawer").addEventListener("click",e=>{
 const q=e.target.closest("[data-qty]");if(q)changeQty(q.dataset.qty,Number(q.dataset.delta));
 const r=e.target.closest("[data-remove]");if(r)removeItem(r.dataset.remove);
 if(e.target.closest("[data-close]"))closeDrawer();
});
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>{closeDrawer();closeModals();}));
$("#goCheckout").addEventListener("click",prepareCheckout);
$("#checkoutForm").addEventListener("submit",placeOrder);
$("#viewOrders").addEventListener("click",showOrders);
$("#footerOrders").addEventListener("click",e=>{e.preventDefault();showOrders();});
$("#ordersList").addEventListener("click",e=>{const b=e.target.closest("[data-order-detail]");if(!b)return;const d=$("#detail-"+b.dataset.orderDetail);d.classList.toggle("hidden");b.textContent=d.classList.contains("hidden")?"View details ↗":"Hide details ↑";});
$("#resetFilters").addEventListener("click",()=>{$("#searchInput").value="";$("#sortSelect").value="featured";setCategory("All");});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("#newsletterMessage").textContent="Thanks for your interest! Newsletter sign-up is currently unavailable.";$("#newsletterEmail").value="";toast("Thanks for subscribing ()");});
$("#backToTop").addEventListener("click",e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});});
renderProducts();renderCart();
