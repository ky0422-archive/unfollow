import { Octokit } from "@octokit/core";
import { token, BASE_URL, IFollowerUser, R, log } from "./dd.js";
import axios from "axios";

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