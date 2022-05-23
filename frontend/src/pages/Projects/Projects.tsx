import { useState, useEffect } from "react";
import { addProject, deleteProject, getFilteredProjects, updateProject, updateTasks } from "../../api/api";
import { Project, ProjectFilter, ProjectTask } from "../../models/models";
import * as RB from 'react-bootstrap'
import ProjectsEditor from "./ProjectsEditor/ProjectsEditor";
import ProjectsList from "./ProjectsList/ProjectsList";


const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selected, setSelected] = useState<Project | null>(null);

    const [filter, setFilter] = useState<ProjectFilter>({
        name: "",
        client: "",
        performer: "",
        dateFrom: undefined,
        dateTo: undefined,
        priorityFrom: undefined,
        priorityTo: undefined
    });

    //TODO: add debounce
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

    const deleteBtnCallback = (id: number): void => {
        setProjects(projects.filter(el => el.id != id));
        setSelected(null);
        deleteProject(id).then(res => {
            updateData();
        });
    }

    const updateProjectCallback = (proj: Project, tasks: ProjectTask[]) => {
        let newData: Project[] = [...projects];
        let indexToChange = newData.findIndex(p => p.id == proj.id);
        newData[indexToChange] = proj;
        setProjects(newData);
        updateProject(proj).then(res => {
            updateData();
        });
        updateTasks(tasks, proj.id!).then(res => {
            updateData();
        });
    }

    const createProjectCallback = (proj: Project) => {
        if (proj.id) {
            console.error("attempted to add project with speicified id!");
            return;
        }
        addProject(proj).then(res => {
            updateData();
            setSelected(null);
        });
    }


    const newBtnHandle = () => {
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

    return (
        <>
            <h3>Projects</h3>
            <RB.Row>
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
                            value={filter.priorityFrom || ""}
                            type="number"
                            name="priorityFrom"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                        <label>до </label>
                        <input
                            placeholder=""
                            value={filter.priorityTo || ""}
                            type="number"
                            name="priorityTo"
                            onChange={(e) => filterFormChangeHandle(e)}
                        />
                </form>
                <RB.Button
                    variant="success"
                    style={{ maxWidth: 300 }}
                    onClick={newBtnHandle}
                >Создать новый проект</RB.Button>
            </RB.Row>
            <RB.Col sm={4}>
                <ProjectsList
                    projects={projects}
                    selectCallback={selectProjectHandle}
                />
            </RB.Col>   
            <RB.Col sm={8}>
                <ProjectsEditor
                    createCallback={createProjectCallback}
                    updateCallback={updateProjectCallback}
                    deleteCallback={deleteBtnCallback}
                    initialObject={selected}
                />
            </RB.Col>
        </>
    )
}

export default Projects