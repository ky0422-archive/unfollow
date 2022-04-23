import { BASE_URL, token } from "./config.js";
import { Octokit } from "@octokit/core";
import axios from "axios";

interface IFollowerUser { 
    login: string; 
    id: number; 
};

interface ILogger { 
    message: string; 
    _type: 'info' | 'error'; 
};

type R<T> = { readonly [k in keyof T]?: T[k] };

const block = async (method: string, user: IFollowerUser) => {   
    await new Octokit({ auth: token }).request(`${method} /user/blocks/${user?.login}`).catch((err) => {
        log({ message: `(${method}) ${err}`, _type: "error" });
    });
}

const log = (d: ILogger) => console.log(`[${d._type}]: ${d.message}`);

(async () => {
    await axios.get<R<Array<IFollowerUser>>>(BASE_URL).then((res) => {
        res.data.forEach(async (user) => {
            await block('PUT', user!);
            await block('DELETE', user!);

            log({ message: `OK (${user?.login})`, _type: "info" });
        });
    }).catch((err) => {
        log({ message: `${err}`, _type: "error" });
    });
})();