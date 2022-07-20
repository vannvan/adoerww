interface IBranchList {
    pageSize?: number;
    pageNum?: number;
    access_token: string;
    userId?: string;
    id?: string;
    projectId: string;
    branch?: string;
    ref?: string;
}
/**
 * @author: Cookie
 * @description: 获取分支列表
 */
declare const getBranchList: ({ pageSize, pageNum, projectId, access_token, }: IBranchList) => Promise<any>;
/**
 * @author: Cookie
 * @description: 获取单分支
 */
declare const getBranch: ({ projectId, branch }: IBranchList) => Promise<any>;
/**
 * @author: Cookie
 * @description: 创建分支
 */
declare const createBranch: ({ ref, projectId, branch, access_token }: IBranchList) => Promise<any>;
declare const setProtectedBranch: ({ projectId }: IBranchList) => Promise<any>;
declare const delProtectedBranch: ({ projectId }: IBranchList) => Promise<any>;
declare const delBranch: ({ projectId, branch }: IBranchList) => Promise<any>;
export { getBranchList, createBranch, getBranch, setProtectedBranch, delProtectedBranch, delBranch, };
