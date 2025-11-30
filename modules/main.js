import AHPEngine from './core/AHPEngine.js';
import SensitivityAnalyzer from './core/SensitivityAnalyzer.js';

/**
 * النقطة الرئيسية للتطبيق - تجميع كل الوحدات
 */
class SFactsApp {
    constructor() {
        this.ahpEngine = new AHPEngine();
        this.sensitivityAnalyzer = new SensitivityAnalyzer();
        this.currentResults = null;
    }

    /**
     * تشغيل الحساب الكامل
     */
    runCalculation(myItems, myCriteria, myCriteriaItemRank, myCriteriaRank) {
        // الحساب الأساسي
        const basicResults = this.ahpEngine.importAndCalculate(
            myItems, myCriteria, myCriteriaItemRank, myCriteriaRank
        );

        if (!basicResults.success) {
            return basicResults;
        }

        this.currentResults = basicResults.data;

        // تحليل الحساسية
        const sensitivityResults = this.sensitivityAnalyzer.analyzeSensitivity(
            basicResults.data
        );

        // النتائج الشاملة
        return {
            ...basicResults,
            sensitivity: sensitivityResults,
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        };
    }

    /**
     * الحصول على النتائج الحالية
     */
    getCurrentResults() {
        return this.currentResults;
    }

    /**
     * تصدير النتائج بتنسيقات متعددة
     */
    exportResults(format = 'json') {
        if (!this.currentResults) {
            throw new Error('لا توجد نتائج للتصدير');
        }

        switch (format) {
            case 'json':
                return JSON.stringify(this.currentResults, null, 2);
            case 'csv':
                return this.convertToCSV(this.currentResults);
            case 'summary':
                return this.generateSummary(this.currentResults);
            default:
                return this.currentResults;
        }
    }

    /**
     * تحويل إلى CSV
     */
    convertToCSV(results) {
        // تنفيذ بسيط للتحويل إلى CSV
        const criteriaCSV = results.criteria.detailed.map(c => 
            `معيار,${c.name},${c.score}`
        ).join('\n');

        const alternativesCSV = results.rankings.detailed.map(a => 
            `بديل,${a.name},${a.score}`
        ).join('\n');

        return `نوع,اسم,درجة\n${criteriaCSV}\n${alternativesCSV}`;
    }

    /**
     * توليد ملخص
     */
    generateSummary(results) {
        const topCriteria = results.criteria.detailed
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 3);

        const topAlternatives = results.rankings.detailed
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 3);

        return {
            topCriteria: topCriteria.map(c => ({ name: c.name, score: c.score })),
            topAlternatives: topAlternatives.map(a => ({ name: a.name, score: a.score })),
            generatedAt: new Date().toLocaleString('ar-SA')
        };
    }
}

// الحفاظ على التوافق مع الإصدار القديم
const inputsToAhpResults = function(myItems, myCriteria, myCriteriaItemRank, myCriteriaRank) {
    const app = new SFactsApp();
    const results = app.runCalculation(myItems, myCriteria, myCriteriaItemRank, myCriteriaRank);
    
    if (results.success) {
        return results.data;
    } else {
        throw new Error(results.error);
    }
};

// التصدير للاستخدام العالمي
window.SFactsApp = SFactsApp;
window.runCalculation = inputsToAhpResults;
window.advancedCalculation = (items, criteria, itemRank, criteriaRank) => {
    const app = new SFactsApp();
    return app.runCalculation(items, criteria, itemRank, criteriaRank);
};

export default SFactsApp;
