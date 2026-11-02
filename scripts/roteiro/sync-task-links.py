"""Apply the editable Markdown link catalogue to both roadmap fixtures."""
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
CATALOGUE = ROOT / 'output/mission_control_unificado/Links_Provisorios_Tarefas.md'

def sync():
    links = {}
    for line in CATALOGUE.read_text().splitlines():
        if not line.startswith('| b'):
            continue
        parts = [cell.strip() for cell in line.strip('|').split('|')]
        if len(parts) != 4:
            raise ValueError(f'Linha inválida: {line}')
        task_id, _, label, url = parts
        parsed = urlsplit(url)
        if not label or parsed.scheme != 'https' or not parsed.netloc or parsed.username or any(c.isspace() for c in url):
            raise ValueError(f'Link inválido na tarefa {task_id}')
        links.setdefault(task_id, []).append({'label': label, 'url': url})
    if not links:
        raise ValueError('Catálogo vazio')
    updates = []
    for path in sorted((ROOT / 'frontend/src/data').glob('student-roadmap-example-*.fixture.json')):
        data = json.loads(path.read_text())
        tasks = {t['id']: t for b in data['blocks'] for a in b['activities'] for t in a.get('tasks', [])}
        if links.keys() - tasks.keys():
            raise ValueError(f'Tarefas desconhecidas: {links.keys() - tasks.keys()}')
        for task_id, items in links.items():
            tasks[task_id]['links'] = items
            if tasks[task_id]['kind'] == 'url':
                tasks[task_id]['resource'] = items[0]['url']
        updates.append((path, data))
    teacher_path = ROOT / 'frontend/src/data/teacher-roadmap.fixture.json'
    teacher = json.loads(teacher_path.read_text())
    for company in teacher['companies']:
        for activity in company['activities']:
            for task in activity.get('tasks', []):
                if task['id'] in links:
                    task['links'] = links[task['id']]
                    if task['kind'] == 'url':
                        task['resource'] = links[task['id']][0]['url']
    updates.append((teacher_path, teacher))
    for path, data in updates:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'{sum(map(len, links.values()))} links aplicados a {len(links)} tarefas nos dois exemplos e no cenário docente.')

if __name__ == '__main__':
    sync()
