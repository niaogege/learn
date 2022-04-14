declare module '*.css';
declare module '*.less';
declare module '*.scss';
// declare module 'cpp_ui'
interface Svg {
  content: string;
  id: string;
  viewBox: string;
  node: any;
}
const svg: Svg;
export default svg;
