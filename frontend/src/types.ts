export type UserType = {
    id: number,
    email: string
}
export type AdCardProps = {
    id: number,
    title: string,
    price: number,
    picture: string,
    link: string
}

export type AdDetailProps = {
    id: number,
    title: string,
    description: string,
    owner : string,
    price: number,
    picture: string,
    location: string,
    createdAt: string,
    category: {
        id: number,
        name: string
    },
    link: string,
    createdBy: UserType
}

export type AdFormProps = {
    action: string
    id?: number,
    title?: string,
    description?: string,
    owner?: string,
    price?: number,
    picture?: string,
    location?: string,
    categoryId?: number
}

export type CategoryProps = {
    id: number,
    name: string,
    link: string
}

export type CategoryFormProps = {
    action: string
    id?: number,
    name?: string
}

export type TagFormProps = {
    action: string
    id?: number,
    name?: string
}