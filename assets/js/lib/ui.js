const mouseTrackingGlow = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const mainElement = document.getElementById('main-element');
        const navigationElement = document.querySelector('.main-navigation');
        const workHistory = document.querySelector('.work-history');


        const handleMouseMove = (e) => {

            const rect = mainElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            mainElement.style.setProperty('--x', `${x}px`);
            mainElement.style.setProperty('--y', `${y}px`);

            // Navigation
            const navRect = navigationElement.getBoundingClientRect();
            const navX = x - (navRect.left - rect.left);
            const navY = y - (navRect.top - rect.top);
            navigationElement.style.setProperty('--x', `${navX}px`);
            navigationElement.style.setProperty('--y', `${navY}px`);

            // Work History
            const workRect = workHistory.getBoundingClientRect();
            const workX = x - (workRect.left - rect.left);
            const workY = y - (workRect.top - rect.top);
            workHistory.style.setProperty('--x', `${workX}px`);
            workHistory.style.setProperty('--y', `${workY}px`);

        };

        mainElement.addEventListener('mousemove', handleMouseMove);
    });
}

module.exports = mouseTrackingGlow;
