const gallery = document.getElementById("gallery");
const allImages = Array.from(gallery.querySelectorAll("img"));
let filteredImages = [...allImages];
let currentIndex = 0;

// All categories in order
const categories = ['all', 'animal', 'city', 'village','nature'];
let currentCategoryIndex = 0;

// Filter and display images by category
function filterImages(category) {
  currentCategoryIndex = categories.indexOf(category); // Keep index in sync
  filteredImages = category === "all"
    ? [...allImages]
    : allImages.filter(img => img.dataset.category === category);

  allImages.forEach(img => {
    img.style.display = filteredImages.includes(img) ? "block" : "none";
  });

  updateButtonState(category);
  currentIndex = 0;
  scrollToImage(currentIndex);
}

// Update the active button visually
function updateButtonState(activeCategory) {
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`${activeCategory}Btn`);
  if (activeBtn) activeBtn.classList.add('active');
}

// Navigate between categories
function navigate(direction) {
  currentCategoryIndex += direction;

  if (currentCategoryIndex < 0) currentCategoryIndex = categories.length - 1;
  if (currentCategoryIndex >= categories.length) currentCategoryIndex = 0;

  const selectedCategory = categories[currentCategoryIndex];
  filterImages(selectedCategory);
}

// Smooth scroll to image
function scrollToImage(index) {
  filteredImages[index]?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// Initialize gallery with all images
filterImages("all");

// ===== Lightbox Functionality =====
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
let currentLightboxIndex = 0;

// Open lightbox when image is clicked
allImages.forEach((img) => {
  img.addEventListener("click", () => {
    const visible = filteredImages;
    const index = visible.indexOf(img);
    if (index >= 0) openLightbox(index);
  });
});

function openLightbox(index) {
  currentLightboxIndex = index;
  showLightboxImage(currentLightboxIndex);
  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function lightboxNavigate(direction) {
  if (filteredImages.length === 0) return;

  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = filteredImages.length - 1;
  if (currentLightboxIndex >= filteredImages.length) currentLightboxIndex = 0;

  showLightboxImage(currentLightboxIndex);
}

function showLightboxImage(index) {
  lightboxImage.src = filteredImages[index].src;
}
function downloadImage() {
  const img = filteredImages[currentLightboxIndex];
  const filter = document.getElementById("filterSelect").value;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Create a new Image to load without CORS taint
  const tempImg = new Image();
  tempImg.crossOrigin = "anonymous";
  tempImg.src = img.src;

  tempImg.onload = function () {
    canvas.width = tempImg.naturalWidth;
    canvas.height = tempImg.naturalHeight;

    ctx.filter = filter;
    ctx.drawImage(tempImg, 0, 0);

    const link = document.createElement('a');
    link.href = canvas.toDataURL("image/jpeg");
    link.download = 'filtered-image.jpg';
    link.click();
  };
}
function applyFilter() {
  const selectedFilter = document.getElementById("filterSelect").value;
  lightboxImage.style.filter = selectedFilter;
}

// image filter
function toggleFilter() {
  const img = lightboxImage;
  const hasFilter = img.style.filter && img.style.filter !== "none";
  img.style.filter = hasFilter ? "none" : "grayscale(100%) contrast(120%) brightness(110%)";
}
function applyFilter() {
  const selectedFilter = document.getElementById("filterSelect").value;
  lightboxImage.style.filter = selectedFilter;
}



const scrollBtn = document.getElementById("scrollUpBtn");

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


const uploadInput = document.getElementById('uploadInput');

uploadInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();

    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "user-upload";
      img.setAttribute("data-category", "all"); // or let user choose category
      gallery.appendChild(img);
      allImages.push(img);
      filteredImages.push(img);

      // Make it clickable for lightbox
      img.addEventListener("click", () => {
        const index = filteredImages.indexOf(img);
        if (index >= 0) openLightbox(index);
      });
    };

    reader.readAsDataURL(file);
  });

  // Reset file input after upload
  uploadInput.value = '';
});
