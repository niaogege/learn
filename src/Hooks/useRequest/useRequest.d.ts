declare const useRequest: (url: string, options: any) => {
    res: null;
    error: null;
    abort: void;
};
export default useRequest;
