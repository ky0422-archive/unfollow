const name = "Github name";
const token = "Github token";

const BASE_URL = `https://api.github.com/users/${name}/followers`;

interface IFollowerUser { 
    login: string; 
    id: number; 
};

interface ILogger { 
    message: string; 
    _type: 'info' | 'error'; 
};

type R<T> = { readonly [k in keyof T]?: T[k] };

const log = (d: ILogger) => console.log(`[${d._type}]: ${d.message}`);

export { name, token, BASE_URL, R, log, IFollowerUser, ILogger };