// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    // GSAP ScrollTrigger Integration
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on lenis scroll
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)


    const navBar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
    });



    // Works Reel Navigation
    const worksReel = document.getElementById('works-reel');
    const worksPrev = document.getElementById('works-prev');
    const worksNext = document.getElementById('works-next');

    if (worksReel && worksPrev && worksNext) {
        const slides = worksReel.querySelectorAll('.works-slide');
        let currentIndex = 0;
        const visibleSlides = () => window.innerWidth <= 900 ? 1 : 3;
        const maxIndex = () => Math.max(0, slides.length - visibleSlides());

        const updateReel = () => {
            const slideWidth = slides[0].offsetWidth;
            worksReel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        worksPrev.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateReel();
        });

        worksNext.addEventListener('click', () => {
            currentIndex = Math.min(maxIndex(), currentIndex + 1);
            updateReel();
        });

        window.addEventListener('resize', () => {
            currentIndex = Math.min(currentIndex, maxIndex());
            updateReel();
        });
    }

    // 1. Initial Load Hero Animation
    const heroTimeline = gsap.timeline();

    heroTimeline.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
    })
    .from(".hero-img-wrapper", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 1,
        ease: "power3.inOut"
    }, "-=0.8")
    .from(".hero-img-wrapper img", {
        scale: 1.3,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1")
    .from(".hero-meta p", {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5")
    .from(".hero-desc", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.8");

    // 2. Sections Reveal on Scroll
    const revealElements = document.querySelectorAll('.gs-reveal');

    revealElements.forEach((elem) => {
        if(elem.classList.contains('section-hero')) return;

        gsap.fromTo(elem, {
            autoAlpha: 0,
            y: 60
        }, {
            duration: 1,
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        const title = elem.querySelector('.section-title');
        if(title) {
            gsap.fromTo(title, {
                clipPath: "inset(0 100% 0 0)"
            }, {
                clipPath: "inset(0 0% 0 0)",
                duration: 1.2,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 80%"
                }
            });
        }
    });

    // 3. Staggered Grid Interactions
    const targetGrids = document.querySelectorAll('.grid-layout, .cert-grid, .timeline, .contact-footer-grid');
    targetGrids.forEach(grid => {
        const children = grid.children;
        if(children.length > 0) {
            gsap.from(children, {
                opacity: 0,
                y: 50,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%"
                }
            });
        }
    });

    // Image parallax effects
    const imgWrappers = document.querySelectorAll(".img-container, .img-wrapper, .project-img");

    imgWrappers.forEach(wrapper => {
        const img = wrapper.querySelector("img");
        if(img) {
            gsap.to(img, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    });

    // Skills line animation
    const skillLines = document.querySelectorAll(".skill-line");
    if(skillLines.length > 0) {
        gsap.from(skillLines, {
            width: "0%",
            duration: 1.5,
            ease: "power3.inOut",
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".skills-list",
                start: "top 80%"
            }
        });
    }
    // Mobile Navbar & Smooth Scroll for Links
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const scrollLinks = document.querySelectorAll('.scroll-link');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if(navLinks.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            }

            lenis.scrollTo(targetId, {
                offset: -80,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });

    // Modal Interaction
    const modal = document.getElementById('cert-modal');
    const modalClose = document.querySelector('.modal-close');
    const certItems = document.querySelectorAll('.cert-item');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');

    if(modal && modalClose) {
        certItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.getAttribute('data-title');
                const year = item.getAttribute('data-year');
                if(title) modalTitle.textContent = title;
                if(year) modalYear.textContent = year;
                
                modal.classList.add('show');
                gsap.fromTo('.modal-content', {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.4, ease: "power2.out"});
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // Project Gallery Modal Interactive
    const pModal = document.getElementById('project-modal');
    const pModalClose = document.getElementById('project-modal-close');
    const pModalTitle = document.getElementById('project-modal-title');
    const pModalDesc = document.getElementById('project-modal-desc');
    const pModalImg = document.getElementById('project-modal-image');
    
    // Sample detailed text for the projects
    const pDetails = {
        'SFMC CAMPAIGNS': 'Developed end-to-end automated customer journeys using Journey Builder and Automation Studio. Leveraged AMPscript to create deeply personalized, dynamic email content resulting in a 40% increase in click-through rates. Integrated custom data extensions to manage complex relational models.',
        'FULL STACK APP': 'Designed and implemented a responsive, high-performance web application. Built the backend RESTful API with Java and Spring Boot, utilizing a MySQL database for robust data persistence. The frontend was built with modern Javascript frameworks ensuring a seamless user experience.',
        'ANALYTICS DASHBOARD': 'Engineered a real-time data analytics dashboard connecting multiple disparate data sources into a single, cohesive interface. Created interactive charts and custom reporting tools, reducing data analysis time by 60% for key stakeholders.',
        'B2B E-COMMERCE': 'Developed a secure B2B purchasing platform tailored for wholesale distributors. Implemented complex, tier-based dynamic pricing algorithms and integrated a custom inventory management system to automatically sync stock levels and prevent overselling.'
    };

    const slices = document.querySelectorAll('.accordion-slice');
    if(pModal && slices.length > 0) {
        slices.forEach(slice => {
            slice.addEventListener('click', () => {
                const titleStr = slice.querySelector('h3').innerText;
                const imgSrc = slice.querySelector('img').src;

                pModalTitle.innerText = titleStr;
                pModalImg.src = imgSrc;
                pModalDesc.innerText = pDetails[titleStr] || 'Detailed project overview, tech stack features, and overall outcomes are described here.';
                
                pModal.classList.add('show');
                gsap.fromTo(pModal.querySelector('.modal-content'), {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.4, ease: "power2.out"});
            });
        });

        pModalClose.addEventListener('click', () => {
            pModal.classList.remove('show');
        });
        pModal.addEventListener('click', (e) => {
            if(e.target === pModal) pModal.classList.remove('show');
        });
    }

    // Interactive Flashlight Marquee Logic
    const interDiv = document.getElementById('interactive-divider');
    const fgTrack = document.getElementById('fg-track');
    
    if (interDiv && fgTrack) {
        interDiv.addEventListener('mousemove', (e) => {
            const rect = interDiv.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // On mouse move, smoothly update the clip path to follow cursor
            gsap.to(fgTrack, {
                clipPath: `circle(150px at ${x}px ${y}px)`,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        interDiv.addEventListener('mouseleave', () => {
            // When mouse leaves, collapse the flashlight
            gsap.to(fgTrack, {
                clipPath: `circle(0px at 50% 50%)`,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    }
});
