// js/enhanced-integration.js
/**
 * ملف التكامل بين النظام المحسن والواجهة الحالية
 */

// الانتظار حتى يتم تحميل كل شيء
document.addEventListener('DOMContentLoaded', function() {
    // الانتظار لبضع ثوانٍ لضمان تحميل النظام المحسن
    setTimeout(initializeEnhancedIntegration, 2000);
});

function initializeEnhancedIntegration() {
    console.log('Initializing enhanced integration...');
    
    // 1. إضافة زر الحساب المتقدم
    addAdvancedCalculateButton();
    
    // 2. إضافة مستمع لزر الحساب العادي لتفعيل النظام المحسن
    enhanceOriginalCalculateButton();
    
    // 3. إضافة دالة لجمع البيانات عند النقر على أي زر متقدم
    setupEnhancedButtons();
    
    // 4. تحديث واجهة المستخدم بناءً على توفر النظام المحسن
    updateUIForEnhancedFeatures();
}

function addAdvancedCalculateButton() {
    const originalCalcBtn = document.getElementById('calcbtn');
    if (!originalCalcBtn) return;
    
    // إنشاء زر الحساب المتقدم
    const advancedBtn = document.createElement('button');
    advancedBtn.id = 'advanced-calc-btn';
    advancedBtn.textContent = 'Calculate (Advanced)';
    advancedBtn.style.marginLeft = '10px';
    advancedBtn.style.backgroundColor = '#4CAF50';
    advancedBtn.style.color = 'white';
    advancedBtn.style.border = 'none';
    advancedBtn.style.padding = '10px 15px';
    advancedBtn.style.borderRadius = '4px';
    advancedBtn.style.cursor = 'pointer';
    
    // إضافة الزر بجانب الزر الأصلي
    originalCalcBtn.parentNode.insertBefore(advancedBtn, originalCalcBtn.nextSibling);
    
    // إضافة مستمع الأحداث
    advancedBtn.addEventListener('click', performAdvancedCalculation);
}

function enhanceOriginalCalculateButton() {
    const originalCalcBtn = document.getElementById('calcbtn');
    if (!originalCalcBtn) return;
    
    // نسخ المستمع الأصلي
    const originalHandler = originalCalcBtn.onclick;
    
    // استبداله بمستمع محسن
    originalCalcBtn.onclick = function(e) {
        // أولاً تشغيل المستمع الأصلي
        if (originalHandler) originalHandler.call(this, e);
        
        // ثم تفعيل النظام المحسن إذا كان متاحاً
        setTimeout(() => {
            if (window.SFactsApp) {
                try {
                    const formData = collectFormData();
                    if (formData) {
                        const app = new window.SFactsApp();
                        const results = app.runCalculation(
                            formData.items,
                            formData.criteria,
                            formData.criteriaItemRank,
                            formData.criteriaRank
                        );
                        
                        if (results.success) {
                            showEnhancedNotification(results);
                        }
                    }
                } catch (error) {
                    console.warn('Enhanced calculation failed:', error);
                }
            }
        }, 100);
    };
}

function performAdvancedCalculation() {
    if (!window.SFactsApp) {
        alert('Enhanced features not available yet. Please wait...');
        return;
    }
    
    try {
        const formData = collectFormData();
        if (!formData) {
            alert('Please fill in at least 2 items and 2 criteria');
            return;
        }
        
        const app = new window.SFactsApp();
        const results = app.runCalculation(
            formData.items,
            formData.criteria,
            formData.criteriaItemRank,
            formData.criteriaRank
        );
        
        if (results.success) {
            displayEnhancedResults(results);
        } else {
            alert('Calculation failed: ' + (results.error || 'Unknown error'));
            if (results.validationErrors) {
                console.error('Validation errors:', results.validationErrors);
            }
        }
    } catch (error) {
        console.error('Advanced calculation error:', error);
        alert('Error in advanced calculation');
    }
}

function collectFormData() {
    // استخدام المجمع إذا كان متاحاً
    if (window.collectAHPFormData) {
        return window.collectAHPFormData();
    }
    
    // أو استخدام التنفيذ البسيط
    return collectFormDataSimple();
}

