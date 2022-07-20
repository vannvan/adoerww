interface IProjectList {
    pageSize?: number;
    pageNum?: number;
    access_token: string;
    userId?: string;
    id?: string;
}
/**
 * @author: Cookie
 * @description: 获取工程列表
 */
declare const getProjectList: ({ pageSize, pageNum, access_token }: IProjectList) => Promise<{
    projectList: any;
}>;
/**
 * @author: Cookie
 * @description: 获取用户所属工程
 */
declare const getProjectByUser: ({ pageSize, pageNum, access_token, userId }: IProjectList) => Promise<{
    projectList: any;
}>;
/**
* @author: Cookie
* @description: 获取工程
*/
declare const getProject: ({ id, access_token }: IProjectList) => Promise<any>;
/**
 * @author: Cookie
 * @description: 创建 gitLab 工程
 */
declare const createProjects: ({ gitParams }: any) => Promise<any>;
/**
 * @author: Cookie
 * @description: 删除 gitLab 工程保护分支
 */
declare const deleteProtectedBranches: (projectId: number) => Promise<any>;
/**
 * @author: Cookie
 * @description: 设置 gitLab 工程保护分支
 */
declare const protectedBranches: (projectId: number) => Promise<any>;
export { getProjectList, getProject, getProjectByUser, createProjects, deleteProtectedBranches, protectedBranches, };
