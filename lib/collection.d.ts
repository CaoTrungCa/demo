export interface User {
    create_date: string
    id: string
    name: string
    avatar: string
    birthday: string
    address: string
    email: string
    phone: string
    username: string
    password: string
    is_admin: string
}

export interface Setting {
    create_date: string
    id: string
    logo: string
    web_name: string
    address: string
    phone: string
    email: string
    link_facebook: string
    link_tiktok: string
    link_github: string
    link_youtube: string
}

export interface Post {
    id: string
    title: string
    slug: string
    status: string
    categories: string
    image: string
    content: string
    user_created: string
    date_created: string
    user_updated: string
    date_updated: string
}

export interface Categories {
    id: string
    title: string
}