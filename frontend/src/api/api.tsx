import { apiAddr } from "../config";
import { Project, ProjectFilter, ProjectTask, ProjectWorker } from "../models/models";

const getProjects = (): Promise<Project[]> => {
    return fetch(apiAddr + "/projects")
        .then(res => {
            return (res.json() as any) as Project[];
        }).then(res => {
            res.forEach(el => {
                //фикс того факта что res.json парсит дату как обычную строку, а не как объект
                el.startDate = new Date(el.startDate);
                el.endDate = el.endDate ? new Date(el.endDate) : undefined;
            });
            return res;
        });
}

const getFilteredProjects = (filter: ProjectFilter): Promise<Project[]> => {
    console.log("filter:", filter);
    var _filter: any = { ...filter };
    for (let param in _filter) {
        if (_filter[param] === undefined
            || _filter[param] === null
            || _filter[param] === ""
        ) {
            delete _filter[param];
            continue;
        }
        //TODO: рефакторинг дат, пока с типом Date от typescript рабоатется плохо
        if (Date.prototype.isPrototypeOf(_filter[param])) {
            _filter[param] = (new Date(_filter[param])).toJSON();
        }
    }

    //@ts-ignore
    return fetch(apiAddr + "/projects/FilterProjects?" + new URLSearchParams({ ..._filter }))
        .then(res => {
            if (res.ok)
                return (res.json() as any) as Project[];
            else return []
        }).then(res => {
            res.forEach(el => {
                el.startDate = new Date(el.startDate);
                el.endDate = el.endDate ? new Date(el.endDate) : undefined;
            });
            return res;
        });
}

const deleteProject = (id: number): Promise<string> => {
    return fetch(apiAddr + "/projects/DeleteProject?id=" + id, { method: 'DELETE' })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any).errorMessage);
                return (res.body as any).errorMessage;
            }
        });
}

const updateProject = (proj: Project): Promise<string> => {
    return fetch(apiAddr + "/projects/UpdateProject",
        {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(proj)
        })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any));
                return (res.body as any).errorMessage;
            }
        });
}

const addProject = (proj: Project): Promise<string> => {
    return fetch(apiAddr + "/projects/AddProject",
        {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(proj)
        })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any));
                return (res.body as any).errorMessage;
            }
        });
}

const getWorkers = (): Promise<ProjectWorker[]> => {
    return fetch(apiAddr + "/workers")
        .then(res => {
            return (res.json() as any) as ProjectWorker[];
        })
}

const deleteWorker = (id: number): Promise<string> => {
    return fetch(apiAddr + "/workers/DeleteWorker?id=" + id, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any));
                return (res.body as any).errorMessage;
            }
        })
}

const updateWorker = (worker: ProjectWorker) => {
    return fetch(apiAddr + "/workers/UpdateWorker",
        {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(worker)
        })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any));
                return (res.body as any).errorMessage;
            }
        });
}

const addWorker = (worker: ProjectWorker) => {
    return fetch(apiAddr + "/workers/AddWorker",
        {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(worker)
        })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any));
                return (res.body as any).errorMessage;
            }
        });
}

const getTasks = (projectId?: number): Promise<ProjectTask[]> => {
    var str = "";
    if (projectId) str = "?projectId=" + projectId;

    return fetch(apiAddr + "/tasks" + str)
        .then(res => {
            return res.json();
        })
}

const updateTasks = (tasks: ProjectTask[], projectId: number) => {
    return fetch(apiAddr + "/tasks/UpdateTasks?projectId=" + projectId,
        {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(tasks)
        })
        .then(res => {
            if (res.ok)
                return ""
            else {
                console.error((res.body as any));
                return (res.body as any).errorMessage;
            }
        });
}

export {
    getProjects,
    getFilteredProjects,
    deleteProject,
    updateProject,
    getWorkers,
    addProject,
    deleteWorker,
    updateWorker,
    addWorker,
    getTasks,
    updateTasks
}