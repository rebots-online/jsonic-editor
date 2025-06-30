export interface ThemeConfig {
  name: string;
  properties: Record<string, string>;
}

export class ThemeManager {
  private current = 'light';

  setTheme(themeName: string): void {
    this.current = themeName;
  }

  getTheme(): string {
    return this.current;
  }

  getAvailableThemes(): string[] {
    return ['light', 'dark'];
  }

  applyTheme(theme: ThemeConfig): void {
    Object.entries(theme.properties).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
  }
}
