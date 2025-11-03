import { apiFetch } from "../../../utils/api";
import type { ICategoria } from "../../../types/ICategoria";

const tableBody = document.querySelector<HTMLTableSectionElement>("#category-table tbody")!;
const form = document.querySelector<HTMLFormElement>("#category-form")!;
const idInput = document.querySelector<HTMLInputElement>("#category-id")!;
const nameInput = document.querySelector<HTMLInputElement>("#category-name")!;
const descInput = document.querySelector<HTMLTextAreaElement>("#category-desc")!;
const imageInput = document.querySelector<HTMLInputElement>("#category-image")!;
const imagePreview = document.querySelector<HTMLImageElement>("#category-image-preview")!;

const modalOverlay = document.getElementById("category-modal");
const openNewBtn = document.getElementById("openNewCategory");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");

function openModal(title = "Nueva Categoría") {
  if (!modalOverlay) return;
  const modalTitle = modalOverlay.querySelector<HTMLHeadingElement>('#modal-title');
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
  descInput.value = '';
  imageInput.value = '';
  if (imagePreview) { imagePreview.src = ''; imagePreview.style.display = 'none'; }
  openModal('Nueva Categoría');
});

modalClose?.addEventListener('click', closeModal);
modalCancel?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

async function loadCategories() {
  try {
    const categories: ICategoria[] = await apiFetch('/categories');
    tableBody.innerHTML = '';

    categories.forEach(renderCategoryRow);
  } catch (err) {
    console.error('Error cargando categorías', err);
  }
}

function renderCategoryRow(c: ICategoria) {
  const tr = document.createElement('tr');

  const tdId = document.createElement('td');
  tdId.textContent = String(c.id ?? '');

  const tdImg = document.createElement('td');
  const img = document.createElement('img');
  img.src = c.imageUrl ?? '/public/placeholder.png';
  img.alt = c.name ?? 'Imagen';
  tdImg.appendChild(img);

  const tdName = document.createElement('td');
  tdName.textContent = c.name;

  const tdDesc = document.createElement('td');
  tdDesc.textContent = c.description ?? '';

  const tdActions = document.createElement('td');
  const btnEdit = document.createElement('button');
  btnEdit.className = 'edit-btn';
  btnEdit.dataset.id = String(c.id ?? '');
  btnEdit.textContent = 'Editar';

  const btnDelete = document.createElement('button');
  btnDelete.className = 'delete-btn';
  btnDelete.dataset.id = String(c.id ?? '');
  btnDelete.textContent = 'Eliminar';

  tdActions.appendChild(btnEdit);
  tdActions.appendChild(btnDelete);

  tr.appendChild(tdId);
  tr.appendChild(tdImg);
  tr.appendChild(tdName);
  tr.appendChild(tdDesc);
  tr.appendChild(tdActions);

  tableBody.appendChild(tr);
}

// delegación de eventos para editar/eliminar
tableBody.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest('button');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.classList.contains('edit-btn')) {
    void editCategory(id);
  } else if (btn.classList.contains('delete-btn')) {
    void deleteCategory(id);
  }
});

async function editCategory(id: number) {
  try {
    const category = await apiFetch(`/categories/${id}`) as ICategoria;
    idInput.value = String(category.id ?? '');
    nameInput.value = category.name;
    descInput.value = category.description ?? '';
    imageInput.value = category.imageUrl ?? '';
    if (imagePreview) {
      if (category.imageUrl) {
        imagePreview.src = category.imageUrl;
        imagePreview.style.display = 'block';
      } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
      }
    }
    openModal('Editar Categoría');
  } catch (err) {
    console.error('Error al obtener categoría', err);
  }
}

async function deleteCategory(id: number) {
  if (!confirm('¿Eliminar categoría?')) return;
  try {
    await apiFetch(`/categories/${id}`, { method: 'DELETE' });
    loadCategories();
  } catch (err) {
    console.error('Error eliminando categoría', err);
  }
}

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

imagePreview?.addEventListener('error', () => { if (imagePreview) { imagePreview.src = ''; imagePreview.style.display = 'none'; } });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload: Partial<ICategoria> = { name: nameInput.value };
  if (descInput.value) payload.description = descInput.value;
  if (imageInput.value) payload.imageUrl = imageInput.value;

  try {
    if (idInput.value) {
      await apiFetch(`/categories/${idInput.value}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch('/categories', { method: 'POST', body: JSON.stringify(payload) });
    }
    closeModal();
    loadCategories();
  } catch (err) {
    console.error('Error guardando categoría', err);
  }
});

// carga inicial
loadCategories();