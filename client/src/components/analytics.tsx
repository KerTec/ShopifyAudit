import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

// Simple client-side analytics to track user behavior
class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  track(event: string, properties?: Record<string, any>) {
    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }
    };

    this.events.push(eventData);
    console.log('Analytics Event:', eventData);

    // In a real implementation, you would send this to your analytics service
    // For now, we'll store it locally for debugging
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('shopify_audit_analytics') || '[]';
      const allEvents = JSON.parse(stored);
      allEvents.push(eventData);
      localStorage.setItem('shopify_audit_analytics', JSON.stringify(allEvents.slice(-100))); // Keep last 100 events
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }
}

export const analytics = Analytics.getInstance();

// Hook to track page views
export function usePageView(pageName: string) {
  useEffect(() => {
    analytics.track('page_view', { page: pageName });
  }, [pageName]);
}

// Hook to track audit events
export function useAuditTracking() {
  const trackAuditStart = (url: string) => {
    analytics.track('audit_started', { audit_url: url });
  };

  const trackAuditComplete = (url: string, score: number, issues: number) => {
    analytics.track('audit_completed', { 
      audit_url: url, 
      score, 
      issues_count: issues 
    });
  };

  const trackExportFree = (format: string, url: string) => {
    analytics.track('export_free', { 
      format, 
      audit_url: url 
    });
  };

  const trackExportPremiumClick = (url: string) => {
    analytics.track('export_premium_click', { 
      audit_url: url 
    });
  };

  const trackPaymentSuccess = (url: string, amount: number) => {
    analytics.track('payment_success', { 
      audit_url: url, 
      amount 
    });
  };

  return {
    trackAuditStart,
    trackAuditComplete,
    trackExportFree,
    trackExportPremiumClick,
    trackPaymentSuccess
  };
}