function collectFormDataSimple() {
    try {
        const items = [];
        const criteria = [];
        
        // جمع العناصر
        for (let i = 0; i < 8; i++) {
            const input = document.getElementById('item' + i);
            if (input && input.value.trim()) {
                items.push(input.value.trim());
            }
        }
        
        // جمع المعايير
        for (let i = 0; i < 8; i++) {
            const input = document.getElementById('criteria' + i);
            if (input && input.value.trim()) {
                criteria.push(input.value.trim());
            }
        }
        
        if (items.length < 2 || criteria.length < 2) {
            return null;
        }
        
        // جمع مصفوفة المعايير (مبسط)
        const criteriaRank = [];
        for (let i = 0; i < criteria.length; i++) {
            criteriaRank[i] = [];
            for (let j = 0; j < criteria.length; j++) {
                if (i === j) {
                    criteriaRank[i][j] = 1;
                } else {
                    const inputId = `criteria${i}v${j}`;
                    const input = document.getElementById(inputId);
                    criteriaRank[i][j] = input && input.value ? parseFloat(input.value) || 1 : 1;
                }
            }
        }
        
        // جمع مصفوفات العناصر (مبسط)
        const criteriaItemRank = [];
        for (let c = 0; c < criteria.length; c++) {
            const matrix = [];
            for (let i = 0; i < items.length; i++) {
                matrix[i] = [];
                for (let j = 0; j < items.length; j++) {
                    if (i === j) {
                        matrix[i][j] = 1;
                    } else {
                        const inputId = `c${c}_item${i}v${j}`;
                        const input = document.getElementById(inputId);
                        matrix[i][j] = input && input.value ? parseFloat(input.value) || 1 : 1;
                    }
                }
            }
            criteriaItemRank.push(matrix);
        }
        
        return {
            items: items,
            criteria: criteria,
            criteriaRank: criteriaRank,
            criteriaItemRank: criteriaItemRank
        };
        
    } catch (error) {
        console.error('Error collecting form data:', error);
        return null;
    }
}

function displayEnhancedResults(results) {
    // إظهار الإشعار
    showEnhancedNotification(results);
    
    // إضافة النتائج المتقدمة إلى صفحة النتائج
    addEnhancedResultsSection(results);
}

