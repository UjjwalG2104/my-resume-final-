// Theme handling
(function initializeTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.add("light");
    if (saved === "dark") document.documentElement.classList.remove("light");
  } catch (_) {}
})();

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  // Bootstrap handles navbar collapse; we only handle active link highlighting per-page
  const year = document.getElementById("year");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const observerTargets = document.querySelectorAll(".section, .card, .chip, .timeline-item, .skill-item, .project-card");

  if (year) year.textContent = new Date().getFullYear();

  // Typing animation for hero section
  const typingText = document.getElementById("typingText");
  if (typingText) {
    const texts = [
      "Full-Stack Developer",
      "React Specialist", 
      "Node.js Expert",
      "Problem Solver",
      "Tech Innovator"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before next text
      }

      setTimeout(typeWriter, typeSpeed);
    }

    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
  }

  // Theme toggle
  function getIsLight() { return document.documentElement.classList.contains("light"); }
  function setTheme(light) {
    document.documentElement.classList.toggle("light", light);
    try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (_) {}
    themeToggle.textContent = light ? "🌙" : "☀️";
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => setTheme(!getIsLight()));
    themeToggle.textContent = getIsLight() ? "🌙" : "☀️";
  }

  // Navbar active link based on current page
  const pathname = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const isActive = href === pathname || (pathname === "index.html" && href === "./");
    if (isActive) link.classList.add("active");
  });

  // Enhanced scroll reveal with staggered animations
  observerTargets.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("in");
        }, index * 100); // Stagger animation
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  observerTargets.forEach(el => io.observe(el));

  // Skill bars animation
  const skillItems = document.querySelectorAll(".skill-item");
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target.querySelector(".skill-progress");
        if (skillBar) {
          const level = entry.target.dataset.level;
          skillBar.style.width = level + "%";
          skillBar.style.setProperty("--width", level + "%");
        }
      }
    });
  }, { threshold: 0.5 });
  skillItems.forEach(item => skillObserver.observe(item));

  // Skills page skill cards animation
  const skillCards = document.querySelectorAll(".skill-card");
  const skillCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target.querySelector(".skill-progress");
        if (skillBar) {
          const level = skillBar.dataset.level;
          setTimeout(() => {
            skillBar.style.width = level + "%";
          }, 500); // Delay for better visual effect
        }
      }
    });
  }, { threshold: 0.3 });
  skillCards.forEach(card => skillCardObserver.observe(card));

  // Counter animation for stats
  const stats = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.textContent;
        const isPercentage = finalValue.includes("%");
        const isPlus = finalValue.includes("+");
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ""));
        
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }
          target.textContent = Math.floor(current) + (isPlus ? "+" : "") + (isPercentage ? "%" : "");
        }, 30);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(stat => statsObserver.observe(stat));

  // Hero card interactive glow
  const heroCard = document.querySelector(".hero-card");
  if (heroCard) {
    heroCard.addEventListener("pointermove", (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroCard.style.setProperty("--mx", x + "%");
      heroCard.style.setProperty("--my", y + "%");
    });
  }

  // Enhanced contact form handler with EmailJS integration
  if (form) {
    // Initialize EmailJS with public key
    (function() {
      emailjs.init("QdB0l-4p1-QOIjvc7"); // EmailJS public key
    })();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const phone = form.querySelector("#phone").value.trim();
      const company = form.querySelector("#company").value.trim();
      const projectType = form.querySelector("#project-type").value;
      const message = form.querySelector("#message").value.trim();

      // Validation
      if (!name || !email || !phone || !message) {
        showFormStatus("Please fill in all required fields.", "error");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus("Please enter a valid email address.", "error");
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^[0-9\-\+\(\)\s]{10,20}$/;
      if (!phoneRegex.test(phone)) {
        showFormStatus("Please enter a valid phone number.", "error");
        return;
      }

      // Show sending state
      showFormStatus("Sending your message...", "info");

      try {
        // Prepare email parameters
        const templateParams = {
          from_name: name,
          from_email: email,
          phone: phone,
          company: company || 'Not specified',
          project_type: projectType || 'Not specified',
          message: message,
          to_email: 'garudujjwal@gmail.com',
          to_name: 'UjjwalKumar Garud',
          reply_to: email
        };

        // Send email using EmailJS
        const response = await emailjs.send(
          'service_p5kynpm',  // Replace with your EmailJS service ID
          'template_dogfcli', // Replace with your EmailJS template ID
          templateParams
        );

        if (response.status === 200) {
          showFormStatus("Message sent successfully! I'll get back to you soon.", "success");
          form.reset();
          
          // Scroll to form status for better UX
          setTimeout(() => {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        showFormStatus("Sorry, there was an error sending your message. Please try again later or contact me directly at garudujjwal@gmail.com", "error");
      }
    });

    function showFormStatus(message, type = 'info') {
      if (!formStatus) return;
      
      formStatus.textContent = message;
      formStatus.className = `form-status ${type}`;
      
      // Auto-hide success message after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 10000);
      }
    }
  }

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add parallax effect to hero background elements
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-element');
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Add hover effects to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Filter functionality for skills
  const skillFilterBtns = document.querySelectorAll('.skill-filters .filter-btn');
  const skillCategories = document.querySelectorAll('.skill-category');
  
  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      skillCategories.forEach(category => {
        if (filter === 'all' || category.dataset.category === filter) {
          category.classList.remove('hidden');
        } else {
          category.classList.add('hidden');
        }
      });
    });
  });

  // Filter functionality for projects
  const projectFilterBtns = document.querySelectorAll('.project-filters .filter-btn');
  const projectCardsAll = document.querySelectorAll('.project-card');
  
  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      projectCardsAll.forEach(card => {
        const categories = card.dataset.category.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Sort functionality for projects
  const sortBtns = document.querySelectorAll('.sort-btn');
  
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      sortBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const sortBy = btn.dataset.sort;
      const projectsGrid = document.querySelector('.projects-grid');
      const cards = Array.from(projectCardsAll);
      
      cards.sort((a, b) => {
        switch(sortBy) {
          case 'name':
            return a.querySelector('.project-title').textContent.localeCompare(b.querySelector('.project-title').textContent);
          case 'popular':
            return b.dataset.sort === 'popular' ? -1 : 1;
          case 'recent':
            return a.dataset.sort === 'recent' ? -1 : 1;
          default:
            return 0;
        }
      });
      
      // Re-append sorted cards
      cards.forEach(card => projectsGrid.appendChild(card));
    });
  });
});

