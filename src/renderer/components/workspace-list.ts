import {Workspace} from "../../common/store";
import path from "path";
import styles from "../styles.scss";

export const WORKSPACE_SELECT = "workspace-select";
interface WorkspaceSelectEventDetail {
    workspacePath: string
}
export class WorkspaceSelectEvent extends CustomEvent<WorkspaceSelectEventDetail> {
    constructor(workspacePath: string) {
        super(WORKSPACE_SELECT, { detail: { workspacePath } });
    }
}

export class WorkspaceList extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"})
        this.shadowRoot.adoptedStyleSheets = [styles]
        this.classList.add("repository-list", "list-group", "list-group-flush", "bg-light", "overflow-auto")
    }

    setWorkspaces(workspaces: Workspace[]) {
        const workspaceEntries = workspaces.map(workspace => {
            const pathComponents = workspace.path.split(path.sep)
            return {
                name: pathComponents.pop(),
                location: pathComponents.join(path.sep),
                path: workspace.path
            }
        })

        this.shadowRoot.innerHTML = `
                ${workspaceEntries.map(workspace => `
                    <button
                        type="button"
                        class="list-group-item list-group-item-action"
                        data-winery-workspace-path="${workspace.path}"
                >
                        <h5>${workspace.name}</h5>
                        <div class="text-muted">${workspace.location}</div>
                    </button>
                `).join(" ")}
        `

        this.shadowRoot
            .querySelectorAll("[data-winery-workspace-path]")
            .forEach((workspaceButton: HTMLElement) =>
                workspaceButton.addEventListener("click", () => this.handleClick(workspaceButton))
            )
    }

    handleClick(workspaceButton: HTMLElement) {
        const workspacePath = workspaceButton.dataset.wineryWorkspacePath
        this.dispatchEvent(new WorkspaceSelectEvent(workspacePath))
    }
}

