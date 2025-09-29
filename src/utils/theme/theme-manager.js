export class ThemeManager {
    constructor() {
        this.current = 'light';
    }
    setTheme(themeName) {
        const linkId = 'theme-stylesheet';
        const existing = document.getElementById(linkId);
        if (existing)
            existing.remove();
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `/src/styles/themes/${themeName}.css`;
        document.head.appendChild(link);
        this.current = themeName;
    }
    getTheme() {
        return this.current;
    }
    getAvailableThemes() {
        return [
            'light',
            'dark',
            'glassmorphic-light',
            'glassmorphic-dark',
            'skeuomorphic-light',
            'skeuomorphic-dark',
            'retro-light',
            'retro-dark',
            'brutalist-light',
            'brutalist-dark'
        ];
    }
    applyTheme(theme) {
        Object.entries(theme.properties).forEach(([k, v]) => {
            document.documentElement.style.setProperty(k, v);
        });
    }
}
