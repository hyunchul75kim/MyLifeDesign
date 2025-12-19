#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
개인 노후설계 관리 웹페이지 서버
Python Flask를 사용한 간단한 웹 서버
"""

from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def dashboard():
    """노후설계 대시보드 페이지"""
    return render_template('dashboard.html')

@app.route('/simulator')
def simulator():
    """은퇴 후 생활비 시뮬레이터 페이지"""
    return render_template('simulator.html')

if __name__ == '__main__':
    # 로컬 개발 서버 실행
    print("=" * 50)
    print("개인 노후설계 관리 웹페이지 서버 시작")
    print("=" * 50)
    print("브라우저에서 http://localhost:5000 을 열어주세요")
    print("=" * 50)
    app.run(debug=True, host='127.0.0.1', port=5000)

