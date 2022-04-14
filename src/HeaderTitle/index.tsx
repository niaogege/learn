/*
 * @Author: Chendapeng
 * @Date: 2022-04-13 08:27:44
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-04-14 23:09:16
 * @Description:
 */
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

const HeaderTitle: FC<HeaderTitleProp> = ({ title }) => {
    return (
        <section>
            <header>{title}</header>
        </section>
    );
};
HeaderTitle.displayName = 'HeaderTitle';

export default HeaderTitle;
