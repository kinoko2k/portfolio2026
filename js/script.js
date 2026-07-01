window.initPortfolio = function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        htmlElement.setAttribute('data-theme', 'light');
    } else {
        htmlElement.removeAttribute('data-theme');
    }

    if (themeToggleBtn) {
        const newBtn = themeToggleBtn.cloneNode(true);
        themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);

        newBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    const menuToggleBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggleBtn && nav) {
        const newMenuBtn = menuToggleBtn.cloneNode(true);
        menuToggleBtn.parentNode.replaceChild(newMenuBtn, menuToggleBtn);

        newMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
            const isOpen = nav.classList.contains('open');
            newMenuBtn.setAttribute('aria-expanded', isOpen);
            
            const lines = newMenuBtn.querySelectorAll('.hamburger-line');
            if (isOpen) {
                lines[0].style.transform = 'translateY(7px) rotate(45deg)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    const lines = newMenuBtn.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('back-to-top');
    const header = document.getElementById('header');

    const handleScroll = () => {
        const scrollY = window.pageYOffset;

        if (header) {
            if (scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-list a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });

    const discordCard = document.getElementById('copy-discord');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    const showToast = (message) => {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    if (discordCard) {
        const newDiscordCard = discordCard.cloneNode(true);
        discordCard.parentNode.replaceChild(newDiscordCard, discordCard);

        newDiscordCard.addEventListener('click', () => {
            const discordID = '@kinoko1216';
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(discordID).then(() => {
                    showToast(`Discord ID (${discordID}) をコピーしました！`);
                }).catch(() => {
                    showToast(`コピー完了: ${discordID}`);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = discordID;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast(`Discord ID (${discordID}) をコピーしました！`);
                } catch (err) {
                    showToast(`コピー完了: ${discordID}`);
                }
                document.body.removeChild(textArea);
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 64;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const achTabs = document.querySelectorAll('.ach-tab');
    const achCards = document.querySelectorAll('.ach-card');
    const moreBtn = document.getElementById('ach-more-btn');
    const moreText = document.getElementById('ach-more-text');

    if (achTabs.length > 0 && achCards.length > 0) {
        let currentCategory = 'all';
        let isExpanded = false;
        const limit = 12;

        const updateAchievementDisplay = () => {
            const matchingCards = Array.from(achCards).filter(card => {
                return currentCategory === 'all' || card.getAttribute('data-category') === currentCategory;
            });

            achCards.forEach(card => {
                if (!matchingCards.includes(card)) {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });

            if (matchingCards.length <= limit) {
                matchingCards.forEach(card => {
                    card.classList.remove('hidden');
                    card.style.display = '';
                });
                if (moreBtn) moreBtn.classList.add('hidden');
            } else {
                if (!isExpanded) {
                    matchingCards.slice(0, limit).forEach(card => {
                        card.classList.remove('hidden');
                        card.style.display = '';
                    });
                    matchingCards.slice(limit).forEach(card => {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    });
                    if (moreBtn) {
                        moreBtn.classList.remove('hidden');
                        if (moreText) moreText.textContent = `もっと見る... (残り${matchingCards.length - limit}件)`;
                    }
                } else {
                    matchingCards.forEach(card => {
                        card.classList.remove('hidden');
                        card.style.display = '';
                    });
                    if (moreBtn) {
                        moreBtn.classList.remove('hidden');
                        if (moreText) moreText.textContent = '折りたたむ -';
                    }
                }
            }
        };

        updateAchievementDisplay();

        achTabs.forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);

            newTab.addEventListener('click', () => {
                document.querySelectorAll('.ach-tab').forEach(t => t.classList.remove('active'));
                newTab.classList.add('active');
                currentCategory = newTab.getAttribute('data-target');
                isExpanded = false;
                updateAchievementDisplay();
            });
        });

        if (moreBtn) {
            const newMoreBtn = moreBtn.cloneNode(true);
            moreBtn.parentNode.replaceChild(newMoreBtn, moreBtn);

            newMoreBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                updateAchievementDisplay();
                if (!isExpanded) {
                    const achSection = document.getElementById('achievement');
                    if (achSection) {
                        const headerOffset = 64;
                        const elementPosition = achSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                }
            });
        }
    }
};

document.addEventListener('portfolioLoaded', window.initPortfolio);
