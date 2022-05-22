import { useState, useEffect } from "react";
import { addWorker, deleteWorker, getWorkers, updateWorker } from "../../api/api";
import { ProjectWorker } from "../../models/models";
import * as RB from 'react-bootstrap'
import WorkersList from "./WorkersList/WorkersList";
import WorkersEditor from "./WorkersEditor/WorkersEditor";


const Workers = () => {
    const [workers, setWorkers] = useState<ProjectWorker[]>([]);
    const [selected, setSelected] = useState<ProjectWorker | null>(null);

    useEffect(() => { updateData() }, [])

    const updateData = () => {
        getWorkers().then(_data => {
            setWorkers(_data);
        })
    }

    const selectWorkerHandle = (id: number): void => {
        setSelected(workers.find(el => el.id == id) || null);
    }

    const deleteCallback = (id: number): void => {
        setWorkers(workers.filter(el => el.id != id));
        setSelected(null);
        deleteWorker(id).then(res => {
            updateData();
        });
    }

    const updateCallback = (worker: ProjectWorker) => {
        let newData: ProjectWorker[] = [...workers];
        let indexToChange = newData.findIndex(p => p.id == worker.id);
        newData[indexToChange] = worker;
        setWorkers(newData);
        updateWorker(worker).then(res => {
            updateData();
        })
    }

    const createCallback = (proj: ProjectWorker) => {
        if (proj.id) {
            console.error("attempted to add project with speicified id!");
            return;
        }
        addWorker(proj).then(res => {
            updateData();
            setSelected(null);
        })
    }

    const newBtnHandle = () => {
        console.log("a");
        var empty: ProjectWorker = {
            id: undefined,
            name: "",
            surname: undefined,
            patronymic: undefined,
            email: undefined,
            workingProjectsIds: undefined,
            managingProjectsIds: undefined
        };
        setSelected(empty);
    }

    return (
        <>
            <h3>Projects</h3>
            <RB.Row>
                <RB.Button
                    variant="success"
                    style={{ maxWidth: 300 }}
                    onClick={newBtnHandle}
                >Добавить нового сотрудника</RB.Button>
            </RB.Row>
            <RB.Col sm={4}>
                <WorkersList
                    workers={workers}
                    selectCallback={selectWorkerHandle}
                />
            </RB.Col>
            <RB.Col sm={8}>
                <WorkersEditor
                    createCallback={createCallback}
                    updateCallback={updateCallback}
                    deleteCallback={deleteCallback}
                    initialObject={selected}
                />
            </RB.Col>
        </>
    )
}

export default Workers