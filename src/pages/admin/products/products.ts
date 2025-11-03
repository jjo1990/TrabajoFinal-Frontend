import { apiFetch } from "../../../utils/api";
import type { IProduct } from "../../../types/IProduct";
import type { ICategoria } from "../../../types/ICategoria";

const tableBody = document.querySelector<HTMLTableSectionElement>("#product-table tbody")!;
const form = document.querySelector<HTMLFormElement>("#product-form")!;
const idInput = document.querySelector<HTMLInputElement>("#product-id")!;
const nameInput = document.querySelector<HTMLInputElement>("#product-name")!;
const priceInput = document.querySelector<HTMLInputElement>("#product-price")!;
const categoryInput = document.querySelector<HTMLSelectElement>("#product-category")!;
const descInput = document.querySelector<HTMLTextAreaElement>("#product-desc")!;
const stockInput = document.querySelector<HTMLInputElement>("#product-stock")!;
const imageInput = document.querySelector<HTMLInputElement>("#product-image")!;
const imagePreview = document.querySelector<HTMLImageElement>('#product-image-preview')!;

const modalOverlay = document.getElementById("product-modal") as HTMLDivElement | null;
const openNewBtn = document.getElementById("openNewProduct") as HTMLButtonElement | null;
const modalClose = document.getElementById("productModalClose") as HTMLButtonElement | null;
const modalCancel = document.getElementById("productModalCancel") as HTMLButtonElement | null;

function openModal(title = "Nuevo Producto") {
    if (!modalOverlay) return;
    const modalTitle = modalOverlay.querySelector<HTMLHeadingElement>('#product-modal-title');
    if (modalTitle) modalTitle.textContent = title;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    form.reset();
}

openNewBtn?.addEventListener('click', () => {
    idInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    descInput.value = '';
    stockInput.value = '';
    imageInput.value = '';
    if (imagePreview) { imagePreview.src = ''; imagePreview.style.display = 'none'; }
    // recargar opciones de categorías antes de abrir
    void loadCategoryOptions();
    openModal('Nuevo Producto');
});

modalClose?.addEventListener('click', closeModal);
modalCancel?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

async function loadProducts() {
    const products: IProduct[] = await apiFetch("/products");
    tableBody.innerHTML = "";
            products.forEach((p) => {
                const row = document.createElement("tr");
                        row.innerHTML = `
                    <td>${p.id}</td>
                    <td><img src="${p.imageUrl ?? '/public/placeholder.png'}" alt=""/></td>
                    <td>${p.name}</td>
                    <td>${(p as any).description ?? ''}</td>
                    <td>$${Number(p.price).toFixed(2)}</td>
                    <td>${p.categoryId ?? ''}</td>
                    <td>${(p as any).stock ?? ''}</td>
                    <td>${(p as any).active ? '<span class="pill">SI</span>' : 'NO'}</td>
            <td>
                <button class="edit-btn" data-id="${p.id}">Editar</button>
                <button class="delete-btn" data-id="${p.id}">Eliminar</button>
            </td>
        `;
                tableBody.appendChild(row);
        });

    document.querySelectorAll(".edit-btn").forEach((btn) =>
        btn.addEventListener("click", (e) => editProduct(Number((e.target as HTMLElement).dataset.id)))
    );

    document.querySelectorAll(".delete-btn").forEach((btn) =>
        btn.addEventListener("click", (e) => deleteProduct(Number((e.target as HTMLElement).dataset.id)))
    );
}

// carga y pobla el select de categorías (solo muestra el ID como texto)
async function loadCategoryOptions() {
    try {
        const categories: ICategoria[] = await apiFetch('/categories');
        // limpiar opciones (dejando la placeholder)
        if (!categoryInput) return;
        const placeholder = categoryInput.querySelector('option[value=""]');
        categoryInput.innerHTML = '';
        if (placeholder) categoryInput.appendChild(placeholder);

        // si no existe placeholder, crear una
        if (!categoryInput.querySelector('option[value=""]')) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.disabled = true;
            opt.selected = true;
            opt.textContent = 'Seleccione ID de categoría';
            categoryInput.appendChild(opt);
        }

        categories.forEach(c => {
            const opt = document.createElement('option');
            opt.value = String(c.id ?? '');
            // mostrar "ID - Nombre" para mayor claridad
            const idText = String(c.id ?? '');
            const nameText = c.name ? String(c.name) : '';
            opt.textContent = nameText ? `${idText} - ${nameText}` : idText;
            if (c.name) opt.title = c.name;
            categoryInput.appendChild(opt);
        });
    } catch (err) {
        console.error('Error cargando categorías para select', err);
    }
}
async function editProduct(id: number) {
    const product: IProduct = await apiFetch(`/products/${id}`);
    idInput.value = String(product.id ?? "");
    nameInput.value = product.name;
    priceInput.value = String(product.price);
    // recargar las categorías y luego seleccionar la correspondiente
    await loadCategoryOptions();
    categoryInput.value = String(product.categoryId ?? '');
    descInput.value = String((product as any).description ?? '');
    stockInput.value = String((product as any).stock ?? '');
        imageInput.value = String((product as any).imageUrl ?? '');
            if (imagePreview) {
                if ((product as any).imageUrl) {
                    imagePreview.src = String((product as any).imageUrl);
                    imagePreview.style.display = 'block';
                } else {
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                }
            }
    openModal('Editar Producto');
}

// update preview while typing
imageInput?.addEventListener('input', () => {
    if (!imagePreview) return;
    const val = imageInput.value.trim();
    if (val) {
        imagePreview.src = val;
        imagePreview.style.display = 'block';
    } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
});

// fallback to placeholder on error
imagePreview?.addEventListener('error', () => { if (imagePreview) { imagePreview.src = ''; imagePreview.style.display = 'none'; } });

async function deleteProduct(id: number) {
    if (confirm("¿Eliminar producto?")) {
        await apiFetch(`/products/${id}`, { method: "DELETE" });
        loadProducts();
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product: IProduct = {
        name: nameInput.value,
        price: parseFloat(priceInput.value),
        categoryId: parseInt(categoryInput.value),
    };

    if (idInput.value) {
        const payload: any = { ...product };
        if (descInput.value) payload.description = descInput.value;
        if (stockInput.value) payload.stock = parseInt(stockInput.value);
        if (imageInput.value) payload.imageUrl = imageInput.value;
        await apiFetch(`/products/${idInput.value}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    } else {
        // allow sending extra optional fields (description, stock)
        const payload: any = { ...product };
        if (descInput.value) payload.description = descInput.value;
        if (stockInput.value) payload.stock = parseInt(stockInput.value);
        if (imageInput.value) payload.imageUrl = imageInput.value;
        await apiFetch("/products", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }
    form.reset();
    closeModal();
    loadProducts();
});

loadProducts();