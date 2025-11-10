document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                company: document.getElementById('company').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                projectType: document.getElementById('project-type').value,
                budget: document.getElementById('budget').value,
                timeline: document.getElementById('timeline').value,
                message: document.getElementById('message').value.trim()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                showStatus('Please fill in all required fields', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Success
                    showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    // Server returned an error
                    const errorMsg = data.message || 'Failed to send message. Please try again.';
                    showStatus(errorMsg, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showStatus('An error occurred. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showStatus(message, type = 'info') {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.style.opacity = '1';
                }, 500);
            }, 5000);
        }
    }
});
