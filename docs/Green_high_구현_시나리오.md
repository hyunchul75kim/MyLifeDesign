# GREEN 단계 구현 시나리오
## 높은 우선순위 항목 최소 단위 구현 계획

**작성 일자**: 2024년 12월 19일  
**대상**: README.md 111-150줄 (높은 우선순위 항목)  
**원칙**: TDD - 테스트를 통과시키는 최소한의 코드만 구현

---

## 📋 현재 상태 분석

### 이미 구현된 기능
- ✅ HTML 구조: 대시보드 입력 필드들이 모두 존재
- ✅ localStorage 저장/로드 기본 구조
- ✅ 자산/수입/지출 합계 계산 기본 로직
- ✅ 네비게이션 바 HTML 구조

### 미구현/보완 필요 기능
- ❌ 네비게이션 JavaScript 로직 (현재 페이지 감지, 활성 링크)
- ❌ 입력 필드 ID 일관성 (HTML과 체크리스트의 ID 불일치)
- ❌ 엣지 케이스 처리 강화
- ❌ 데이터 로드 후 합계 재계산 보장
- ❌ UI/UX 개선 (레이아웃, 가독성)

---

## 🎯 구현 시나리오

### Phase 1: 네비게이션 기능 구현 (최우선)

#### 목표
- 대시보드 ↔ 시뮬레이터 페이지 이동
- 현재 페이지 자동 감지 및 활성 링크 표시

#### 구현 내용
1. **JavaScript 네비게이션 로직 추가** (`static/js/dashboard.js`)
   - 현재 URL 경로 감지 함수
   - 활성 링크에 `active` 클래스 추가
   - 페이지 로드 시 자동 실행

2. **시뮬레이터 페이지에도 동일 로직 적용** (`static/js/simulator.js`)
   - 동일한 네비게이션 로직 추가

3. **CSS 활성 링크 스타일** (`static/css/style.css`)
   - `.nav-link.active` 스타일 정의

#### 예상 코드 변경
- `dashboard.js`: +10줄 (네비게이션 로직)
- `simulator.js`: +10줄 (네비게이션 로직)
- `style.css`: +5줄 (활성 링크 스타일)

---

### Phase 2: 입력 필드 ID 정리 및 데이터 저장 보완

#### 목표
- HTML ID와 체크리스트 요구사항 일치
- 모든 입력 필드 저장/로드 보장
- 데이터 로드 후 합계 재계산

#### 구현 내용
1. **HTML ID 확인 및 정리** (`templates/dashboard.html`)
   - 현재 상태: `cash`, `pension`, `otherAssets` → 체크리스트: `cashDeposit`, `pension`, `otherAssets`
   - 현재 상태: `workIncome`, `otherIncome` → 체크리스트: `laborIncome`, `otherIncome`
   - **결정**: 기존 ID 유지 (이미 작동 중) 또는 체크리스트에 맞춰 변경
   - **권장**: 기존 ID 유지 (최소 변경 원칙)

2. **데이터 저장/로드 보완** (`static/js/dashboard.js`)
   - 모든 입력 필드가 확실히 저장되도록 보장
   - 데이터 로드 후 `calculateTotals()` 호출 보장
   - 에러 처리 강화

#### 예상 코드 변경
- `dashboard.js`: +5줄 (데이터 로드 후 합계 재계산 보장)

---

### Phase 3: 엣지 케이스 처리 강화

#### 목표
- 음수 입력 완전 차단
- 빈 값 처리 보장
- 큰 숫자 포맷팅

#### 구현 내용
1. **HTML 속성 확인** (`templates/dashboard.html`)
   - 모든 숫자 입력 필드에 `min="0"` 확인
   - 현재: 대부분 있음 ✅

2. **JavaScript 검증 강화** (`static/js/dashboard.js`)
   - 입력 값 검증 함수 추가
   - 음수 입력 시 0으로 자동 변경
   - 빈 값 처리 (`|| 0` 패턴 확인)

3. **큰 숫자 포맷팅** (`static/js/dashboard.js`)
   - `toLocaleString()` 사용 확인 (이미 구현됨 ✅)
   - 합계 표시에 천 단위 구분 적용

#### 예상 코드 변경
- `dashboard.js`: +15줄 (검증 함수 및 이벤트 리스너)

---

### Phase 4: UI/UX 사용성 개선 (최소 변경)

#### 목표
- 레이아웃 최적화 (섹션 구분 명확화)
- 가독성 개선 (제목 강조, 입력 필드 연결)

#### 구현 내용
1. **CSS 개선** (`static/css/style.css`)
   - 섹션 간 여백 조정
   - 섹션 제목 스타일 강조 (font-size, font-weight)
   - 입력 필드와 레이블 연결 명확화

2. **레이아웃 구조 확인**
   - 중요한 정보 상단 배치 확인 (현재 상태 요약이 최상단 ✅)
   - 정보 계층 구조 확인

#### 예상 코드 변경
- `style.css`: +20줄 (섹션 스타일, 제목 강조)

---

### Phase 5: 브라우저 호환성 검증 준비

#### 목표
- 코드가 Chrome, Edge에서 정상 작동하도록 보장
- 호환성 이슈 최소화

