// Contact form handling
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Initialize EmailJS
(function() {
  emailjs.init("QdB0l-4p1-QOIjvc7"); // Your EmailJS public key
})();

// Form submission handler
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    showFormStatus('Sending your message...', 'info');
    
    // Get form data
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const company = form.company ? form.company.value.trim() : '';
    const projectType = form['project-type'] ? form['project-type'].value : 'Not specified';
    const message = form.message.value.trim();
    
    // Basic validation
    if (!name || !email || !phone || !message) {
      showFormStatus('Please fill in all required fields.', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9\-\+\(\)\s]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      showFormStatus('Please enter a valid phone number.', 'error');
      return;
    }

    try {
      // Prepare email parameters
      const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        company: company || 'Not specified',
        project_type: projectType,
        message: message,
        to_email: 'garudujjwal@gmail.com',
        to_name: 'UjjwalKumar Garud',
        reply_to: email
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_p5kynpm',  // Your EmailJS service ID
        'template_dogfcli', // Your EmailJS template ID
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
}

// Show form status message
function showFormStatus(message, type = 'info') {
  if (!formStatus) return;
  
  formStatus.textContent = message;
  formStatus.className = 'form-status';
  formStatus.classList.add(type);
  formStatus.style.display = 'block';
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      formStatus.style.opacity = '0';
      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.style.opacity = '1';
      }, 300);
    }, 5000);
  }
}

// Contact method handlers
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
  window.open('https://calendly.com/your-calendly-username/30min', '_blank');
  
  // Optional: Uncomment to use Calendly popup widget instead
  // Calendly.initPopupWidget({url: 'https://calendly.com/your-calendly-username/30min'});
  // return false;
}

// Initialize any contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add any initialization code here
});
