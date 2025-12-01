/**
 * ===================================================
 * 1. وحدات الدعم الأساسية (Stubs)
 * تم إنشاء هذه الفئات كبدائل مؤقتة (Stubs) لضمان قابلية الكود للتشغيل.
 * يجب استبدالها لاحقًا بالمنطق الحقيقي لمحرك AHP والتحليل.
 * ===================================================
 */

// نموذج مبسط لمحرك التحليل الهرمي (AHP)
class AHPEngine {
    importAndCalculate(items, criteria, criteriaItemRank, criteriaRank) {
        // يجب أن يحتوي هذا على منطق حساب الأوزان وتناسق المصفوفات (Consistency)
        console.log('AHPEngine: Calculating AHP results...');
        
        // محاكاة لنتيجة ناجحة
        const mockResults = {
            criteria: {
                detailed: [{ name: 'التكلفة', weight: 0.4, score: 0.45, consistency: 0.05 }],
            },
            rankings: {
                detailed: [{ name: 'البديل أ', score: 0.55 }],
                final: 'البديل أ',
            }
        };

        const success = true; // يفترض أن الحساب نجح
        if (success) {
            return { success: true, data: mockResults };
        } else {
            return { success: false, error: 'AHP calculation failed or inconsistency too high.' };
        }
    }
}

// نموذج مبسط لمحلل الحساسية
class SensitivityAnalyzer {
    analyzeSensitivity(ahpResults) {
        // يجب أن يحتوي هذا على منطق تحليل حساسية النتائج لتغير الأوزان
        console.log('SensitivityAnalyzer: Performing sensitivity analysis...');
        return {
            criteriaImpact: 'الوزن الأهم هو للتكلفة (تأثير عالي).',
            robustness: 'النتائج قوية ضد تغييرات صغيرة في الأوزان.'
        };
    }
}

// نموذج مبسط لمُجمع بيانات النموذج (Form Data Collector)
class FormDataCollector {
    collectAllData() {
        console.log('FormDataCollector: Collecting data from UI form...');
        // محاكاة لبيانات مُجمعة من واجهة المستخدم
        return {
            items: ['البديل أ', 'البديل ب'],
            criteria: ['التكلفة', 'السرعة'],
            criteriaItemRank: [],
            criteriaRank: [],
        };
    }
}

// نموذج مبسط لمدقق البيانات (Data Validator)
const DataValidator = {
    validate(data) {
        console.log('DataValidator: Validating input data...');
        // هنا يتم التحقق من اكتمال المصفوفات وقيمها
        return { valid: true };
    }
};

/**
 * ===================================================
 * 2. الفئة الرئيسية للتطبيق SFactsApp (الكود المدمج)
 * تجميع وإدارة جميع الوحدات المذكورة أعلاه.
 * ===================================================
 */

class SFactsApp {
    constructor() {
        // تهيئة محركات الحساب والتحليل
        this.ahpEngine = new AHPEngine();
        this.sensitivityAnalyzer = new SensitivityAnalyzer();
        
        // إضافة وحدات التجميع والتحقق كما طُلبت في الدمج
        this.dataValidator = DataValidator; 
        this.formCollector = new FormDataCollector(); 
        
        this.currentResults = null;
        this.version = '2.0.0'; // إصدار التطبيق
    }

    /**
     * تشغيل الحساب الكامل باستخدام مدخلات مُعرفة مسبقًا
     * @param {Array<string>} myItems قائمة البدائل
     * @param {Array<string>} myCriteria قائمة المعايير
     * @param {Object} myCriteriaItemRank مصفوفات المقارنات الثنائية للبدائل تحت كل معيار
     * @param {Object} myCriteriaRank مصفوفة المقارنات الثنائية للمعايير
     * @returns {Object} نتائج الحساب والتحليل الشاملة
     */
    runCalculation(myItems, myCriteria, myCriteriaItemRank, myCriteriaRank) {
        // التحقق من صحة البيانات قبل الحساب (إذا كانت مطلوبة)
        // const validation = this.dataValidator.validate(arguments);
        // if (!validation.valid) { ... }

        // 1. الحساب الأساسي بواسطة محرك AHP
        const basicResults = this.ahpEngine.importAndCalculate(
            myItems, myCriteria, myCriteriaItemRank, myCriteriaRank
        );

        if (!basicResults.success) {
            return basicResults;
        }

        this.currentResults = basicResults.data;

        // 2. تحليل الحساسية
        const sensitivityResults = this.sensitivityAnalyzer.analyzeSensitivity(
            basicResults.data
        );

        // 3. تجميع وتقديم النتائج الشاملة
        return {
            ...basicResults,
            sensitivity: sensitivityResults,
            timestamp: new Date().toISOString(),
            version: this.version
        };
    }
    
