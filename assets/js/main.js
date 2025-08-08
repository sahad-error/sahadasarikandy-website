/*===== MENU TOGGLE =====*/
const showMenu = (toggleId, menuId) => {
    const toggle = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
            toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
        });
    }
};
showMenu('sahad-toggle', 'sahad-menu');

/*===== CLOSE MOBILE MENU ON LINK CLICK =====*/
const navLinks = document.querySelectorAll('.sahad__link');

const closeMenu = () => {
    const menu = document.getElementById('sahad-menu');
    menu.classList.remove('show');
    document.getElementById('sahad-toggle').setAttribute('aria-expanded', 'false');
};

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

/*===== ACTIVE LINK ON SCROLL =====*/
const setActiveLink = () => {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.sahad__menu a[href*="${sectionId}"]`);

        if (navLink) { // Ensure the navLink exists before trying to modify its class
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
};

window.addEventListener('scroll', setActiveLink);

/*===== SCROLL REVEAL ANIMATIONS =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1000,
    delay: 200,
    reset: false,
    mobile: false
});

// Configure animations
sr.reveal('.home__data, .about__img', { origin: 'left' });
sr.reveal('.home__img, .about__text', { origin: 'right', delay: 400 });
sr.reveal('.home__social-icon', { interval: 200, origin: 'bottom' });
sr.reveal('.skills__data, .work__item, .contact__card', { interval: 150 });

/*===== DARK MODE TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const getCurrentTheme = () => localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
};

// Initialize theme
setTheme(getCurrentTheme());

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

/*===== CONTACT FORM HANDLING =====*/
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span><i class="bx bx-loader bx-spin"></i>';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://formspree.io/f/xdkddnrq', {
                method: 'POST',
                body: formData,
                // Do NOT set Content-Type header when sending FormData,
                // the browser will set it correctly (multipart/form-data)
                headers: { 
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                submitButton.innerHTML = '<span>Sent!</span><i class="bx bx-check"></i>';
                contactForm.reset();
                // Redirect to thank you page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'thankyou.html';
                }, 1500);
            } else {
                const errorData = await response.json();
                console.error('Formspree error response:', errorData); // Log Formspree's error response
                throw new Error(errorData.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error during form submission:', error); // Log the caught error
            submitButton.innerHTML = '<span>Error! Try Again</span><i class="bx bx-error"></i>';
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 3000);
        }
    });
}

/*===== RESUME IFRAME HANDLING =====*/
const resizeIframe = (iframe) => {
    try {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                // Ensure there's a valid scrollHeight before setting height
                if (iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight) {
                    iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight + 20}px`;
                }
            }
        });
        
        // Observe the body of the iframe's content
        if (iframe.contentWindow && iframe.contentWindow.document.body) {
            resizeObserver.observe(iframe.contentWindow.document.body);
        } else {
            console.warn('Iframe contentWindow or document.body not available for ResizeObserver.');
            iframe.style.height = '1200px'; // Fallback height
        }
    } catch (e) {
        console.warn('Iframe resize error (likely cross-origin):', e);
        iframe.style.height = '1200px'; // Fallback height
    }
};

// Initialize iframe when loaded
const resumeIframe = document.getElementById('resumeIframe');
if (resumeIframe) {
    resumeIframe.addEventListener('load', () => resizeIframe(resumeIframe));
}

/*===== PDF DOWNLOAD HANDLER =====*/
const downloadPdf = async (e) => {
    // Only proceed if the clicked element or its ancestor has the 'download-button' class
    const downloadBtn = e.target.closest('.download-button');
    if (!downloadBtn || downloadBtn.id !== 'downloadPdfBtn') return; // Added ID check to be specific

    e.preventDefault(); // Prevent default link behavior for programmatic download

    const originalText = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Preparing PDF...';
    
    try {
        // Try direct download first (assuming 'Sahad_Asarikandy_Resume.pdf' is in the root or assets folder)
        const pdfFileName = 'Sahad_Asarikandy_Resume.pdf'; // Or specify full path if not in root
        const pdfResponse = await fetch(pdfFileName);
        
        if (pdfResponse.ok) {
            const pdfBlob = await pdfResponse.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = pdfFileName; // Set the download filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 100); // Clean up the URL object
            
            downloadBtn.innerHTML = '<i class="bx bx-check"></i> Downloaded!'; // Success message
        } else {
            console.warn(`Direct PDF download failed: ${pdfResponse.status} ${pdfResponse.statusText}`);
            throw new Error('PDF file not found or accessible directly.');
        }
    } catch (error) {
        console.error('Error during PDF download:', error);
        alert('Failed to download PDF. Please ensure the file exists and is accessible, or try again later.');
        // Fallback or error state
        downloadBtn.innerHTML = '<i class="bx bx-error"></i> Download Failed';
    } finally {
        setTimeout(() => { // Revert button after a short delay
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalText;
        }, 2000);
    }
};

// Ensure the download button has an ID for specific targeting if multiple buttons exist
// Add an ID to your download button in index.html: <a href="Sahad_Asarikandy_Resume.pdf" id="downloadPdfBtn" download="Sahad_Asarikandy_Resume.pdf" class="download-button">
document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPdf); // Use optional chaining for safety

/*===== PERFORMANCE OPTIMIZATIONS =====*/
// Debounce scroll events
const debounce = (func, wait = 100) => {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};
// Animate skill bars on scroll
document.addEventListener('DOMContentLoaded', function() {
  const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skills__progress');
    
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width + '%';
    });
  };

  // Intersection Observer for scroll animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.querySelector('.skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
});
// Update copyright year automatically
document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Add animation to footer icons on page load
    const footerIcons = document.querySelectorAll('.footer__icon');
    footerIcons.forEach((icon, index) => {
        icon.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1 + 0.5}s`;
    });
});
// Add this to your CSS or in a style tag
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);

window.addEventListener('scroll', debounce(setActiveLink));

// Load non-critical resources after page load
window.addEventListener('load', () => {
    // Lazy load iframe if needed - it's already set with src="resume1.html" in HTML,
    // so this part might be redundant unless you plan to dynamically set src.
    // If resume1.html content is very large, consider a more robust lazy loading strategy.
    
    // Ensure html2pdf is loaded only when needed (e.g., if direct PDF download fails)
    // The previous implementation attempts direct download first, which is good.
    // html2pdf is only needed as a fallback or for dynamic PDF generation.
    // It's generally better to load it only when the user explicitly triggers a complex PDF generation.
    // For a simple static PDF download, direct anchor link is sufficient and more performant.
    // Keeping the current structure, but noting that html2pdf might not be strictly necessary
    // unless 'resume.pdf' is generated on the fly from 'resume1.html'.
    // If 'Sahad_Asarikandy_Resume.pdf' is a static file, you don't need html2pdf.
});
// Add this at the bottom of main.js
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
});

async function checkLoginStatus() {
    try {
        const response = await fetch('/assets/php/auth.php?check=1');
        const data = await response.json();
        
        const loginNavItem = document.getElementById('loginNavItem');
        if (loginNavItem) {
            if (data.loggedIn) {
                loginNavItem.innerHTML = `
                    <a href="personal.html" class="sahad__link">Personal</a>
                    <a href="/assets/php/logout.php" class="sahad__link" style="margin-left: 10px;">Logout</a>
                `;
            } else {
                loginNavItem.innerHTML = '<a href="login.html" class="sahad__link">Login</a>';
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

// Add this to your main.js file
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});
