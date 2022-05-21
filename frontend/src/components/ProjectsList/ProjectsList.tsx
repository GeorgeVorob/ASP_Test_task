import { useEffect, useState } from "react";
import { Project, ProjectSort } from "../../models/models";
import * as RB from 'react-bootstrap'
import './ProjectsList.css'

export type ProjectsListProps = {
    projects: Project[],
    selectCallback: (id: number) => void
}

const ProjectsList = (props: ProjectsListProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [sort, setSort] = useState<ProjectSort>({
        field: undefined,
        ascending: true
    });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectHandle = (id: number) => {
        setSelectedId(id);
        props.selectCallback(id);
    }

    useEffect(() => {
        setProjects(props.projects);
    }, [props.projects]);

    const sortFormChangeHandle = (e: any) => {
        let { name, value } = e.target;
        if (name == "ascending") value = value == "true" ? true : false;
        setSort({
            ...sort,
            [name]: value,
        });
    }

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
    console.log("DBG projects:", projects);
    console.log("DBG displayed:", projectsToDisplay);
    return (
        <>
            <RB.Row>
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
                        <input name="ascending" type="radio" value={"true"} defaultChecked />
                        <label>По возрастанию</label> <br />
                        <input name="ascending" type="radio" value={"false"} />
                        <label>По убыванию</label> <br />
                    </form>
                </RB.Col>
            </RB.Row>
            <RB.Row
                style={{ maxHeight: "650px", overflowY: "scroll" }}
            >
                {projectsToDisplay.map((el, index) => {
                    return (
                        <RB.Card
                            key={index}
                            className="project-card"
                            onClick={() => { selectHandle(el.id as any) }}
                            style={selectedId == el.id ? { backgroundColor: "aquamarine" } : {}}
                        >
                            <RB.Card.Title>{el.name}</RB.Card.Title>
                            <RB.Card.Subtitle>{el.startDate.toLocaleDateString()} - {el.endDate?.toLocaleDateString()}</RB.Card.Subtitle>
                            <RB.Card.Subtitle>Клиент {el.client}</RB.Card.Subtitle>
                            <RB.Card.Subtitle>Исполнитель {el.performer}</RB.Card.Subtitle>
                            Приоритет {el.priority}
                        </RB.Card>
                    );
                })}
            </RB.Row>
        </>
    )
}

export default ProjectsList;