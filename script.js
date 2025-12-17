
        // Telegram Bot Configuration
        const TELEGRAM_BOT_TOKEN = '8506936494:AAEH2yC8n3K3VnlDCymi8lhLow3Lz1TlDVY';
        const TELEGRAM_CHAT_ID = '1763799064'; // Your Telegram user ID
        
        // DOM Elements
        const navbar = document.querySelector('.navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const successModal = document.getElementById('successModal');
        const closeModal = document.querySelector('.close-modal');
        
        // Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Mobile Navigation Toggle
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Active Navigation Link
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
        
        // Contact Form Submission with Telegram Integration
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim() || 'Not provided',
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toLocaleString(),
                ip: await getClientIP()
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable submit button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Send to Telegram Bot
                const telegramMessage = formatTelegramMessage(formData);
                const telegramSent = await sendToTelegram(telegramMessage);
                
                if (telegramSent) {
                    // Show success modal
                    successModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Log to console (for debugging)
                    console.log('Form submitted successfully:', formData);
                    console.log('Telegram message sent');
                } else {
                    throw new Error('Failed to send message to Telegram');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showAlert('There was an error sending your message. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        });
        
        // Format Telegram message
        function formatTelegramMessage(data) {
            return `🚀 *New Contact Form Submission*
            
👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone}
🎯 *Subject:* ${data.subject}
💬 *Message:*
${data.message}

⏰ *Time:* ${data.timestamp}
🌐 *IP:* ${data.ip}
📍 *From:* Portfolio Website`;
        }
        
        // Send message to Telegram
        async function sendToTelegram(message) {
            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown',
                        disable_web_page_preview: true
                    })
                });
                
                const result = await response.json();
                return result.ok === true;
            } catch (error) {
                console.error('Telegram API error:', error);
                return false;
            }
        }
        
        // Get client IP (using a free API)
        async function getClientIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                return 'Unknown';
            }
        }
        
        // Email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Show alert message
        function showAlert(message, type = 'info') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'error' ? '#ef4444' : '#10b981'}; color: white; padding: 15px 25px; border-radius: 12px; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: fadeInUp 0.3s ease;">
                    <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i> ${message}
                </div>
            `;
            document.body.appendChild(alertDiv);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
        
        // Close modal
        closeModal.addEventListener('click', () => {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Animate elements on scroll
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
        
        // Observe elements for animation
        document.querySelectorAll('.timeline-item, .skill-category, .contact-item').forEach(el => {
            observer.observe(el);
        });
        
        // Initialize animations
        document.addEventListener('DOMContentLoaded', () => {
            // Add initial animation classes
            document.querySelectorAll('.timeline-item, .skill-category, .contact-item').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        });
