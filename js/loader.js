document.addEventListener('DOMContentLoaded', async () => {
    const sections = [
        'header',
        'hero',
        'about',
        'hobby',
        'skills',
        'achievement',
        'history',
        'sns',
        'specialthanks',
        'footer'
    ];

    const loadPromises = sections.map(async (section) => {
        const placeholder = document.getElementById(`${section}-placeholder`);
        if (!placeholder) return;

        try {
            const response = await fetch(`sections/${section}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlText = await response.text();
            placeholder.innerHTML = htmlText;
        } catch (error) {
            console.error(`Error loading section ${section}:`, error);

            if (section === 'hero') {
                placeholder.innerHTML = `
                    <section class="section">
                    </section>
                `;
            }
        }
    });

    await Promise.all(loadPromises);

    if (typeof window.initPortfolio === 'function') {
        window.initPortfolio();
    } else {
        window.dispatchEvent(new Event('portfolioLoaded'));
    }
});
