import { useState, useEffect, useRef } from "react";
import { addProject, deleteProject, getFilteredProjects, getProjects, getWorkers, updateProject } from "../../api/api";
import { Project, ProjectFilter, ProjectSort, Worker } from "../../models/models";
import './Projects.css'
import * as RB from 'react-bootstrap'
import { isConditionalExpression } from "typescript";


const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selected, setSelected] = useState<Project | null>(null);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [filter, setFilter] = useState<ProjectFilter>({
        name: "",
        client: "",
        performer: "",
        dateFrom: undefined,
        dateTo: undefined,
        priorityFrom: undefined,
        priorityTo: undefined
    });
    const [sort, setSort] = useState<ProjectSort>({
        field: undefined,
        ascending: true
    });

    useEffect(() => {
        getWorkers().then(_workers => {
            console.log("workers:", _workers);
            setWorkers(_workers);
        })
    }, []);

    useEffect(() => {
        getFilteredProjects(filter).then(_data => {
            console.log("projects:", _data);
            setProjects(_data);
        })
    }, [filter]);

    const updateData = () => {
        getFilteredProjects(filter).then(_data => {
            console.log("projects:", _data);
            setProjects(_data);
        })
    }

    const filterFormChangeHandle = (e: any) => {
        console.log("updated filter:", e.target.value);
        let { name, value } = e.target;
        if (name == "dateFrom" || name == "dateTo")
            value = value === "" ? undefined : new Date(value);
        setFilter({
            ...filter,
            [name]: value,
        });
    }

    const selectProjectHandle = (id: number): void => {
        setSelected(projects.find(el => el.id == id) || null);
    }

    const deleteBtnHandle = (id: number): void => {
        setProjects(projects.filter(el => el.id != id));
        setSelected(null);
        deleteProject(id).then(res => {
            updateData();
        });
    }

    const selectedFormChangeHandle = (e: any) => {
        if (selected) {
            let { name, value } = e.target;
            if (name == "startDate" || name == "endDate")
                value = new Date(value);
            setSelected({
                ...selected,
                [name]: value,
            });
        }
    }

    const sortFormChangeHandle = (e: any) => {
        let { name, value } = e.target;
        if (name == "ascending") value = value == "true" ? true : false;
        setSort({
            ...sort,
            [name]: value,
        });
    }

    const moveWorkersBtnHandle = (id: number, add: boolean) => {
        if (selected) {
            let newVal = { ...selected };
            if (add && !newVal.workersIds.includes(id))
                newVal.workersIds.push(id);
            else
                newVal.workersIds = newVal.workersIds.filter(w => w !== id);
            setSelected(newVal);
            console.log("new selected:", newVal);
        }
    }

    const setManagerHandle = (id: number) => {
        if (selected)
            setSelected({ ...selected, managerId: id });
    }

    const updateProjectHandle = (proj: Project) => {
        let newData: Project[] = [...projects];
        let indexToChange = newData.findIndex(p => p.id == proj.id);
        newData[indexToChange] = proj;
        setProjects(newData);
        updateProject(proj).then(res => {
            updateData();
        })
    }

    const createProjectHandle = (proj: Project) => {
        if (proj.id) {
            console.error("attempted to add project with speicified id!");
            return;
        }
        addProject(proj).then(res => {
            updateData();
            setSelected(null);
        })
    }

    const createOrUpdateBtnHandle = (proj: Project) => {
        if (proj.id) {
            updateProjectHandle(proj);
        } else {
            createProjectHandle(proj);
        }
    }

    const newBtnHandle = () => {
        console.log("a");
        var empty: Project = {
            id: undefined,
            name: "",
            client: "",
            performer: "",
            workersIds: [],
            managerId: undefined,
            startDate: new Date(),
            endDate: undefined,
            priority: 0
        };
        setSelected(empty);
    }

    if (selected?.managerId)
        var manager = workers.find(w => w.id! == selected.managerId);

    // apply sorting
    var projectsToDisplay = [...projects];
    if (sort.field != undefined) {
        projectsToDisplay.sort((a, b) => {
            let invert = sort.ascending == true ? 1 : -1;
            if (a[sort.field!] > b[sort.field!])
                return 1 * invert;
            if (a[sort.field!] < b[sort.field!])
                return -1 * invert;
            if (a[sort.field!] == b[sort.field!])
                return 0;

            return 0;
        });
    }

    console.log("sorted projects:", projectsToDisplay);

    return (
        <>
            <h3>Projects</h3>

            <RB.Row>
                <RB.Col sm={4}>
                    <h5>Фильтр:</h5>
                    <form>
                        <input
                            placeholder="Название проекта"
                            value={filter.name}
                            type="text"
                            name="name"
                            onChange={(e) => filterFormChangeHandle(e)}
                        /><br />
                        <input
                            placeholder="Клиент"
                            value={filter.client}
                            type="text"
                            name="client"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                        <br />
                        <input
                            placeholder="Исполнитель"
                            value={filter.performer}
                            type="text"
                            name="performer"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                        <br />
                        <label>Дата от</label>
                        <input
                            value={filter.dateFrom?.toISOString().substring(0, 10) || ""}
                            type="date"
                            name="dateFrom"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                        <label> до</label>
                        <input
                            value={filter.dateTo?.toISOString().substring(0, 10) || ""}
                            type="date"
                            name="dateTo"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                        <br />
                        <label>Приоритет от</label>
                        <input
                            placeholder=""
                            value={filter.priorityFrom}
                            type="number"
                            name="priorityFrom"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                        <label>до </label>
                        <input
                            placeholder=""
                            value={filter.priorityTo}
                            type="number"
                            name="priorityTo"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                    </form>
                </RB.Col>
                <RB.Col>
                    <h5>Сортировака:</h5>
                    <form onChange={(e) => sortFormChangeHandle(e)}>
                        <label>Поле</label>
                        <select name="field" defaultValue={""} >
                            <option>Не выбрано</option>
                            <option value="name">Название</option>
                            <option value="priority">Приоритет</option>
                            <option value="startDate">Дата начала</option>
                        </select><br />
                        <input name="ascending" type="radio" value={"true"} />
                        <label>По возрастанию</label> <br />
                        <input name="ascending" type="radio" value={"false"} />
                        <label>По убыванию</label> <br />
                    </form>
                </RB.Col>
            </RB.Row>
            <RB.Col sm={4}
                style={{ maxHeight: "650px", overflowY: "scroll" }}
            >
                <RB.Button
                    variant="success"
                    style={{ maxWidth: 300 }}
                    onClick={newBtnHandle}
                >Создать новый проект</RB.Button>
                {projectsToDisplay.map((el, index) => {
                    return (
                        <RB.Card
                            key={index}
                            className="project-card"
                            onClick={() => { selectProjectHandle(el.id as any) }}
                            style={selected?.id == el.id ? { backgroundColor: "aquamarine" } : {}}
                        >
                            <RB.Card.Title>{el.name}</RB.Card.Title>
                            <RB.Card.Subtitle>{el.startDate.toLocaleDateString()} - {el.endDate?.toLocaleDateString()}</RB.Card.Subtitle>
                            <RB.Card.Subtitle>Клиент {el.client}</RB.Card.Subtitle>
                            <RB.Card.Subtitle>Исполнитель {el.performer}</RB.Card.Subtitle>
                            Приоритет {el.priority}
                        </RB.Card>
                    );
                })}
            </RB.Col>

            {/*TODO: move to external component*/}
            <RB.Col sm={8}>
                {selected === null ? (<h4>Выберите проект для просмотра\редактирования в списке</h4>) : (
                    <>
                        <form
                            onSubmit={(e: any) => {
                                console.log("e:", e);
                                e.preventDefault();
                                e.target.reportValidity();
                                createOrUpdateBtnHandle(selected);
                            }}
                        >

                            <RB.Row>
                                <RB.Col sm={3}>
                                    <label>Название</label><br />
                                    <input
                                        required
                                        value={selected.name}
                                        type="text"
                                        name="name"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Клиент</label><br />
                                    <input
                                        required
                                        value={selected.client}
                                        type="text"
                                        name="client"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Исполнитель</label><br />
                                    <input
                                        required
                                        value={selected.performer}
                                        type="text"
                                        name="performer"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Дата начала</label><br />
                                    <input
                                        required
                                        value={selected.startDate.toISOString().substring(0, 10)}
                                        type="date"
                                        name="startDate"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                        onKeyDown={(e) => e.preventDefault()}
                                    />
                                </RB.Col>
                                <RB.Col sm={3}>
                                    <label>Дата окончания</label><br />
                                    <input
                                        value={selected.endDate?.toISOString().substring(0, 10) || ""}
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
                                        value={selected.priority}
                                        type="number"
                                        name="priority"
                                        onChange={(e) => selectedFormChangeHandle(e)}
                                    />
                                </RB.Col>
                                <RB.Button
                                    type="submit"
                                    variant="success"
                                    style={{ maxWidth: "300px", margin: "10px" }}>
                                    {selected.id ? "Сохранить изменения" : "Создать"}
                                </RB.Button>
                            </RB.Row>
                        </form>
                        <h4>Менеджер - {manager?.surname} {manager?.name} {manager?.patronymic}
                            {manager != undefined ?
                                (
                                    <RB.Button
                                        variant="outline-danger"
                                        onClick={() => setSelected({ ...selected, managerId: undefined })}
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
                                            if (selected.workersIds.includes(worker.id as any))
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
                                            if (!selected.workersIds.includes(worker.id as any))
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
                                onClick={() => { deleteBtnHandle(selected.id as any) }}
                                style={{ maxWidth: "300px" }}>
                                Удалить
                            </RB.Button>
                        </RB.Row>
                    </>
                )}
            </RB.Col>
        </>
    )
}

export default Projects