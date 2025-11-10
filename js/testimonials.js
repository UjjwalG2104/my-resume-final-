document.addEventListener('DOMContentLoaded', function() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');
  let currentSlide = 0;

  // Function to show a specific slide
  function showSlide(index) {
    // Hide all testimonial cards
    testimonialCards.forEach(card => {
      card.style.display = 'none';
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show the selected slide and update dot
    testimonialCards[index].style.display = 'block';
    dots[index].classList.add('active');
    currentSlide = index;
    
    // Update button states
    updateButtonStates();
  }
  
  // Function to update button states
  function updateButtonStates() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === testimonialCards.length - 1;
  }
  
  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      showSlide(currentSlide - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentSlide < testimonialCards.length - 1) {
      showSlide(currentSlide + 1);
    }
  });
  
  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Initialize the slider
  showSlide(0);
  
  // For desktop view, show all testimonials side by side
  function handleResize() {
    if (window.innerWidth >= 768) {
      testimonialCards.forEach(card => {
        card.style.display = 'block';
      });
    } else {
      // On mobile, show only the current slide
      showSlide(currentSlide);
    }
  }
  
  // Add event listener for window resize
  window.addEventListener('resize', handleResize);
  
  // Initial check
  handleResize();
});
