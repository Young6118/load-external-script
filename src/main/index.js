/**
 * 原生组件测试入口JS
 */

import './index.scss';

import main from '../components/main';

document.querySelector('#load-script').addEventListener('click', () => {
  main.loadScript('https://webstatic.mihoyo.com/upload/static-resource/2021/04/29/35551512ec6dd09954e611e3468f2b56_4975292046500048389.js');
});
