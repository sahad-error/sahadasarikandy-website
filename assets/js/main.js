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