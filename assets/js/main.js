/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, sahadId) =>{
    const toggle = document.getElementById(toggleId),
    sahad = document.getElementById(sahadId)

    if(toggle && sahad){
        toggle.addEventListener('click', ()=>{
            sahad.classList.toggle('show')
        })
    }
}
showMenu('sahad-toggle','sahad-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const sahadLink = document.querySelectorAll('.sahad__link')

function linkAction(){
    const sahadMenu = document.getElementById('sahad-menu')
    // When we click on each sahad__link, we remove the show-menu class
    sahadMenu.classList.remove('show')
}
sahadLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.sahad__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/*===== CONTACT FORM HANDLING =====*/
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    
    // Using Formspree.io for form submission (free service)
    fetch('https://formspree.io/f/xdkddnrq', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Redirect to thank you page
            window.location.href = 'thankyou.html';
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem sending your message. Please try again.');
    });
});

// main.js

// Function to dynamically resize the iframe based on its content
function resizeIframe(iframe) {
    try {
        // Access the document inside the iframe
        const iframeDoc = iframe.contentWindow.document;
        
        // Use setTimeout to allow all content (including images) to render
        // before calculating height. Adjust delay if needed.
        setTimeout(() => {
            // Get the scrollHeight of the body content within the iframe
            // Add a small buffer (e.g., 20px) to prevent scrollbars from appearing due to rendering differences
            iframe.style.height = (iframeDoc.body.scrollHeight + 20) + 'px';
        }, 100); // 100ms delay
        
    } catch (e) {
        // This catch block handles potential "DOMException: Blocked a frame from accessing a cross-origin frame."
        // if resume1.html is not served from the same origin.
        console.warn("Could not resize iframe due to cross-origin restrictions or content not loaded:", e);
        // Fallback: set a default height or keep a fixed height if dynamic sizing isn't possible
        iframe.style.height = '1200px'; // A reasonable default height
    }
}


// Event listener for the PDF download button
document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    // Get the iframe element
    const resumeIframe = document.getElementById('resumeIframe');

    // Check if the iframe content is loaded and accessible (same-origin policy applies)
    if (resumeIframe && resumeIframe.contentWindow) {
        // Select the main resume content container within the iframe's document
        // Assuming the resume content in resume1.html is within a div with class 'container'
        const element = resumeIframe.contentWindow.document.querySelector('.container'); 
        
        if (element) {
            // Configuration options for html2pdf library
            const opt = {
                margin:       0.5, // Set margins for the PDF document (in inches)
                filename:     'Sahad_Asarikandy_Resume.pdf', // Define the filename for the downloaded PDF
                image:        { type: 'jpeg', quality: 0.98 }, // Image quality settings for the PDF
                html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true }, // html2canvas specific options
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' } // jsPDF specific options (unit, format, orientation)
            };

            // Generate the PDF from the selected HTML element and save it to the user's device
            html2pdf().set(opt).from(element).save();
        } else {
            console.error("Could not find the '.container' element inside the iframe for PDF generation.");
            // You might want to show a user-friendly message here instead of just console.error
        }
    } else {
        console.error("Iframe content not accessible or iframe not found.");
        // You might want to show a user-friendly message here
    }
});

// ========== RESUME IFRAME AUTO-RESIZE ==========
function resizeIframe(iframe) {
    try {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    } catch (e) {
        console.warn('Iframe resize blocked due to CORS or same-origin policy.');
    }
}

// ========== RESUME PDF DOWNLOAD HANDLER ==========
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadPdfBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Option 1: Direct link to static PDF
            window.open('resume.pdf', '_blank');

            // Option 2: If you want to use html2pdf for a local embedded resume:
            // const resumeContent = document.querySelector('.resume__content');
            // html2pdf().from(resumeContent).save('Sahad_Asarikandy_Resume.pdf');
        });
    }
});