#### 구현 내용
1. **호환성 확인 사항**
   - localStorage 사용 (모든 브라우저 지원 ✅)
   - `toLocaleString()` 사용 (모든 브라우저 지원 ✅)
   - `addEventListener` 사용 (모든 브라우저 지원 ✅)

2. **테스트 체크리스트 작성**
   - Chrome에서 기능 테스트 항목
   - Edge에서 기능 테스트 항목

#### 예상 코드 변경
- 문서화만 (실제 코드 변경 없음)

---

## 📝 구현 순서 및 우선순위

### 1단계: 네비게이션 기능 (가장 간단, 즉시 효과)
- **예상 시간**: 15분
- **복잡도**: 낮음
- **영향도**: 높음 (사용자 경험 개선)

### 2단계: 데이터 저장 보완
- **예상 시간**: 10분
- **복잡도**: 낮음
- **영향도**: 중간 (기능 안정성)

### 3단계: 엣지 케이스 처리
- **예상 시간**: 20분
- **복잡도**: 중간
- **영향도**: 높음 (데이터 무결성)

### 4단계: UI/UX 개선
- **예상 시간**: 15분
- **복잡도**: 낮음
- **영향도**: 중간 (사용자 경험)

### 5단계: 브라우저 호환성
- **예상 시간**: 10분 (테스트만)
- **복잡도**: 낮음
- **영향도**: 중간

---

## 🔍 상세 구현 계획

### Phase 1: 네비게이션 기능 상세

#### 파일: `static/js/dashboard.js`
```javascript
// 네비게이션 활성 링크 설정
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// init() 함수에 추가
function init() {
    loadData();
    setupEventListeners();
    calculateTotals();
    setActiveNavLink(); // 추가
}
```

#### 파일: `static/js/simulator.js`
- 동일한 `setActiveNavLink()` 함수 추가

#### 파일: `static/css/style.css`
```css
.nav-link.active {
    background-color: #2563eb;
    color: white;
    font-weight: bold;
}
```

---

### Phase 2: 데이터 저장 보완 상세

#### 파일: `static/js/dashboard.js`
```javascript
// loadData() 함수 수정
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
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
            // 데이터 로드 후 합계 재계산 추가
            calculateTotals();
        } catch (e) {
            console.error('데이터 로드 실패:', e);
        }
    }
}
```

---

### Phase 3: 엣지 케이스 처리 상세

#### 파일: `static/js/dashboard.js`
```javascript
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

// setupEventListeners() 수정
function setupEventListeners() {
    const inputs = document.querySelectorAll('input[type="number"], textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input); // 검증 추가
            saveData();
            if (input.id === 'cash' || input.id === 'pension' || input.id === 'otherAssets' ||
                input.id === 'workIncome' || input.id === 'otherIncome' ||
                input.id === 'fixedExpense' || input.id === 'livingExpense') {
                calculateTotals();
            }
        });
        
        // blur 이벤트로 포커스 잃을 때도 검증
        input.addEventListener('blur', () => {
            validateInput(input);
            saveData();
        });
    });
}
```

---

### Phase 4: UI/UX 개선 상세

#### 파일: `static/css/style.css`
```css
/* 섹션 스타일 개선 */
.section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;
}

.section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #1f2937;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 0.5rem;
}

/* 입력 필드와 레이블 연결 개선 */
.summary-item label,
.asset-item label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #374151;
}
```

---

## ✅ 검증 체크리스트

### Phase 1: 네비게이션
- [ ] 대시보드 페이지에서 "대시보드" 링크가 활성화됨
- [ ] 시뮬레이터 페이지에서 "생활비 계산" 링크가 활성화됨
- [ ] 페이지 이동 시 활성 링크가 올바르게 변경됨

### Phase 2: 데이터 저장
- [ ] 입력 후 페이지 새로고침 시 데이터 유지
- [ ] 데이터 로드 후 합계가 올바르게 표시됨
- [ ] 모든 입력 필드가 저장/로드됨

### Phase 3: 엣지 케이스
- [ ] 음수 입력 시 0으로 자동 변경
- [ ] 빈 값 입력 시 0으로 처리
- [ ] 합계 계산이 정확함

### Phase 4: UI/UX
- [ ] 섹션 구분이 명확함
- [ ] 제목이 강조되어 보임
- [ ] 레이블과 입력 필드 연결이 명확함

### Phase 5: 브라우저 호환성
- [ ] Chrome에서 모든 기능 정상 작동
- [ ] Edge에서 모든 기능 정상 작동

---

## 📊 예상 결과

### 구현 후 상태
- ✅ 네비게이션 기능 완전 구현
- ✅ 데이터 저장/로드 안정성 향상
- ✅ 엣지 케이스 처리 강화
- ✅ UI/UX 개선
- ✅ 브라우저 호환성 확인

### 코드 변경 통계
- **JavaScript**: +40줄 (dashboard.js, simulator.js)
- **CSS**: +25줄 (style.css)
- **총 변경**: 약 65줄 추가

---

## 🚀 승인 요청

이 시나리오대로 구현을 진행할까요?

**구현 원칙:**
1. 최소한의 코드만 추가 (TDD 원칙)
2. 기존 코드 최대한 활용
3. 단계별로 검증하며 진행
4. 각 Phase 완료 후 테스트

**예상 소요 시간:** 약 1시간

---

**문서 작성일**: 2024년 12월 19일  
**상태**: ⏳ 승인 대기

