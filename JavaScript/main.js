const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
});

class Dot {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.speed = 0.08;
    }

    update() {
        let dx = mouse.x - this.baseX;
        let dy = mouse.y - this.baseY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        let maxDist = 380;
        if (dist < maxDist) {
            let force = (maxDist - dist) / maxDist;
            this.x += (this.baseX - dx * force * 0.12 - this.x) * this.speed;
            this.y += (this.baseY - dy * force * 0.12 - this.y) * this.speed;
        } else {
            this.x += (this.baseX - this.x) * this.speed;
            this.y += (this.baseY - this.y) * this.speed;
        }
    }
}

let dots = [];
const spacing = 55;

function init() {
    dots = [];
    for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
            dots.push(new Dot(x, y));
        }
    }
}
init();
window.addEventListener('resize', init);

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.022)';
    ctx.fillStyle = 'rgba(0, 242, 254, 0.12)';
    ctx.lineWidth = 1;

    let cols = Math.ceil((width + spacing) / spacing);
    let rows = Math.ceil((height + spacing) / spacing);

    for (let i = 0; i < dots.length; i++) {
        dots[i].update();
    }

    for (let c = 0; c < cols - 1; c++) {
        for (let r = 0; r < rows - 1; r++) {
            let idx = c * rows + r;
            let rightIdx = (c + 1) * rows + r;
            let bottomIdx = c * rows + (r + 1);

            if (dots[idx] && dots[rightIdx] && dots[bottomIdx]) {
                ctx.beginPath();
                ctx.moveTo(dots[idx].x, dots[idx].y);
                ctx.lineTo(dots[rightIdx].x, dots[rightIdx].y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(dots[idx].x, dots[idx].y);
                ctx.lineTo(dots[bottomIdx].x, dots[bottomIdx].y);
                ctx.stroke();
            }
        }
    }

    dots.forEach(dot => {
        let dx = mouse.x - dot.x;
        let dy = mouse.y - dot.y;
        let d = Math.sqrt(dx*dx + dy*dy);
        if(d < 180) {
            ctx.fillStyle = `rgba(0, 242, 254, ${0.4 * (1 - d/180)})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    requestAnimationFrame(animate);
}
animate();

const header = document.querySelector('.main-header');
const heroImg = document.querySelector('.parallax-img');
const heroContent = document.querySelector('.hero-content');
const cards = document.querySelectorAll('.card-content');

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    let currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
    
    lastScrollY = currentScrollY;
    
    if (window.innerWidth > 1024) {
        heroImg.style.transform = `translateY(${currentScrollY * 0.4}px) scale(${1 + currentScrollY * 0.0002})`;
        heroContent.style.transform = `translateY(${currentScrollY * 0.15}px)`;
        heroContent.style.opacity = `${1 - currentScrollY * 0.0015}`;
    }
});

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        const angleX = (yc - y) / 12;
        const angleY = (x - xc) / 12;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const flowContainer = document.querySelector('.process-flow-container');
    
    if (!flowContainer) return;

    const itemsAndArrows = flowContainer.querySelectorAll('.flow-item, .flow-arrow');

    const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                itemsAndArrows.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, index * 120); 
                });
                flowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    flowObserver.observe(flowContainer);
});


document.addEventListener("DOMContentLoaded", () => {
    const businessCards = document.querySelectorAll('.business-card');

    businessCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 7;  
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const priceRows = document.querySelectorAll('.table-row');

    priceRows.forEach(row => {
        row.addEventListener('mousemove', (e) => {
            const rect = row.getBoundingClientRect();
            
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            row.style.setProperty('--mouse-x', `${x}px`);
            row.style.setProperty('--mouse-y', `${y}px`);

            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            
            const rotateX = ((centerY - y) / centerY) * 3.5;
            const rotateY = ((x - centerX) / centerX) * 2;

            row.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const ctaCards = document.querySelectorAll('.contact-card');

    ctaCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((centerY - y) / centerY) * 6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
});