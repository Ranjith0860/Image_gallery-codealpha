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
  const link = document.createElement('a');
  link.href = filteredImages[currentLightboxIndex].src;
  link.download = 'image.jpg'; // or use dynamic name if needed
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const scrollBtn = document.getElementById("scrollUpBtn");

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