function showEnhancedNotification(results) {
    // إنشاء أو تحديث الإشعار
    let notice = document.getElementById('enhanced-results-notice');
    if (!notice) {
        notice = document.createElement('div');
        notice.id = 'enhanced-results-notice';
        notice.style.cssText = `
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const resultsSection = document.querySelector('.results');
        if (resultsSection) {
            resultsSection.insertBefore(notice, resultsSection.firstChild);
        }
    }
    
    notice.innerHTML = `
        <div>
            <strong>✓ Enhanced Analysis Complete</strong>
            <div style="font-size: 0.9em; opacity: 0.9;">
                Consistency: ${results.consistency?.isAcceptable ? '✓ Acceptable' : '⚠️ Needs review'}
                ${results.sensitivity ? '| Sensitivity: Available' : ''}
            </div>
        </div>
        <button id="view-enhanced-details" style="
            background: white;
            color: #4CAF50;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        ">View Details</button>
    `;
    
    // إضافة مستمع لزر التفاصيل
    document.getElementById('view-enhanced-details')?.addEventListener('click', function() {
        showEnhancedDetailsModal(results);
    });
}

function addEnhancedResultsSection(results) {
    // إزالة القسم القديم إذا كان موجوداً
    const oldSection = document.getElementById('enhanced-results-section');
    if (oldSection) oldSection.remove();
    
    // إنشاء قسم جديد
    const section = document.createElement('div');
    section.id = 'enhanced-results-section';
    section.style.cssText = `
        margin-top: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;
    `;
    
    // بناء المحتوى
    let html = '<h2 style="margin-top: 0;">Enhanced Analysis Results</h2>';
    
    // معلومات التناسق
    if (results.consistency) {
        html += `
            <div style="margin-bottom: 20px;">
                <h3>Consistency Analysis</h3>
                <p><strong>Consistency Ratio:</strong> ${results.consistency.ratio?.toFixed(4) || 'N/A'}</p>
                <p><strong>Status:</strong> 
                    <span style="color: ${results.consistency.isAcceptable ? 'green' : 'orange'};">
                        ${results.consistency.message || (results.consistency.isAcceptable ? 'Acceptable' : 'Needs Review')}
                    </span>
                </p>
            </div>
        `;
    }
    
    // ملخص الحساسية
    if (results.sensitivity?.summary) {
        html += `
            <div style="margin-bottom: 20px;">
                <h3>Sensitivity Analysis</h3>
                <p><strong>Model Stability:</strong> ${results.sensitivity.summary.stability}</p>
                <p><strong>Average Impact:</strong> ${(results.sensitivity.summary.averageImpact * 100).toFixed(2)}%</p>
                ${results.sensitivity.mostSensitive ? 
                    `<p><strong>Most Sensitive Criterion:</strong> ${results.sensitivity.mostSensitive.criterion}</p>` : ''}
            </div>
        `;
    }
    
    // أزرار التصدير
    html += `
        <div>
            <h3>Export Options</h3>
            <button id="export-enhanced-json" style="margin-right: 10px; padding: 8px 15px;">Export JSON</button>
            <button id="export-enhanced-csv" style="margin-right: 10px; padding: 8px 15px;">Export CSV</button>
            <button id="export-enhanced-summary" style="padding: 8px 15px;">Executive Summary</button>
        </div>
    `;
    
    section.innerHTML = html;
    
    // إضافة إلى قسم النتائج
    const resultsContainer = document.querySelector('.results');
    if (resultsContainer) {
        resultsContainer.appendChild(section);
    }
    
    // إضافة مستمعين لأزرار التصدير
    setupExportButtons(results);
}

function setupExportButtons(results) {
    document.getElementById('export-enhanced-json')?.addEventListener('click', function() {
        exportToJSON(results);
    });
    
    document.getElementById('export-enhanced-csv')?.addEventListener('click', function() {
        exportToCSV(results);
    });
    
    document.getElementById('export-enhanced-summary')?.addEventListener('click', function() {
        exportSummary(results);
    });
}

function exportToJSON(results) {
    const dataStr = JSON.stringify(results, null, 2);
    downloadFile(dataStr, 'ahp-enhanced-results.json', 'application/json');
}

function exportToCSV(results) {
    // تنفيذ بسيط لتصدير CSV
    let csv = 'Type,Name,Score,Weight\n';
    
    if (results.data?.criteria?.detailed) {
        results.data.criteria.detailed.forEach((c, i) => {
            csv += `Criteria,${c.name},${c.score},${c.weight || ''}\n`;
        });
    }
    
    if (results.data?.rankings?.detailed) {
        results.data.rankings.detailed.forEach((a, i) => {
            csv += `Alternative,${a.name},${a.score},${a.weight || ''}\n`;
        });
    }
    
    downloadFile(csv, 'ahp-enhanced-results.csv', 'text/csv');
}

function exportSummary(results) {
    const summary = `
AHP Analysis Summary
====================
Generated: ${new Date().toLocaleString()}

CONSISTENCY ANALYSIS
--------------------
Ratio: ${results.consistency?.ratio?.toFixed(4) || 'N/A'}
Status: ${results.consistency?.isAcceptable ? 'Acceptable' : 'Needs Review'}
Message: ${results.consistency?.message || ''}

TOP CRITERIA
------------
${results.data?.criteria?.detailed?.slice(0, 3).map((c, i) => `${i+1}. ${c.name}: ${c.score}`).join('\n') || 'N/A'}

TOP ALTERNATIVES
----------------
${results.data?.rankings?.detailed?.slice(0, 3).map((a, i) => `${i+1}. ${a.name}: ${a.score}`).join('\n') || 'N/A'}

SENSITIVITY ANALYSIS
--------------------
Model Stability: ${results.sensitivity?.summary?.stability || 'N/A'}
Average Impact: ${results.sensitivity?.summary?.averageImpact ? (results.sensitivity.summary.averageImpact * 100).toFixed(2) + '%' : 'N/A'}
    `;
    
    downloadFile(summary, 'ahp-executive-summary.txt', 'text/plain');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function updateUIForEnhancedFeatures() {
    // تحديث واجهة المستخدم بناءً على توفر النظام المحسن
    if (window.SFactsApp) {
        console.log('✅ Enhanced features available');
        
        // تحديث النص في الهيدر
        const versionInfo = document.getElementById('version-info');
        if (versionInfo) {
            versionInfo.textContent = 'SFacts Enhanced 2.0 (Active)';
            versionInfo.style.color = '#4CAF50';
        }
        
        // إظهار زر الميزات المتقدمة
        const toggleBtn = document.getElementById('toggle-enhanced');
        if (toggleBtn) {
            toggleBtn.style.display = 'inline-block';
            toggleBtn.style.backgroundColor = '#4CAF50';
        }
    }
}

function setupEnhancedButtons() {
    // سيكون هذا للوظائف الإضافية في المستقبل
    console.log('Enhanced buttons setup complete');
}
