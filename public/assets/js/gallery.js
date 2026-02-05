(function () {
  const galleryContainer = document.getElementById("galleryContainer");
  if (!galleryContainer) return;

  const filterBtns = document.querySelectorAll(".filter-btn");

  async function loadGallery() {
    try {
      const res = await fetch("/assets/data/gallery/gallery.json");
      const data = await res.json();
      appendGalleryItems(data);
    } catch (err) {
      console.warn("Failed to load gallery, check CMS or fallback");
    }
  }

  function appendGalleryItems(items) {
    galleryContainer.innerHTML = "";
    items.forEach(item => {
      const col = document.createElement("div");
      const category = (item.category || "general").toLowerCase().replace(/\s+/g, "-");
      col.className = `col-3 filter-item ${category}`;

      let media = "";
      if (item.url.endsWith(".mp4")) {
        media = `<a href="${item.url}" class="lightbox" data-type="video">
                   <video src="${item.url}" muted preload="metadata"></video>
                 </a>`;
      } else {
        media = `<a href="${item.url}" class="lightbox" data-type="image">
                   <img src="${item.url}" alt="${item.title}" loading="lazy">
                 </a>`;
      }

      col.innerHTML = `
        ${media}
        <div class="gallery-info">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
      `;
      galleryContainer.appendChild(col);
    });

    if (typeof initLightbox === "function") initLightbox();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter.toLowerCase();
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryContainer.querySelectorAll(".filter-item").forEach(item => {
        item.style.display = filter === "all" || item.classList.contains(filter) ? "block" : "none";
      });
    });
  });

  loadGallery();
  window.refreshGallery = loadGallery;
})();