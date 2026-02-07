// ===========================
// MOBILE NAVIGATION TOGGLE
// ===========================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// ===========================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// FORM SUBMISSION HANDLER (BREVO)
// ===========================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || 'Not provided',
            organization: document.getElementById('organization').value || 'Not provided',
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value || 'No message provided'
        };
        
        // Prepare email content
        const emailSubject = `New Contact from ${formData.firstName} ${formData.lastName} - ${formData.interest}`;
        const emailBody = `
New contact form submission from Future Faster Sports website:

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Organization: ${formData.organization}
Primary Interest: ${formData.interest}

Message:
${formData.message}
        `.trim();
        
        try {
            // Option 1: Using Brevo (Sendinblue) API
            // You'll need to replace 'YOUR_BREVO_API_KEY' with your actual API key
            // And 'your-email@futurefastersports.com' with your receiving email
            
            /* UNCOMMENT AND CONFIGURE WHEN YOU HAVE BREVO API KEY
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': 'YOUR_BREVO_API_KEY', // Replace with your Brevo API key
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email
                    },
                    to: [
                        {
                            email: 'your-email@futurefastersports.com', // Replace with your email
                            name: 'Future Faster Sports'
                        }
                    ],
                    subject: emailSubject,
                    htmlContent: emailBody.replace(/\n/g, '<br>')
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            */
            
            // Option 2: Using Formspree (simpler, no API key needed for basic use)
            // Sign up at formspree.io and replace 'YOUR_FORM_ID' with your form ID
            
            const response = await fetch('https://formspree.io/f/mwvnkrgw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to send form');
            }
            
            // Success message
            showNotification('Thank you! Your message has been sent successfully. We\'ll be in touch soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Sorry, there was an error sending your message. Please try emailing us directly at info@futurefastersports.com', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.5rem 2rem;
        background: ${type === 'success' ? '#0066CC' : '#CC0000'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.4s ease;
        font-weight: 500;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// ===========================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.pillar-card, .stat-item, .feature-list li');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===========================
// LOGO ERROR HANDLING
// ===========================

const logoImg = document.getElementById('logo-img');
if (logoImg) {
    logoImg.addEventListener('error', function() {
        // If logo image fails to load, hide it gracefully
        this.style.display = 'none';
    });
}
