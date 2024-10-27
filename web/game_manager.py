import sys
sys.path.append('..')
from rlofc.ofc_environment import OFCEnvironment
from rlofc.ofc_agent import OFCRLAgent, OFCHumanAgent

class GameManager:
    def __init__(self):
        self.current_mode = None
        self.ai_agents = []
        self.current_game = None
        
    def start_game(self, mode, data):
        self.current_mode = mode
        if mode == 'mode1':
            return self.start_ai_vs_ai()
        elif mode == 'mode2':
            return self.start_training_mode(data.get('time_limit', 5))
        else:
            return self.start_human_vs_ai(data.get('ai_players', 1))
            
    def start_ai_vs_ai(self):
        self.ai_agents = [OFCRLAgent() for _ in range(3)]
        self.current_game = OFCEnvironment(self.ai_agents[0], self.ai_agents[1])
        return {'status': 'started', 'mode': 'ai_vs_ai'}

    def start_training_mode(self, time_limit):
        self.ai_agent = OFCRLAgent()
        return {'status': 'started', 'mode': 'training'}

    def start_human_vs_ai(self, ai_players):
        self.ai_agents = [OFCRLAgent() for _ in range(ai_players)]
        self.human = OFCHumanAgent("Player")
        self.current_game = OFCEnvironment(self.human, self.ai_agents[0])
        return {'status': 'started', 'mode': 'human_vs_ai'}
