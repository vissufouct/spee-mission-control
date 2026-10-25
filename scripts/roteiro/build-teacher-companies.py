"""Generate independent fictional teacher companies from the current roadmap.

The two student-backed companies are added separately by the composition layer.
No student records, storage, official receipts or submitted files are copied.
"""
import copy
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'frontend/src/data'
source = json.loads((DATA / 'student-roadmap-example-2.fixture.json').read_text())
target = DATA / 'teacher-roadmap.fixture.json'
seed = json.loads(target.read_text())
seed['classes'] = [
    {'id': 'turma-a', 'name': 'Turma A', 'subject': 'Contabilidade Aplicada', 'year': 2026},
    {'id': 'turma-b', 'name': 'Turma B', 'subject': 'Gestão Empresarial', 'year': 2026},
    {'id': 'turma-c', 'name': 'Turma C', 'subject': 'Empreendedorismo', 'year': 2026},
]
# Explicit scenario checkpoints: confirmed tasks, next task in progress and due date.
profiles = [
    ('maputo-solucoes', 'Maputo Soluções, Lda.', 'turma-a', ['Leila Faife', 'Carla Nhampossa', 'Paulo Sitoe'], 48, None),
    ('beira-logistica', 'Beira Logística, Lda.', 'turma-a', ['Celina Bila', 'Elias Macamo', 'Rosa Chissano'], 40, '2026-10-27'),
    ('indico-servicos', 'Índico Serviços, Lda.', 'turma-b', ['Marta Matavele', 'Luís Mucavele', 'Sónia Massango'], 32, '2026-10-29'),
    ('zambeze-comercial', 'Zambeze Comercial, Lda.', 'turma-b', ['Bento Nhantumbo', 'Lídia Cossa', 'Rui Chauque'], 27, '2026-10-26'),
    ('nova-geracao', 'Nova Geração, Lda.', 'turma-b', ['Dina Mondlane', 'Filipe Chongo', 'Isabel Matusse'], 23, '2026-10-23'),
    ('lurio-digital', 'Lúrio Digital, Lda.', 'turma-c', ['Nádia Muave', 'Amílcar Momade', 'Júlia Mussá'], 17, '2026-10-28'),
    ('pemba-turismo', 'Pemba Turismo, Lda.', 'turma-c', ['Salimo Omar', 'Fátima Assane', 'Eva Mussa'], 9, '2026-10-30'),
    ('inhambane-criativa', 'Inhambane Criativa, Lda.', 'turma-c', ['Brígida Nhantumbo', 'Tomás Langa', 'Albertina Muchanga'], 2, '2026-10-31'),
]
all_activities = [a for b in source['blocks'] for a in b['activities']]
all_tasks = [t for a in all_activities for t in a['tasks']]
positions = {t['id']: i for i, t in enumerate(all_tasks)}
base_date = datetime(2026, 10, 20, 8, tzinfo=timezone.utc)

def status(tasks):
    states = [task['status'] for task in tasks]
    if all(s == 'completed' for s in states):
        return 'completed'
    if any(s in ('completed', 'in-progress') for s in states):
        return 'in-progress'
    return 'blocked' if all(s == 'blocked' for s in states) else 'not-started'

companies = []
for company_id, name, class_id, members, completed, due in profiles:
    people = [{'id': f'{company_id}-member-{i+1}', 'name': person,
               'initials': ''.join(word[0] for word in person.split()[:2])} for i, person in enumerate(members)]
    company = {'id': company_id, 'name': name, 'classId': class_id,
               'routeId': seed['routes'][0]['id'], 'definitionVersion': source['context']['roadmapVersion'],
               'currentBlockId': '', 'linkedToStudent': False, 'participants': people,
               'blocks': [], 'activities': [], 'events': [], 'results': []}
    for block in source['blocks']:
        activities = []
        for activity in block['activities']:
            tasks = []
            events = []
            for original in activity['tasks']:
                task = {key: copy.deepcopy(original[key]) for key in
                        ('id', 'title', 'description', 'kind', 'resource', 'required', 'questions') if key in original}
                position = positions[task['id']]
                missing = [key for key in original.get('dependsOn', []) if positions[key] >= completed]
                task['status'] = 'completed' if position < completed else 'blocked' if missing else 'in-progress' if position == completed else 'not-started'
                if missing:
                    task['description'] = 'Antes de continuar, conclua: ' + '; '.join(all_tasks[positions[key]]['title'] for key in missing[:3]) + '.'
                if position < completed:
                    instant = (base_date + timedelta(hours=position)).isoformat().replace('+00:00', 'Z')
                    task['completedAt'] = instant
                    actor = people[position % len(people)]
                    if task['kind'] == 'quiz':
                        task['answers'] = {q['id']: q['correct'] for q in task['questions']}
                        if original.get('quizMode') == 'diagnostic':
                            q = task['questions'][-1]
                            task['answers'][q['id']] = (q['correct'] + 1) % len(q['options'])
                    if task['kind'] == 'evidence':
                        # A fictional submission record, with no borrowed document or author.
                        task.pop('resource', None)
                        task['submission'] = {'fileName': f'{company_id}-{task["id"]}.pdf',
                                              'submittedBy': actor['name'], 'submittedAt': instant}
                    events.append({'id': f'{company_id}-{task["id"]}', 'activityId': activity['id'],
                                   'occurredAt': instant, 'actorIds': [actor['id']], 'role': 'student',
                                   'category': 'individual', 'message': 'Confirmação simulada da tarefa: ' + task['title'],
                                   'previousStatus': None, 'newStatus': 'in-progress', 'resultId': None, 'confirmed': True})
                tasks.append(task)
            activity_status = status(tasks)
            if events and activity_status == 'completed':
                events[-1]['newStatus'] = 'completed'
            dependencies = {key for t in activity['tasks'] for key in t.get('dependsOn', [])}
            activities.append({'id': activity['id'], 'title': activity['title'], 'blockId': block['id'], 'milestone': block['id'],
                               'status': activity_status, 'participantIds': list(dict.fromkeys(p for e in events for p in e['actorIds'])),
                               'dueDate': due if activity_status == 'in-progress' else None,
                               'module': 'Roteiro de Tarefas', 'description': activity['description'],
                               'definitionOfDone': 'Todas as tarefas obrigatórias têm conclusão confirmada. Registos fictícios para validar a interface.',
                               'nextStep': next((t['title'] for t in tasks if t['status'] == 'in-progress'), next((t['title'] for t in tasks if t['status'] == 'not-started'), '')),
                               'resultIds': [], 'tasks': tasks,
                               'dependencyIds': [a['id'] for a in all_activities if a['id'] != activity['id'] and any(t['id'] in dependencies for t in a['tasks'])]})
            company['events'].extend(events)
        company['activities'].extend(activities)
        company['blocks'].append({'id': block['id'], 'title': block['title'], 'state': status(activities) if activities else 'unavailable'})
    company['currentBlockId'] = next((b['id'] for b in company['blocks'] if b['state'] not in ('completed', 'unavailable')), source['blocks'][-2]['id'])
    companies.append(company)
seed['companies'] = companies
with target.open('w') as output:
    json.dump(seed, output, ensure_ascii=False, indent=2)
    output.write('\n')
print(f'{len(companies)} independent companies, {len(all_activities)} activities and {len(all_tasks)} tasks each.')
