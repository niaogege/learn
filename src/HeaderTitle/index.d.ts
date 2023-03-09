import React, { FC } from 'react';
export interface HeaderTitleProp {
    /**
     * @description       标题名称
     * @description.zh-CN 标题名称
     * @default       --
     */
    title: string;
    /**
     * @description       自定义className
     * @description.zh-CN 自定义className
     * @default           null
     */
    className?: string;
    /**
     * @description       自定义style
     * @description.zh-CN 自定义style
     * @default           null
     */
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
declare const HeaderTitle: FC<HeaderTitleProp>;
export default HeaderTitle;
