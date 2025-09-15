// CSP Violation Monitor
// Отслеживает нарушения Content Security Policy

interface CSPViolation {
  blockedURI: string;
  violatedDirective: string;
  originalPolicy: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

class CSPMonitor {
  private isEnabled: boolean = true;
  private violations: CSPViolation[] = [];
  private maxViolations: number = 100;

  constructor() {
    this.setupViolationListener();
  }

  private setupViolationListener(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('securitypolicyviolation', (event) => {
      if (!this.isEnabled) return;

      const violation: CSPViolation = {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };

      this.logViolation(violation);
      this.storeViolation(violation);
    });
  }

  private logViolation(violation: CSPViolation): void {
    console.warn('CSP Violation detected:', {
      blockedURI: violation.blockedURI,
      violatedDirective: violation.violatedDirective,
      timestamp: violation.timestamp
    });
  }

  private storeViolation(violation: CSPViolation): void {
    this.violations.push(violation);
    
    // Ограничиваем количество хранимых нарушений
    if (this.violations.length > this.maxViolations) {
      this.violations = this.violations.slice(-this.maxViolations);
    }

    // Сохраняем в localStorage для анализа
    try {
      localStorage.setItem('csp_violations', JSON.stringify(this.violations));
    } catch (error) {
      console.warn('Failed to store CSP violation:', error);
    }
  }

  // Отправка нарушений на сервер (опционально)
  public async reportViolations(): Promise<void> {
    if (this.violations.length === 0) return;

    try {
      const response = await fetch('/api/csp-violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violations: this.violations,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        this.violations = [];
        localStorage.removeItem('csp_violations');
        console.log('CSP violations reported successfully');
      }
    } catch (error) {
      console.warn('Failed to report CSP violations:', error);
    }
  }

  // Получение статистики нарушений
  public getViolationStats(): {
    total: number;
    byDirective: Record<string, number>;
    bySource: Record<string, number>;
  } {
    const stats = {
      total: this.violations.length,
      byDirective: {} as Record<string, number>,
      bySource: {} as Record<string, number>
    };

    this.violations.forEach(violation => {
      // Статистика по директивам
      stats.byDirective[violation.violatedDirective] = 
        (stats.byDirective[violation.violatedDirective] || 0) + 1;

      // Статистика по источникам
      const source = this.extractSource(violation.blockedURI);
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    return stats;
  }

  private extractSource(blockedURI: string): string {
    try {
      const url = new URL(blockedURI);
      return url.hostname;
    } catch {
      return blockedURI.startsWith('data:') ? 'data:' : 'unknown';
    }
  }

  // Включение/отключение мониторинга
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Очистка нарушений
  public clearViolations(): void {
    this.violations = [];
    localStorage.removeItem('csp_violations');
  }

  // Получение всех нарушений
  public getViolations(): CSPViolation[] {
    return [...this.violations];
  }
}

// Создаем глобальный экземпляр
export const cspMonitor = new CSPMonitor();

// Автоматическая отправка нарушений каждые 5 минут
if (typeof window !== 'undefined') {
  setInterval(() => {
    cspMonitor.reportViolations();
  }, 5 * 60 * 1000); // 5 минут
}

// Экспортируем для использования в других частях приложения
export default cspMonitor;
