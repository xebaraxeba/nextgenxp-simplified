from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend

# Caminho para o arquivo de dados
DATA_FILE = 'data.json'

def load_data():
    """Carrega os dados do arquivo JSON ou retorna dados padrão se o arquivo não existir."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        # Dados padrão para o protótipo
        return {
            "projects": [
                {
                    "id": "proj1",
                    "name": "Projeto Alpha",
                    "description": "Descrição do Projeto Alpha - Um projeto de exemplo para demonstração.",
                    "flowchart": {
                        "nodes": [
                            {"id": "1", "data": {"label": "Início"}, "position": {"x": 250, "y": 5}},
                            {"id": "2", "data": {"label": "Tarefa A"}, "position": {"x": 100, "y": 100}},
                            {"id": "3", "data": {"label": "Tarefa B"}, "position": {"x": 400, "y": 100}},
                            {"id": "4", "data": {"label": "Fim"}, "position": {"x": 250, "y": 200}}
                        ],
                        "edges": [
                            {"id": "e1-2", "source": "1", "target": "2"},
                            {"id": "e1-3", "source": "1", "target": "3"},
                            {"id": "e2-4", "source": "2", "target": "4"},
                            {"id": "e3-4", "source": "3", "target": "4"}
                        ]
                    }
                },
                {
                    "id": "proj2",
                    "name": "Projeto Beta",
                    "description": "Descrição do Projeto Beta - Outro projeto de exemplo.",
                    "flowchart": {
                        "nodes": [
                            {"id": "1", "data": {"label": "Fase 1"}, "position": {"x": 250, "y": 5}},
                            {"id": "2", "data": {"label": "Fase 2"}, "position": {"x": 250, "y": 100}},
                            {"id": "3", "data": {"label": "Fase 3"}, "position": {"x": 250, "y": 200}}
                        ],
                        "edges": [
                            {"id": "e1-2", "source": "1", "target": "2"},
                            {"id": "e2-3", "source": "2", "target": "3"}
                        ]
                    }
                }
            ]
        }

def save_data(data):
    """Salva os dados no arquivo JSON."""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Retorna a lista de todos os projetos."""
    data = load_data()
    return jsonify(data['projects'])

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    """Retorna um projeto específico pelo ID."""
    data = load_data()
    project = next((p for p in data['projects'] if p['id'] == project_id), None)
    if project:
        return jsonify(project)
    else:
        return jsonify({"error": "Projeto não encontrado"}), 404

@app.route('/api/projects/<project_id>/flowchart', methods=['PUT'])
def update_flowchart(project_id):
    """Atualiza o fluxograma de um projeto específico."""
    data = load_data()
    project = next((p for p in data['projects'] if p['id'] == project_id), None)
    
    if not project:
        return jsonify({"error": "Projeto não encontrado"}), 404
    
    flowchart_data = request.json
    project['flowchart'] = flowchart_data
    save_data(data)
    
    return jsonify({"message": "Fluxograma atualizado com sucesso"})

@app.route('/api/projects', methods=['POST'])
def create_project():
    """Cria um novo projeto."""
    data = load_data()
    new_project = request.json
    
    # Gerar um ID único simples
    new_id = f"proj{len(data['projects']) + 1}"
    new_project['id'] = new_id
    
    # Fluxograma padrão se não fornecido
    if 'flowchart' not in new_project:
        new_project['flowchart'] = {
            "nodes": [{"id": "1", "data": {"label": "Início"}, "position": {"x": 250, "y": 5}}],
            "edges": []
        }
    
    data['projects'].append(new_project)
    save_data(data)
    
    return jsonify(new_project), 201

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificação de saúde da API."""
    return jsonify({"status": "OK", "message": "API NextGenXP funcionando"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