    /**
     * تشغيل الحساب الكامل بناءً على البيانات التي تم تجميعها من نموذج واجهة المستخدم.
     * يستخدم FormDataCollector لتوفير المدخلات لـ runCalculation.
     * @returns {Object} نتائج الحساب أو رسالة خطأ.
     */
    runCalculationFromForm() {
        const formData = this.formCollector.collectAllData();
        
        if (!formData || !formData.items || !formData.criteria) {
            return {
                success: false,
                error: 'فشل في تجميع بيانات النموذج. تأكد من إدخال البدائل والمعايير.'
            };
        }
        
        // تمرير البيانات المجمعة إلى دالة الحساب الأساسية
        return this.runCalculation(
            formData.items,
            formData.criteria,
            formData.criteriaItemRank,
            formData.criteriaRank
        );
    }

    /**
     * الحصول على النتائج الحالية
     * @returns {Object|null} النتائج المحفوظة
     */
    getCurrentResults() {
        return this.currentResults;
    }

    /**
     * تصدير النتائج بتنسيقات متعددة
     * @param {('json'|'csv'|'summary')} format - تنسيق الإخراج المطلوب
     * @returns {string|Object} البيانات المصدرة
     * @throws {Error} إذا لم تكن هناك نتائج للحاسوب
     */
    exportResults(format = 'json') {
        if (!this.currentResults) {
            throw new Error('لا توجد نتائج للتصدير');
        }

        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(this.currentResults, null, 2);
            case 'csv':
                return this.convertToCSV(this.currentResults);
            case 'summary':
                return this.generateSummary(this.currentResults);
            default:
                // إرجاع الكائن الأصلي كافتراضي
                return this.currentResults;
        }
    }

    /**
     * تحويل نتائج AHP الرئيسية إلى تنسيق CSV بسيط.
     * @param {Object} results - كائن النتائج
     * @returns {string} بيانات CSV
     */
    convertToCSV(results) {
        // التأكد من وجود البيانات
        if (!results.criteria || !results.rankings) {
            return "نوع,اسم,درجة\nلا تتوفر بيانات مفصلة.";
        }

        // تحويل أوزان المعايير
        const criteriaCSV = results.criteria.detailed.map(c => 
            `معيار,${c.name},${c.score.toFixed(4)}` // استخدام toFixed للدرجات
        ).join('\n');

        // تحويل نتائج البدائل
        const alternativesCSV = results.rankings.detailed.map(a => 
            `بديل,${a.name},${a.score.toFixed(4)}`
        ).join('\n');

        return `نوع,اسم,درجة\n${criteriaCSV}\n${alternativesCSV}`;
    }

    /**
     * توليد ملخص تنفيذي لأهم المعايير والبدائل.
     * @param {Object} results - كائن النتائج
     * @returns {Object} ملخص مختصر
     */
    generateSummary(results) {
        // يتم فرز النتائج بناءً على 'weight' (إذا كان متاحًا) أو 'score'
        const sortKey = (a) => a.weight !== undefined ? a.weight : a.score;

        const topCriteria = results.criteria.detailed
            .sort((a, b) => sortKey(b) - sortKey(a))
            .slice(0, 3);

        const topAlternatives = results.rankings.detailed
            .sort((a, b) => sortKey(b) - sortKey(a))
            .slice(0, 3);

        return {
            topCriteria: topCriteria.map(c => ({ name: c.name, score: c.score.toFixed(4) })),
            topAlternatives: topAlternatives.map(a => ({ name: a.name, score: a.score.toFixed(4) })),
            generatedAt: new Date().toLocaleString('ar-SA'),
            winningAlternative: results.rankings.final || topAlternatives[0].name
        };
    }
}


/**
 * ===================================================
 * 3. التصدير للاستخدام العالمي والتوافق مع الإصدار القديم
 * ===================================================
 */

// الحفاظ على التوافق مع الإصدار القديم
const inputsToAhpResults = function(myItems, myCriteria, myCriteriaItemRank, myCriteriaRank) {
    const app = new SFactsApp();
    const results = app.runCalculation(myItems, myCriteria, myCriteriaItemRank, myCriteriaRank);
    
    if (results.success) {
        // إرجاع نتائج البيانات فقط للتوافق مع التوقيع القديم
        return results.data; 
    } else {
        // إلقاء خطأ إذا فشل الحساب
        throw new Error(results.error);
    }
};

// التصدير للاستخدام العالمي (لبيئة المتصفح)
if (typeof window !== 'undefined') {
    window.SFactsApp = SFactsApp;
    window.runCalculation = inputsToAhpResults;
    window.advancedCalculation = (items, criteria, itemRank, criteriaRank) => {
        const app = new SFactsApp();
        return app.runCalculation(items, criteria, itemRank, criteriaRank);
    };
}

// التصدير للاستخدام كوحدة (Module)
export default SFactsApp;
