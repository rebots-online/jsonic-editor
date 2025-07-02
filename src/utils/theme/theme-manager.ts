export interface ThemeConfig {
  name: string;
  properties: Record<string, string>;
}

export class ThemeManager {
  private current = 'light';

  setTheme(themeName: string): void {
    const linkId = 'theme-stylesheet';
    const existing = document.getElementById(linkId);
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `/src/styles/themes/${themeName}.css`;
    document.head.appendChild(link);
    this.current = themeName;
  }

  getTheme(): string {
    return this.current;
  }

  getAvailableThemes(): string[] {
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

  applyTheme(theme: ThemeConfig): void {
    Object.entries(theme.properties).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
  }
}
