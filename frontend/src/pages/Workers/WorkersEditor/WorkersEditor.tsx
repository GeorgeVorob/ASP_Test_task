import { useEffect, useState } from "react";
import { json } from "stream/consumers";
import { ProjectWorker } from "../../../models/models";
import * as RB from 'react-bootstrap'


export type WorkersEditorProps = {
    createCallback: (proj: ProjectWorker) => void,
    updateCallback: (proj: ProjectWorker) => void,
    deleteCallback: (id: number) => void,
    initialObject: ProjectWorker | null
}

const WorkersEditor = (props: WorkersEditorProps) => {
    const [editingProject, setEditingProject] = useState<ProjectWorker | null>(null);


    useEffect(() => {
        setEditingProject(props.initialObject ? { ...props.initialObject } : null);
    }, [props.initialObject])

    const createOrUpdateBtnHandle = (proj: ProjectWorker) => {
        if (proj.id) {
            props.updateCallback(proj);
        } else {
            props.createCallback(proj);
        }
    }

    const selectedFormChangeHandle = (e: any) => {
        if (editingProject) {
            let { name, value } = e.target;

            if (name === "email" && value == "") value = undefined;

            setEditingProject({
                ...editingProject,
                [name]: value,
            });
        }
    }

    return (
        <>
            {
                editingProject == null ? (<h4>Выберите сотрудника для просмотра\редактирования в списке</h4>) : (
                    <>
                        <form
                            onSubmit={(e: any) => {
                                e.preventDefault();
                                e.target.reportValidity();
                                createOrUpdateBtnHandle(editingProject);
                            }}
                        >

                            <RB.Row>
                                <RB.Col sm={3}>
                                    <label>Имя</label><br />
                                    <input
                                        required
                                        value={editingProject.name || ""}
                                        type="text"
                                        name="name"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Фамилия</label><br />
                                    <input
                                        required
                                        value={editingProject.surname || ""}
                                        type="text"
                                        name="surname"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Отчество</label><br />
                                    <input
                                        value={editingProject.patronymic || ""}
                                        type="text"
                                        name="patronymic"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Эл. почта</label><br />
                                    <input
                                        value={editingProject.email || ""}
                                        type="email"
                                        name="email"
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

                        <RB.Row style={{ maxHeight: "1000px", overflowY: "scroll" }}>
                        </RB.Row>
                        {editingProject.id ?
                            <RB.Row>
                                <RB.Button
                                    variant="danger"
                                    onClick={() => { props.deleteCallback(editingProject.id as any) }}
                                    style={{ maxWidth: "300px" }}>
                                    Удалить
                                </RB.Button>
                            </RB.Row>
                            : <></>}
                    </>
                )
            }
        </>);
}
export default WorkersEditor;