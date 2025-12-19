// 노후설계 대시보드 JavaScript
// localStorage를 사용하여 데이터 저장

(function() {
    'use strict';

    // localStorage 키
    const STORAGE_KEY = 'retirement_dashboard_data';

    // 데이터 로드
    function loadData() {
        if (!window.isLocalStorageAvailable()) {
            window.showUserMessage('브라우저에서 데이터 저장 기능을 사용할 수 없습니다. 입력한 내용은 저장되지 않습니다.', 'warning');
            return;
        }

        const data = window.safeLocalStorageGet(STORAGE_KEY);
        if (data) {
            try {
                // 각 필드에 저장된 값 적용
                Object.keys(data).forEach(key => {
                    const element = window.safeGetElement(key);
                    if (element) {
                        try {
                            if (element.type === 'checkbox') {
                                element.checked = Boolean(data[key]);
                            } else {
                                element.value = String(data[key] || '');
                            }
                        } catch (e) {
                            console.warn(`필드 설정 실패: ${key}`, e);
                        }
                    }
                });
                // 데이터 로드 후 합계 재계산
                calculateTotals();
            } catch (e) {
                console.error('데이터 적용 실패:', e);
                window.showUserMessage('저장된 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
            }
        }
    }

    // 데이터 저장
    function saveData() {
        if (!window.isLocalStorageAvailable()) {
            return; // 저장 불가능하면 조용히 실패
        }

        try {
            const data = {};
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.id) {
                    try {
                        if (input.type === 'checkbox') {
                            data[input.id] = input.checked;
                        } else {
                            data[input.id] = input.value;
                        }
                    } catch (e) {
                        console.warn(`필드 읽기 실패: ${input.id}`, e);
                    }
                }
            });
            
            const saved = window.safeLocalStorageSet(STORAGE_KEY, data);
            if (!saved) {
                window.showUserMessage('데이터 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.', 'warning');
            }
        } catch (e) {
            console.error('데이터 저장 중 오류:', e);
            window.showUserMessage('데이터 저장 중 오류가 발생했습니다.', 'error');
        }
    }

    // 자산 합계 계산
    function calculateTotals() {
        try {
            // 자산 합계
            const cashElement = window.safeGetElement('cash');
            const pensionElement = window.safeGetElement('pension');
            const otherAssetsElement = window.safeGetElement('otherAssets');
            const totalAssetsElement = window.safeGetElement('totalAssets');

            if (cashElement && pensionElement && otherAssetsElement && totalAssetsElement) {
                const cash = parseFloat(cashElement.value) || 0;
                const pension = parseFloat(pensionElement.value) || 0;
                const otherAssets = parseFloat(otherAssetsElement.value) || 0;
                const totalAssets = cash + pension + otherAssets;
                totalAssetsElement.textContent = Math.round(totalAssets).toLocaleString();
            }

            // 수입 합계
            const workIncomeElement = window.safeGetElement('workIncome');
            const otherIncomeElement = window.safeGetElement('otherIncome');
            const totalIncomeElement = window.safeGetElement('totalIncome');

            if (workIncomeElement && otherIncomeElement && totalIncomeElement) {
                const workIncome = parseFloat(workIncomeElement.value) || 0;
                const otherIncome = parseFloat(otherIncomeElement.value) || 0;
                const totalIncome = workIncome + otherIncome;
                totalIncomeElement.textContent = Math.round(totalIncome).toLocaleString();
            }

            // 지출 합계
            const fixedExpenseElement = window.safeGetElement('fixedExpense');
            const livingExpenseElement = window.safeGetElement('livingExpense');
            const totalExpenseElement = window.safeGetElement('totalExpense');

            if (fixedExpenseElement && livingExpenseElement && totalExpenseElement) {
                const fixedExpense = parseFloat(fixedExpenseElement.value) || 0;
                const livingExpense = parseFloat(livingExpenseElement.value) || 0;
                const totalExpense = fixedExpense + livingExpense;
                totalExpenseElement.textContent = Math.round(totalExpense).toLocaleString();
            }
        } catch (e) {
            console.error('합계 계산 실패:', e);
            window.showUserMessage('합계 계산 중 오류가 발생했습니다.', 'error');
        }
    }

    // 입력 값 검증 함수
    function validateInput(input) {
        if (input.type === 'number') {
            let value = parseFloat(input.value) || 0;
            if (value < 0) {
                value = 0;
                input.value = 0;
            }
            return value;
        }
        return input.value;
    }

    // 이벤트 리스너 등록
    function setupEventListeners() {
        // 모든 입력 필드에 변경 이벤트 리스너 추가
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateInput(input);
                saveData();
                if (input.id === 'cash' || input.id === 'pension' || input.id === 'otherAssets' ||
                    input.id === 'workIncome' || input.id === 'otherIncome' ||
                    input.id === 'fixedExpense' || input.id === 'livingExpense') {
                    calculateTotals();
                }
            });
            
            // blur 이벤트로 포커스 잃을 때도 검증
            if (input.type === 'number') {
                input.addEventListener('blur', () => {
                    validateInput(input);
                    saveData();
                });
            }
        });
    }

    // 초기화
    function init() {
        loadData();
        setupEventListeners();
        calculateTotals();
        setActiveNavLink();
    }

    // 페이지 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

