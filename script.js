document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Services Filter Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.getAttribute('data-tab');

            serviceCards.forEach(card => {
                if (tab === 'all') {
                    card.style.display = 'flex';
                } else if (card.getAttribute('data-category') === tab) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Interactive Instant Quote Estimator
    const servicePills = document.querySelectorAll('#calcServiceType .pill-btn');
    const calcSize = document.getElementById('calcSize');
    const addCarpet = document.getElementById('addCarpet');
    const addOven = document.getElementById('addOven');
    const addUrgent = document.getElementById('addUrgent');
    const displayEstimate = document.getElementById('displayEstimate');
    const summaryService = document.getElementById('summaryService');
    const summarySize = document.getElementById('summarySize');
    const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');

    let currentService = 'tenancy';
    let currentServiceName = 'End of Tenancy Clean';

    // Pricing Matrix (GBP Base Ranges for London & Surrounds)
    const basePricing = {
        tenancy: {
            'studio': [130, 160],
            '1bed': [160, 210],
            '2bed': [210, 280],
            '3bed': [280, 370],
            '4bed': [370, 520]
        },
        commercial: {
            'studio': [80, 120],
            '1bed': [140, 200],
            '2bed': [220, 320],
            '3bed': [350, 500],
            '4bed': [500, 850]
        },
        builders: {
            'studio': [180, 240],
            '1bed': [240, 320],
            '2bed': [320, 440],
            '3bed': [440, 600],
            '4bed': [600, 950]
        },
        refurb: {
            'studio': [1500, 3500],
            '1bed': [3500, 7500],
            '2bed': [6500, 14000],
            '3bed': [12000, 25000],
            '4bed': [22000, 50000]
        },
        painting: {
            'studio': [350, 600],
            '1bed': [600, 1100],
            '2bed': [1100, 1800],
            '3bed': [1800, 2800],
            '4bed': [2800, 4500]
        }
    };

    function updateQuote() {
        const sizeKey = calcSize.value;
        const sizeName = calcSize.options[calcSize.selectedIndex].text;
        
        let [minPrice, maxPrice] = basePricing[currentService][sizeKey] || [150, 200];

        // Add-ons
        let addonsText = [];
        if (addCarpet && addCarpet.checked) {
            minPrice += 45;
            maxPrice += 65;
            addonsText.push('Carpet Steam Cleaning');
        }
        if (addOven && addOven.checked) {
            minPrice += 35;
            maxPrice += 45;
            addonsText.push('Deep Oven Clean');
        }
        if (addUrgent && addUrgent.checked) {
            minPrice += 40;
            maxPrice += 60;
            addonsText.push('Priority Booking');
        }

        // Format Currency
        const isHighValue = minPrice >= 1000;
        const formattedMin = isHighValue ? `£${minPrice.toLocaleString('en-GB')}` : `£${minPrice}`;
        const formattedMax = isHighValue ? `£${maxPrice.toLocaleString('en-GB')}` : `£${maxPrice}`;

        if (displayEstimate) {
            displayEstimate.textContent = `${formattedMin} - ${formattedMax}`;
        }
        if (summaryService) {
            summaryService.textContent = currentServiceName;
        }
        if (summarySize) {
            summarySize.textContent = sizeName;
        }

        // Update WhatsApp CTA Link with Pre-filled Message
        if (whatsappQuoteBtn) {
            let msg = `Hello Crown Janitorial Services!%0A%0A`;
            msg += `I would like to book/confirm a quote based on your website estimator:%0A`;
            msg += `• *Service:* ${encodeURIComponent(currentServiceName)}%0A`;
            msg += `• *Property Size:* ${encodeURIComponent(sizeName)}%0A`;
            if (addonsText.length > 0) {
                msg += `• *Add-ons:* ${encodeURIComponent(addonsText.join(', '))}%0A`;
            }
            msg += `• *Estimated Range:* ${formattedMin} - ${formattedMax}%0A%0A`;
            msg += `Please let me know your earliest availability. Thank you!`;

            whatsappQuoteBtn.href = `https://wa.me/447497121829?text=${msg}`;
        }
    }

    // Pill Button Switchers
    servicePills.forEach(pill => {
        pill.addEventListener('click', () => {
            servicePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentService = pill.getAttribute('data-type');
            currentServiceName = pill.textContent;
            updateQuote();
        });
    });

    if (calcSize) calcSize.addEventListener('change', updateQuote);
    if (addCarpet) addCarpet.addEventListener('change', updateQuote);
    if (addOven) addOven.addEventListener('change', updateQuote);
    if (addUrgent) addUrgent.addEventListener('change', updateQuote);

    // Initial calculation
    updateQuote();

    // 4. Hero Quick Form Submission to WhatsApp
    const heroQuickForm = document.getElementById('heroQuickForm');
    if (heroQuickForm) {
        heroQuickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const service = document.getElementById('quickService').value;
            const postcode = document.getElementById('quickPostcode').value;
            const phone = document.getElementById('quickPhone').value;

            let msg = `Hello Crown Janitorial Services!%0A%0A`;
            msg += `*New Quick Survey Request:*%0A`;
            msg += `• *Service:* ${encodeURIComponent(service)}%0A`;
            msg += `• *Location/Postcode:* ${encodeURIComponent(postcode)}%0A`;
            msg += `• *Contact Phone:* ${encodeURIComponent(phone)}%0A%0A`;
            msg += `Please provide a free quote and survey options.`;

            window.open(`https://wa.me/447497121829?text=${msg}`, '_blank');
        });
    }

    // 5. Contact Form Submission to WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const postcode = document.getElementById('contactPostcode').value;
            const service = document.getElementById('contactService').value;
            const message = document.getElementById('contactMessage').value;

            let msg = `Hello Crown Janitorial Services!%0A%0A`;
            msg += `*New Enquiry from Website:*%0A`;
            msg += `• *Client Name:* ${encodeURIComponent(name)}%0A`;
            msg += `• *Phone / WhatsApp:* ${encodeURIComponent(phone)}%0A`;
            msg += `• *Location/Postcode:* ${encodeURIComponent(postcode)}%0A`;
            msg += `• *Service Required:* ${encodeURIComponent(service)}%0A`;
            if (message.trim()) {
                msg += `• *Project Details:* ${encodeURIComponent(message)}%0A`;
            }
            msg += `%0APlease contact me with a quote.`;

            window.open(`https://wa.me/447497121829?text=${msg}`, '_blank');
        });
    }

    // 6. Header Shadow on Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.boxShadow = '0 4px 20px rgba(10, 25, 47, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
    });
});
