//TODO: методы для генерации значений по умолчанию?
export type Project = {
    id?: number,
    name: string,
    client: string,
    performer: string,
    workersIds: number[],
    managerId?: number,
    startDate: Date,
    endDate?: Date,
    priority: number
}
export type ProjectFilter = {
    name?: string,
    client?: string,
    performer?: string,
    dateFrom?: Date,
    dateTo?: Date,
    priorityFrom?: number,
    priorityTo?: number
}
export type ProjectSort = {
    field?: "name" | "priority" | "startDate",
    ascending: boolean
}

export type ProjectWorker = {
    id?: number,
    name: string,
    surname?: string,
    patronymic?: string,
    email?: string,
    workingProjectsIds?: number[],
    managingProjectsIds?: number[]
}

export type ProjectTask = {
    id?: number,
    name?: string,
    authorId?: number,
    implementerId?: number,
    status: "ToDo" | "InProgress" | "Done",
    comment?: string,
    priority: number,
    projectId: number
}