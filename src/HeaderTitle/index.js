/*
 * @Author: Chendapeng
 * @Date: 2022-04-13 08:27:44
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-04-14 23:09:16
 * @Description:
 */
import React from 'react';
const HeaderTitle = ({ title }) => {
    return (React.createElement("section", null,
        React.createElement("header", null, title)));
};
HeaderTitle.displayName = 'HeaderTitle';
export default HeaderTitle;
