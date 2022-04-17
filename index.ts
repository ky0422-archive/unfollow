import { Octokit } from "@octokit/core";
import axios from "axios";

const name = "Github name";
const token = "Github token";

const BASE_URL = `https://api.github.com/users/${name}/followers`;

interface IFollowerUser { login: string; id: number; };
interface ILogger { message: string; _type: 'info' | 'error'; };

type R<T> = { readonly [k in keyof T]?: T[k] };

(async () => {
    await axios.get<R<IFollowerUser[]>>(BASE_URL).then((res) => {
        res.data.forEach(async (user) => {
            log({ message: `name: ${user?.login}, id: ${user?.id}`, _type: "info" });

            const octokit = new Octokit({ auth: token });

            ["PUT", "DELETE"].forEach(async (m) => {
                await octokit.request(`${m} /user/blocks/${user?.login}`).catch((err) => {
                    log({ message: `(${m}) ${err}`, _type: "error" });
                });
            });

            log({ message: `OK (${user?.login})`, _type: "info" });
        });
    }).catch((err) => {
        log({ message: `${err}`, _type: "error" });
    });
})();

const log = (d: ILogger) => console.log(`[${d._type}]: ${d.message}`);