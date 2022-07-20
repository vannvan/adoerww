interface IMethodV {
    url: string;
    method: string;
    params?: object;
    query?: object;
}
interface IRequest {
    data: any;
    code: number;
}
/**
 * @author: Cookie
 * @description: 不带 version 的 api 请求
 */
declare const gitPost: ({ url, params, query }: IMethodV) => Promise<IRequest>;
/**
 * @author: Cookie
 * @description: 带 version 的通用 api 请求
 */
declare const methodV: ({ url, method, params, query }: IMethodV) => Promise<IRequest>;
export { gitPost, methodV };