// Certificates: filter, sort, and modal
document.addEventListener('DOMContentLoaded', () => {
  const certFilters = document.querySelectorAll('.certificate-filters .filter-btn');
  const certSortBtns = document.querySelectorAll('.certificate-sort .sort-btn');
  const certGrid = document.querySelector('.certificates-grid');
  const certCards = document.querySelectorAll('.certificate-card');

  // Filter
  certFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      certCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Sort
  certSortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certSortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (!certGrid) return;
      const sortBy = btn.dataset.sort;
      const items = Array.from(certCards).filter(card => card.style.display !== 'none');
      items.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.dataset.name.localeCompare(b.dataset.name);
          case 'issuer':
            return a.dataset.issuer.localeCompare(b.dataset.issuer);
          case 'recent':
          default:
            return parseInt(b.dataset.year || '0', 10) - parseInt(a.dataset.year || '0', 10);
        }
      });
      items.forEach(el => certGrid.appendChild(el));
    });
  });

  // Modal
  const modal = document.getElementById('certificateModal');
  const modalImg = document.getElementById('certificateModalImage');
  const modalTitle = document.getElementById('certificateModalTitle');
  function closeModal() { if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); } }
  function openModal(src, title) {
    if (!modal || !modalImg || !modalTitle) return;
    modalImg.src = src;
    modalImg.alt = title || 'Certificate preview';
    modalTitle.textContent = title || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  document.querySelectorAll('.certificate-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-image') || '';
      const title = btn.getAttribute('data-title') || '';
      openModal(src, title);
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});

