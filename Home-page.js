// Feature rotator logic with manual dot control
let current = 0;
const features = document.querySelectorAll('.feature-item');
const dots = document.querySelectorAll('.dot');

function showFeature(index) {
  features.forEach((feature, i) => {
    feature.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
  current = index;
}

function nextFeature() {
  current = (current + 1) % features.length;
  showFeature(current);
}

// Automatic rotation every 4 seconds
let intervalID = setInterval(nextFeature, 4000);

// Add click event to dots for manual feature switching
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    showFeature(index);
    // Reset interval to avoid quick auto-switch after manual change
    clearInterval(intervalID);
    intervalID = setInterval(nextFeature, 4000);
  });
});
