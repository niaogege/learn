declare function ajax({ url, options }: {
    url?: string | undefined;
    options?: {} | undefined;
}): Promise<unknown>;
export default ajax;
