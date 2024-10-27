from flask import Flask, render_template, jsonify, send_file
from flask_socketio import SocketIO
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rlofc.ofc_environment import OFCEnvironment, OFCEnv
from rlofc.ofc_agent import OFCRLAgent, OFCHumanAgent, OFCRandomAgent
from rlofc.gamestate_encoder import SelfRankBinaryEncoder
from rlofc.ofc_board import OFCBoard
from .game_manager import GameManager

app = Flask(__name__)
socketio = SocketIO(app)
game_manager = GameManager()

@app.route('/')
def index():
    return render_template('base.html', mode='index')

@app.route('/mode1')
def mode1():
    """Режим ИИ против ИИ"""
    return render_template('mode1.html', mode='mode1')

@app.route('/mode2')
def mode2():
    """Тренировочный режим"""
    return render_template('mode2.html', mode='mode2')

@app.route('/mode3')
def mode3():
    """Режим игры против ИИ"""
    return render_template('mode3.html', mode='mode3')

@app.route('/download_progress')
def download_progress():
    """Скачивание прогресса обучения ИИ"""
    try:
        return send_file(
            'checkpoints/latest.ckpt',
            as_attachment=True,
            download_name='ofc_model_progress.ckpt'
        )
    except Exception as e:
        return str(e), 400

@socketio.on('start_game')
def handle_start(data):
    """Начало игры в любом режиме"""
    mode = data['mode']
    try:
        if mode == 'mode1':
            # Режим ИИ против ИИ (3 игрока)
            result = game_manager.start_ai_vs_ai()
        elif mode == 'mode2':
            # Тренировочный режим
            time_limit = data.get('time_limit', 5)
            result = game_manager.start_training_mode(time_limit)
        else:
            # Режим игры против ИИ
            ai_players = data.get('ai_players', 1)
            result = game_manager.start_human_vs_ai(ai_players)
        return jsonify({'status': 'success', 'data': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@socketio.on('distribute_cards')
def handle_distribution(data):
    """Распределение карт в тренировочном режиме"""
    try:
        distribution = game_manager.distribute_cards(
            input_cards=data['inputCards'],
            known_cards=data['knownCards'],
            time_limit=data['timeLimit']
        )
        return jsonify({
            'status': 'success',
            'distribution': distribution
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@socketio.on('make_move')
def handle_move(data):
    """Обработка хода в режиме игры против ИИ"""
    try:
        result = game_manager.make_move(
            card=data['card'],
            position=data['position'],
            player_type=data['playerType']
        )
        return jsonify({
            'status': 'success',
            'result': result
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@socketio.on('pause_training')
def handle_pause():
    """Пауза режима тренировки"""
    game_manager.pause_training()
    return jsonify({'status': 'paused'})

@socketio.on('save_progress')
def handle_save():
    """Сохранение прогресса обучения"""
    try:
        game_manager.save_progress()
        return jsonify({'status': 'saved'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    socketio.run(app, debug=True)
