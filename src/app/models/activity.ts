import { tool } from "./tool";

export interface activity {
    id:string;
    name: string;
    description: string;
    insumos : tool[];
    project_id : string;
    users: string[];
    start: string;
    end: string;
    deleted : any,
    subproject : string;
  }