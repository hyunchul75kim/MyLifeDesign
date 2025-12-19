// 노후설계 대시보드 JavaScript
// localStorage를 사용하여 데이터 저장

(function() {
    'use strict';

    // localStorage 키
    const STORAGE_KEY = 'retirement_dashboard_data';

    // 데이터 로드
    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // 각 필드에 저장된 값 적용
                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = data[key];
                        } else {
                            element.value = data[key];
                        }
                    }
                });
                // 데이터 로드 후 합계 재계산
                calculateTotals();
            } catch (e) {
                console.error('데이터 로드 실패:', e);
            }
        }
    }

    // 데이터 저장
    function saveData() {
        const data = {};
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.id) {
                if (input.type === 'checkbox') {
                    data[input.id] = input.checked;
                } else {
                    data[input.id] = input.value;
                }
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 자산 합계 계산
    function calculateTotals() {
        // 자산 합계
        const cash = parseFloat(document.getElementById('cash').value) || 0;
        const pension = parseFloat(document.getElementById('pension').value) || 0;
        const otherAssets = parseFloat(document.getElementById('otherAssets').value) || 0;
        const totalAssets = cash + pension + otherAssets;
        document.getElementById('totalAssets').textContent = Math.round(totalAssets).toLocaleString();

        // 수입 합계
        const workIncome = parseFloat(document.getElementById('workIncome').value) || 0;
        const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
        const totalIncome = workIncome + otherIncome;
        document.getElementById('totalIncome').textContent = Math.round(totalIncome).toLocaleString();

        // 지출 합계
        const fixedExpense = parseFloat(document.getElementById('fixedExpense').value) || 0;
        const livingExpense = parseFloat(document.getElementById('livingExpense').value) || 0;
        const totalExpense = fixedExpense + livingExpense;
        document.getElementById('totalExpense').textContent = Math.round(totalExpense).toLocaleString();
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

