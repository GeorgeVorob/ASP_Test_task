import { useEffect, useState } from "react";
import { getWorkers } from "../../../api/api";
import { Project, ProjectWorker } from "../../../models/models";

import * as RB from 'react-bootstrap'


export type ProjectsFilterProps = {
    createCallback: (proj: Project) => void,
    updateCallback: (proj: Project) => void,
    deleteCallback: (id: number) => void,
    initialObject: Project | null
}

const ProjectsEditor = (props: ProjectsFilterProps) => {
    const [workers, setWorkers] = useState<ProjectWorker[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);


    useEffect(() => {
        getWorkers().then(_workers => {
            console.log("workers:", _workers);
            setWorkers(_workers);
        })
    }, []);

    useEffect(() => {
        setEditingProject(props.initialObject ? { ...props.initialObject } : null);
    }, [props.initialObject])

    const createOrUpdateBtnHandle = (proj: Project) => {
        if (proj.id) {
            props.updateCallback(proj);
        } else {
            props.createCallback(proj);
        }
    }

    const selectedFormChangeHandle = (e: any) => {
        if (editingProject) {
            let { name, value } = e.target;
            if (name == "startDate" || name == "endDate")
                value = new Date(value);
            setEditingProject({
                ...editingProject,
                [name]: value,
            });
        }
    }

    const moveWorkersBtnHandle = (id: number, add: boolean) => {
        if (editingProject) {
            let newVal = { ...editingProject };
            if (add && !newVal.workersIds.includes(id))
                newVal.workersIds.push(id);
            else
                newVal.workersIds = newVal.workersIds.filter(w => w !== id);
            setEditingProject(newVal);
            console.log("new selected:", newVal);
        }
    }

    const setManagerHandle = (id: number) => {
        if (editingProject)
            setEditingProject({ ...editingProject, managerId: id });
    }

    if (editingProject?.managerId)
        var manager = workers.find(w => w.id! == editingProject.managerId);
    return (
        <>
            {editingProject === null ? (<h4>Выберите проект для просмотра\редактирования в списке</h4>) : (
                <>
                    <form
                        onSubmit={(e: any) => {
                            console.log("e:", e);
                            e.preventDefault();
                            e.target.reportValidity();
                            createOrUpdateBtnHandle(editingProject);
                        }}
                    >

                        <RB.Row>
                            <RB.Col sm={3}>
                                <label>Название</label><br />
                                <input
                                    required
                                    value={editingProject.name}
                                    type="text"
                                    name="name"
                                    onChange={(e) => selectedFormChangeHandle(e)}
                                />
                            </RB.Col>
                            <RB.Col sm={3}>
                                <label>Клиент</label><br />
                                <input
                                    required
                                    value={editingProject.client}
                                    type="text"
                                    name="client"
                                    onChange={(e) => selectedFormChangeHandle(e)}
                                />
                            </RB.Col>
                            <RB.Col sm={3}>
                                <label>Исполнитель</label><br />
                                <input
                                    required
                                    value={editingProject.performer}
                                    type="text"
                                    name="performer"
                                    onChange={(e) => selectedFormChangeHandle(e)}
                                />
                            </RB.Col>
                            <RB.Col sm={3}>
                                <label>Дата начала</label><br />
                                <input
                                    required
                                    value={editingProject.startDate.toISOString().substring(0, 10)}
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => selectedFormChangeHandle(e)}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </RB.Col>
                            <RB.Col sm={3}>
                                <label>Дата окончания</label><br />
                                <input
                                    value={editingProject.endDate?.toISOString().substring(0, 10) || ""}
                                    type="date"
                                    name="endDate"
                                    onChange={(e) => selectedFormChangeHandle(e)}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </RB.Col>
                            <RB.Col sm={3}>
                                <label>Приоритет</label><br />
                                <input
                                    required
                                    value={editingProject.priority}
                                    type="number"
                                    name="priority"
                                    onChange={(e) => selectedFormChangeHandle(e)}
                                />
                            </RB.Col>
                            <RB.Button
                                type="submit"
                                variant="success"
                                style={{ maxWidth: "300px", margin: "10px" }}>
                                {editingProject.id ? "Сохранить изменения" : "Создать"}
                            </RB.Button>
                        </RB.Row>
                    </form>
                    <h4>Менеджер - {manager?.surname} {manager?.name} {manager?.patronymic}
                        {manager != undefined ?
                            (
                                <RB.Button
                                    variant="outline-danger"
                                    onClick={() => setEditingProject({ ...editingProject, managerId: undefined })}
                                >X</RB.Button>
                            ) : <></>}
                    </h4>
                    <RB.Row style={{ maxHeight: "1000px", overflowY: "scroll" }}>
                        <RB.Col sm={6}>
                            <RB.Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>ФИО</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workers.map((worker, index) => {
                                        if (editingProject.workersIds.includes(worker.id as any))
                                            return (<tr key={index}>
                                                <td>{worker.surname} {worker.name} {worker.patronymic}</td>
                                                <td>
                                                    <RB.Button
                                                        variant="outline-primary"
                                                        onClick={() => { setManagerHandle(worker.id!) }}
                                                    >
                                                        Сделать менеджером
                                                    </RB.Button>
                                                    <RB.Button
                                                        style={{ float: "right" }}
                                                        variant="dark"
                                                        onClick={() => { moveWorkersBtnHandle(worker.id!, false) }}
                                                    > {"->"} </RB.Button>
                                                </td>
                                            </tr>);
                                    })}
                                </tbody>
                            </RB.Table>
                        </RB.Col>
                        <RB.Col sm={6}>
                            <RB.Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>ФИО</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workers.map((worker, index) => {
                                        if (!editingProject.workersIds.includes(worker.id as any))
                                            return (<tr key={index}>
                                                <td>
                                                    <RB.Button
                                                        variant="dark"
                                                        onClick={() => { moveWorkersBtnHandle(worker.id!, true) }}
                                                    > {"<-"} </RB.Button>
                                                </td>
                                                <td>{worker.surname} {worker.name} {worker.patronymic}</td>
                                            </tr>);
                                    })}
                                </tbody>
                            </RB.Table>
                        </RB.Col>
                    </RB.Row>
                    <RB.Row>
                        <RB.Button
                            variant="danger"
                            onClick={() => { props.deleteCallback(editingProject.id as any) }}
                            style={{ maxWidth: "300px" }}>
                            Удалить
                        </RB.Button>
                    </RB.Row>
                </>
            )}
        </>
    );
}

export default ProjectsEditor;