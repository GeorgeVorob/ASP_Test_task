import { useEffect, useState } from "react";
import { ProjectWorker } from "../../../models/models";
import * as RB from 'react-bootstrap'
import './WorkersList.css'

export type WorkersListProps = {
    workers: ProjectWorker[],
    selectCallback: (id: number) => void
}

const WorkersList = (props: WorkersListProps) => {
    const [workers, setWorkers] = useState<ProjectWorker[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectHandle = (id: number) => {
        setSelectedId(id);
        props.selectCallback(id);
    }

    useEffect(() => {
        setWorkers(props.workers);
    }, [props.workers]);

    return (
        <>
            <RB.Row
                style={{ maxHeight: "650px", overflowY: "scroll" }}
            >
                {workers.map((el, index) => {
                    return (
                        <RB.Card
                            key={index}
                            className="project-card"
                            onClick={() => { selectHandle(el.id as any) }}
                            style={selectedId == el.id ? { backgroundColor: "aquamarine" } : {}}
                        >
                            <RB.Card.Title>
                                {el.surname}
                                {el.name}
                                {el.patronymic}
                            </RB.Card.Title>
                            <RB.Card.Subtitle>{el.email}</RB.Card.Subtitle>
                        </RB.Card>
                    );
                })}
            </RB.Row>
        </>
    )
}

export default WorkersList;