#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
개인 노후설계 관리 웹페이지 서버
Python Flask를 사용한 간단한 웹 서버
"""

from flask import Flask, render_template
import os
import webbrowser
import threading
import time
from config import get_config

# 설정 로드
config = get_config()
app = Flask(__name__)
app.config.from_object(config)

@app.route('/')
def dashboard():
    """노후설계 대시보드 페이지"""
    return render_template('dashboard.html')

@app.route('/simulator')
def simulator():
    """은퇴 후 생활비 시뮬레이터 페이지"""
    return render_template('simulator.html')

def open_browser():
    """서버가 시작된 후 브라우저를 자동으로 엽니다"""
    # 서버가 완전히 시작될 때까지 대기
    time.sleep(config.BROWSER_OPEN_DELAY)
    url = config.get_base_url()
    try:
        # Windows 환경에서 기본 브라우저 열기
        webbrowser.open(url)
        print(f"브라우저가 자동으로 열렸습니다: {url}")
    except Exception as e:
        # 브라우저 열기 실패 시 에러 메시지 출력
        print(f"⚠️  브라우저 자동 실행 실패: {e}")
        print(f"수동으로 브라우저에서 {url} 을 열어주세요")

if __name__ == '__main__':
    # 로컬 개발 서버 실행
    print("=" * 50)
    print("개인 노후설계 관리 웹페이지 서버 시작")
    print(f"환경: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"호스트: {config.HOST}")
    print(f"포트: {config.PORT}")
    print(f"디버그 모드: {config.DEBUG}")
    print("=" * 50)
    
    # Flask의 debug 모드 reloader는 두 개의 프로세스를 생성합니다
    # WERKZEUG_RUN_MAIN 환경 변수가 설정된 경우가 실제 서버 프로세스입니다
    # 이렇게 하면 브라우저가 한 번만 열립니다
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' and config.AUTO_OPEN_BROWSER:
        # 실제 서버 프로세스에서만 브라우저 자동 실행
        # 브라우저 자동 실행을 별도 스레드에서 실행
        # (서버가 시작되기 전에 브라우저를 열려고 하면 실패할 수 있음)
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True  # 메인 스레드 종료 시 함께 종료
        browser_thread.start()
        print("브라우저가 자동으로 열립니다...")
        print(f"(자동 실행이 실패하면 수동으로 {config.get_base_url()} 을 열어주세요)")
    
    print("=" * 50)
    app.run(debug=config.DEBUG, host=config.HOST, port=config.PORT)