// Global functions for button actions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.click();
  }
}

function openContact() {
  scrollToSection('contact');
}

function openEmail() {
  window.location.href = 'mailto:garudujjwal@gmail.com';
}

function openLinkedIn() {
  window.open('https://www.linkedin.com/in/ujjwalkumar-garud-8296222a2', '_blank');
}

function openGitHub() {
  window.open('https://github.com/UjjwalG2104', '_blank');
}

function scheduleCall() {
  // Open Calendly scheduling page in a new tab
  window.open('https://calendly.com/garudujjwal/new-meeting-1', '_blank');
  
  // Optional: You can also use the Calendly popup widget instead
  // Calendly.initPopupWidget({url: 'https://calendly.com/your-calendly-username/30min'});
  // return false;
}

function sharePortfolio() {
  if (navigator.share) {
    navigator.share({
      title: 'Ujjwal Garud - Full-Stack Developer',
      text: 'Check out my portfolio!',
      url: window.location.href
    });
  } else {
    copyLink();
  }
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Check out this amazing portfolio by Ujjwal Garud - Full-Stack Developer!');
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    // Show a temporary notification
    const notification = document.createElement('div');
    notification.textContent = 'Link copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  });
}

function downloadResume() {
  // This would typically download a PDF resume
  alert('Resume download feature coming soon! For now, please contact me at garudujjwal@gmail.com');
}

// FAQ functionality for contact page
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const answer = faqItem.querySelector('.faq-answer');
  const isActive = button.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('active');
    q.parentElement.querySelector('.faq-answer').classList.remove('active');
  });
  
  // Toggle current FAQ item
  if (!isActive) {
    button.classList.add('active');
    answer.classList.add('active');
  }
}

// Scroll to form function
function scrollToForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

// Enhanced contact form with more fields
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const formStatus = document.getElementById('formStatus');
      
      // Basic validation
      const requiredFields = ['name', 'email', 'message'];
      let isValid = true;
      
      requiredFields.forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--accent-5)';
        } else {
          input.style.borderColor = 'var(--border)';
        }
      });
      
      // Email validation
      const email = contactForm.querySelector('[name="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value && !emailRegex.test(email.value)) {
        isValid = false;
        email.style.borderColor = 'var(--accent-5)';
      }
      
      if (!isValid) {
        formStatus.textContent = 'Please fill in all required fields correctly.';
        formStatus.className = 'error';
        return;
      }
      
      // Simulate form submission
      formStatus.textContent = 'Sending message...';
      formStatus.className = 'loading';
      
      setTimeout(() => {
        // Create mailto link with form data
        const subject = `Project Inquiry from ${formData.get('name')}`;
        const projectType = formData.get('project-type') || 'Not specified';
        const budget = formData.get('budget') || 'Not specified';
        const timeline = formData.get('timeline') || 'Not specified';
        const message = formData.get('message');
        
        const emailBody = `
Project Type: ${projectType}
Budget: ${budget}
Timeline: ${timeline}

Message:
${message}

---
Sent from portfolio contact form
        `.trim();
        
        const mailtoLink = `mailto:garudujjwal@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
        
        formStatus.textContent = 'Message sent! Check your email client.';
        formStatus.className = 'success';
        contactForm.reset();
        
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = '';
        }, 5000);
      }, 1500);
    });
  }
  
  // Animate competency bars on scroll
  const competencyBars = document.querySelectorAll('.level-bar');
  if (competencyBars.length > 0) {
    const competencyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
        }
      });
    }, { threshold: 0.5 });
    
    competencyBars.forEach(bar => competencyObserver.observe(bar));
  }
});


