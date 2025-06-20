import { SEOIssue, AuditSummary, ActionPlanItem } from "@shared/schema";
import * as cheerio from 'cheerio';

interface AuditData {
  url: string;
  html: string;
  statusCode: number;
  loadTime: number;
  headers: Record<string, string>;
}

export class SEOAuditEngine {
  private issues: SEOIssue[] = [];
  private $ = null as any;

  async auditUrl(url: string) {
    try {
      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      
      // Fetch page with timeout
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ShopifyAudit/1.0; +https://shopifyaudit.com)',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const loadTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const headers = Object.fromEntries(response.headers.entries());
      
      const auditData: AuditData = {
        url: normalizedUrl,
        html,
        statusCode: response.status,
        loadTime,
        headers,
      };

      return this.performAudit(auditData);
    } catch (error: any) {
      console.error('Audit engine error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La page met trop de temps à répondre');
      }
      throw new Error(`Erreur lors de l'audit: ${error.message}`);
    }
  }

  private performAudit(data: AuditData) {
    this.issues = [];
    this.$ = cheerio.load(data.html);

    // Run all audit checks
    this.checkMetaTags();
    this.checkHeadingStructure();
    this.checkImages();
    this.checkLinks();
    this.checkPerformance(data);
    this.checkShopifySpecific();
    this.checkSchema();
    this.checkSocialMedia();

    const summary = this.calculateSummary();
    const score = this.calculateScore(summary);
    const actionPlan = this.generateActionPlan();

    return {
      url: data.url,
      score,
      summary,
      issues: this.issues,
      seo: this.extractSEOData(),
      tracking: this.extractTrackingData(),
      actionPlan,
    };
  }

  private checkMetaTags() {
    const title = this.$('title').text().trim();
    const metaDescription = this.$('meta[name="description"]').attr('content');
    const metaKeywords = this.$('meta[name="keywords"]').attr('content');
    const robotsMeta = this.$('meta[name="robots"]').attr('content');

    // Title checks
    if (!title) {
      this.addIssue({
        id: 'missing-title',
        category: 'Meta Tags',
        title: 'Titre manquant',
        description: 'La page n\'a pas de balise title, ce qui est critique pour le SEO.',
        severity: 'critical',
        recommendation: 'Ajouter une balise <title> unique et descriptive (50-60 caractères).',
        impact: 'high',
      });
    } else if (title.length < 30) {
      this.addIssue({
        id: 'title-too-short',
        category: 'Meta Tags',
        title: 'Titre trop court',
        description: `Le titre fait seulement ${title.length} caractères.`,
        severity: 'warning',
        recommendation: 'Étendre le titre à 50-60 caractères pour une meilleure visibilité.',
        impact: 'medium',
      });
    } else if (title.length > 60) {
      this.addIssue({
        id: 'title-too-long',
        category: 'Meta Tags',
        title: 'Titre trop long',
        description: `Le titre fait ${title.length} caractères et sera tronqué dans les résultats de recherche.`,
        severity: 'warning',
        recommendation: 'Réduire le titre à 50-60 caractères.',
        impact: 'medium',
      });
    }

    // Meta description checks
    if (!metaDescription) {
      this.addIssue({
        id: 'missing-meta-description',
        category: 'Meta Tags',
        title: 'Meta description manquante',
        description: 'La page n\'a pas de meta description, impactant le CTR dans les résultats de recherche.',
        severity: 'critical',
        recommendation: 'Ajouter une meta description unique et engageante (150-160 caractères).',
        impact: 'high',
      });
    } else if (metaDescription.length < 120) {
      this.addIssue({
        id: 'meta-description-too-short',
        category: 'Meta Tags',
        title: 'Meta description trop courte',
        description: `La meta description fait seulement ${metaDescription.length} caractères.`,
        severity: 'optimization',
        recommendation: 'Étendre la meta description à 150-160 caractères.',
        impact: 'medium',
      });
    } else if (metaDescription.length > 160) {
      this.addIssue({
        id: 'meta-description-too-long',
        category: 'Meta Tags',
        title: 'Meta description trop longue',
        description: `La meta description fait ${metaDescription.length} caractères et sera tronquée.`,
        severity: 'warning',
        recommendation: 'Réduire la meta description à 150-160 caractères.',
        impact: 'medium',
      });
    }

    // Meta keywords (obsolete but sometimes used incorrectly)
    if (metaKeywords) {
      this.addIssue({
        id: 'meta-keywords-present',
        category: 'Meta Tags',
        title: 'Meta keywords obsolète',
        description: 'La balise meta keywords est présente mais n\'est plus utilisée par les moteurs de recherche.',
        severity: 'optimization',
        recommendation: 'Supprimer la balise meta keywords qui n\'apporte aucune valeur SEO.',
        impact: 'low',
      });
    }
  }

  private checkHeadingStructure() {
    const h1Tags = this.$('h1');
    const h2Tags = this.$('h2');
    const h3Tags = this.$('h3');

    if (h1Tags.length === 0) {
      this.addIssue({
        id: 'missing-h1',
        category: 'Structure',
        title: 'Balise H1 manquante',
        description: 'La page n\'a pas de balise H1, importante pour la hiérarchie du contenu.',
        severity: 'critical',
        recommendation: 'Ajouter une balise H1 unique qui décrit le contenu principal de la page.',
        impact: 'high',
      });
    } else if (h1Tags.length > 1) {
      this.addIssue({
        id: 'multiple-h1',
        category: 'Structure',
        title: 'Balises H1 multiples',
        description: `${h1Tags.length} balises H1 détectées, créant de la confusion pour les moteurs de recherche.`,
        severity: 'critical',
        recommendation: 'Utiliser une seule balise H1 par page et des H2-H6 pour la hiérarchie.',
        impact: 'high',
      });
    }

    // Check for empty headings
    const emptyHeadings = this.$('h1, h2, h3, h4, h5, h6').filter((i, el) => !this.$(el).text().trim());
    if (emptyHeadings.length > 0) {
      this.addIssue({
        id: 'empty-headings',
        category: 'Structure',
        title: 'Balises de titre vides',
        description: `${emptyHeadings.length} balises de titre sont vides.`,
        severity: 'warning',
        recommendation: 'Supprimer les balises de titre vides ou leur donner un contenu descriptif.',
        impact: 'medium',
      });
    }
  }

  private checkImages() {
    const images = this.$('img');
    const imagesWithoutAlt = images.filter((i, el) => !this.$(el).attr('alt'));
    const imagesWithEmptyAlt = images.filter((i, el) => this.$(el).attr('alt') === '');

    if (imagesWithoutAlt.length > 0) {
      this.addIssue({
        id: 'images-without-alt',
        category: 'Images',
        title: 'Images sans attribut alt',
        description: `${imagesWithoutAlt.length} images n'ont pas d'attribut alt, nuisant à l'accessibilité et au SEO.`,
        severity: 'critical',
        recommendation: 'Ajouter des attributs alt descriptifs à toutes les images.',
        impact: 'high',
      });
    }

    if (imagesWithEmptyAlt.length > 0) {
      this.addIssue({
        id: 'images-empty-alt',
        category: 'Images',
        title: 'Images avec alt vide',
        description: `${imagesWithEmptyAlt.length} images ont un attribut alt vide.`,
        severity: 'warning',
        recommendation: 'Ajouter des descriptions pertinentes dans les attributs alt ou les laisser vides uniquement pour les images décoratives.',
        impact: 'medium',
      });
    }

    // Check for large images without optimization
    const largeImages = images.filter((i, el) => {
      const src = this.$(el).attr('src');
      return src && !src.includes('webp') && !src.includes('avif');
    });

    if (largeImages.length > 0) {
      this.addIssue({
        id: 'unoptimized-images',
        category: 'Performance',
        title: 'Images non optimisées',
        description: `${largeImages.length} images pourraient être optimisées avec des formats modernes.`,
        severity: 'optimization',
        recommendation: 'Utiliser des formats d\'images modernes comme WebP ou AVIF pour réduire le temps de chargement.',
        impact: 'medium',
      });
    }
  }

  private checkLinks() {
    const links = this.$('a[href]');
    
    // Count external links (basic check)
    let externalLinksCount = 0;
    links.each((i: any, el: any) => {
      const href = this.$(el).attr('href');
      if (href && href.startsWith('http')) {
        externalLinksCount++;
      }
    });

    const linksWithoutText = links.filter((i: any, el: any) => !this.$(el).text().trim());
    
    if (linksWithoutText.length > 0) {
      this.addIssue({
        id: 'links-without-text',
        category: 'Liens',
        title: 'Liens sans texte',
        description: `${linksWithoutText.length} liens n'ont pas de texte descriptif.`,
        severity: 'warning',
        recommendation: 'Ajouter un texte descriptif à tous les liens pour améliorer l\'accessibilité.',
        impact: 'medium',
      });
    }

    // Basic external link security check
    if (externalLinksCount > 0) {
      this.addIssue({
        id: 'external-links-security',
        category: 'Sécurité',
        title: 'Vérification des liens externes',
        description: `${externalLinksCount} liens externes détectés. Vérifiez qu'ils utilisent rel="noopener" pour la sécurité.`,
        severity: 'optimization',
        recommendation: 'Ajouter rel="noopener" aux liens externes pour des raisons de sécurité.',
        impact: 'low',
      });
    }
  }

  private checkPerformance(data: AuditData) {
    if (data.loadTime > 3000) {
      this.addIssue({
        id: 'slow-loading',
        category: 'Performance',
        title: 'Temps de chargement lent',
        description: `La page se charge en ${(data.loadTime / 1000).toFixed(1)}s, ce qui est supérieur aux recommandations Google.`,
        severity: 'warning',
        recommendation: 'Optimiser les images, minifier le CSS/JS et utiliser un CDN pour améliorer les performances.',
        impact: 'high',
      });
    }

    // Check for render-blocking resources
    const cssLinks = this.$('link[rel="stylesheet"]');
    const inlineScripts = this.$('script').filter((i, el) => !this.$(el).attr('src'));

    if (cssLinks.length > 5) {
      this.addIssue({
        id: 'too-many-css-files',
        category: 'Performance',
        title: 'Trop de fichiers CSS',
        description: `${cssLinks.length} fichiers CSS détectés, ralentissant le rendu de la page.`,
        severity: 'optimization',
        recommendation: 'Combiner et minifier les fichiers CSS pour réduire les requêtes HTTP.',
        impact: 'medium',
      });
    }
  }

  private checkShopifySpecific() {
    // Check for Shopify-specific elements
    const shopifyAnalytics = this.$('script').filter((i, el) => {
      const content = this.$(el).html();
      return content && content.includes('Shopify.analytics');
    });

    if (shopifyAnalytics.length === 0) {
      this.addIssue({
        id: 'missing-shopify-analytics',
        category: 'Shopify',
        title: 'Analytics Shopify manquant',
        description: 'Les scripts d\'analytics Shopify ne sont pas détectés.',
        severity: 'warning',
        recommendation: 'Vérifier que les analytics Shopify sont correctement configurés.',
        impact: 'medium',
      });
    }

    // Check for product schema on product pages
    const productSchema = this.$('script[type="application/ld+json"]').filter((i, el) => {
      const content = this.$(el).html();
      return content && content.includes('Product');
    });

    const isProductPage = this.$('.product').length > 0 || this.$('[data-section-type="product"]').length > 0;
    
    if (isProductPage && productSchema.length === 0) {
      this.addIssue({
        id: 'missing-product-schema',
        category: 'Schema',
        title: 'Schema produit manquant',
        description: 'Page produit sans balisage Schema.org Product.',
        severity: 'optimization',
        recommendation: 'Ajouter le balisage Schema.org Product pour améliorer l\'affichage dans les résultats de recherche.',
        impact: 'medium',
      });
    }
  }

  private checkSchema() {
    const schemaScripts = this.$('script[type="application/ld+json"]');
    
    if (schemaScripts.length === 0) {
      this.addIssue({
        id: 'missing-schema',
        category: 'Schema',
        title: 'Balisage structuré manquant',
        description: 'Aucun balisage Schema.org détecté sur la page.',
        severity: 'optimization',
        recommendation: 'Implémenter le balisage Schema.org approprié (Organization, WebSite, Product, etc.).',
        impact: 'medium',
      });
    } else {
      // Validate JSON-LD syntax
      schemaScripts.each((i, el) => {
        try {
          const content = this.$(el).html();
          if (content) {
            JSON.parse(content);
          }
        } catch (e) {
          this.addIssue({
            id: 'invalid-schema-syntax',
            category: 'Schema',
            title: 'Syntaxe Schema invalide',
            description: 'Erreur de syntaxe détectée dans le balisage Schema.org.',
            severity: 'warning',
            recommendation: 'Corriger la syntaxe JSON-LD du balisage structuré.',
            impact: 'medium',
          });
        }
      });
    }
  }

  private checkSocialMedia() {
    const ogTitle = this.$('meta[property="og:title"]').attr('content');
    const ogDescription = this.$('meta[property="og:description"]').attr('content');
    const ogImage = this.$('meta[property="og:image"]').attr('content');

    if (!ogTitle) {
      this.addIssue({
        id: 'missing-og-title',
        category: 'Réseaux Sociaux',
        title: 'Open Graph title manquant',
        description: 'Pas de balise og:title pour le partage sur les réseaux sociaux.',
        severity: 'optimization',
        recommendation: 'Ajouter une balise og:title pour améliorer l\'apparence lors du partage.',
        impact: 'low',
      });
    }

    if (!ogDescription) {
      this.addIssue({
        id: 'missing-og-description',
        category: 'Réseaux Sociaux',
        title: 'Open Graph description manquante',
        description: 'Pas de balise og:description pour le partage sur les réseaux sociaux.',
        severity: 'optimization',
        recommendation: 'Ajouter une balise og:description pour améliorer l\'apparence lors du partage.',
        impact: 'low',
      });
    }

    if (!ogImage) {
      this.addIssue({
        id: 'missing-og-image',
        category: 'Réseaux Sociaux',
        title: 'Open Graph image manquante',
        description: 'Pas de balise og:image pour le partage sur les réseaux sociaux.',
        severity: 'optimization',
        recommendation: 'Ajouter une balise og:image pour améliorer l\'apparence lors du partage.',
        impact: 'low',
      });
    }
  }

  private addIssue(issue: SEOIssue) {
    this.issues.push(issue);
  }

  private calculateSummary(): AuditSummary {
    const critical = this.issues.filter(issue => issue.severity === 'critical').length;
    const warnings = this.issues.filter(issue => issue.severity === 'warning').length;
    const optimizations = this.issues.filter(issue => issue.severity === 'optimization').length;
    
    // Calculate passed tests (estimated based on total possible tests)
    const totalTests = 25; // Approximate number of tests we run
    const failedTests = critical + warnings;
    const passed = Math.max(0, totalTests - failedTests);

    return {
      passed,
      warnings,
      critical,
      optimizations,
    };
  }

  private calculateScore(summary: AuditSummary): number {
    const totalTests = summary.passed + summary.warnings + summary.critical + summary.optimizations;
    if (totalTests === 0) return 100;

    // Scoring: critical issues = -10 points, warnings = -5 points, optimizations = -2 points
    const deductions = (summary.critical * 10) + (summary.warnings * 5) + (summary.optimizations * 2);
    const score = Math.max(0, 100 - deductions);
    
    return Math.round(score);
  }

  private generateActionPlan(): ActionPlanItem[] {
    const actionPlan: ActionPlanItem[] = [];

    // High priority items (critical issues)
    const criticalIssues = this.issues.filter(issue => issue.severity === 'critical');
    criticalIssues.forEach(issue => {
      actionPlan.push({
        priority: 'high',
        title: issue.title,
        description: issue.recommendation || issue.description,
        timeframe: 'À faire immédiatement',
        difficulty: issue.impact === 'high' ? 'medium' : 'easy',
      });
    });

    // Medium priority items (warnings)
    const warningIssues = this.issues.filter(issue => issue.severity === 'warning');
    warningIssues.slice(0, 3).forEach(issue => {
      actionPlan.push({
        priority: 'medium',
        title: issue.title,
        description: issue.recommendation || issue.description,
        timeframe: 'À faire sous 2 semaines',
        difficulty: issue.impact === 'high' ? 'hard' : 'medium',
      });
    });

    // Low priority items (optimizations)
    const optimizationIssues = this.issues.filter(issue => issue.severity === 'optimization');
    optimizationIssues.slice(0, 3).forEach(issue => {
      actionPlan.push({
        priority: 'low',
        title: issue.title,
        description: issue.recommendation || issue.description,
        timeframe: 'Optimisations long terme',
        difficulty: 'medium',
      });
    });

    return actionPlan;
  }

  private extractSEOData() {
    return {
      title: this.$('title').text().trim(),
      metaDescription: this.$('meta[name="description"]').attr('content') || '',
      h1Count: this.$('h1').length,
      h2Count: this.$('h2').length,
      imageCount: this.$('img').length,
      linkCount: this.$('a[href]').length,
      schemaCount: this.$('script[type="application/ld+json"]').length,
    };
  }

  private extractTrackingData() {
    const googleAnalytics = this.$('script').filter((i, el) => {
      const content = this.$(el).html();
      return content && (content.includes('gtag') || content.includes('ga('));
    }).length > 0;

    const googleTagManager = this.$('script').filter((i, el) => {
      const content = this.$(el).html();
      return content && content.includes('googletagmanager');
    }).length > 0;

    const facebookPixel = this.$('script').filter((i, el) => {
      const content = this.$(el).html();
      return content && content.includes('fbq');
    }).length > 0;

    return {
      googleAnalytics,
      googleTagManager,
      facebookPixel,
      shopifyAnalytics: this.$('script').filter((i, el) => {
        const content = this.$(el).html();
        return content && content.includes('Shopify.analytics');
      }).length > 0,
    };
  }
}
