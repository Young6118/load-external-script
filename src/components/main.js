/**
 * 组件主文件
 */


/**
 * 加法
 */
 import { memoryCache } from './cacheService';

 memoryCache.set('promisesMap', {});
 memoryCache.set('loadedScripts', {});

 const loadScript = function (url) {
   const promisesMap = memoryCache.get('promisesMap');
   const loadedScripts = memoryCache.get('loadedScripts');

   if (loadedScripts[url]) return null;
   if (promisesMap[url]) return promisesMap[url];
   const promise = new Promise((resolve, reject) => {
     const scriptElement = document.createElement('script');
     const installTimeoutId = window.setTimeout(() => {
       promisesMap[url] = null;
       reject(new Error(`Failed to load ${url} in 20s`));
     }, 20000);

     scriptElement.onload = () => {
       if (installTimeoutId) window.clearTimeout(installTimeoutId);
       loadedScripts[url] = true;
       promisesMap[url] = null;
       resolve();
     };

     scriptElement.onerror = (err) => {
       if (installTimeoutId) window.clearTimeout(installTimeoutId);
       promisesMap[url] = null;
       reject(err);
     };

     scriptElement.src = url;
     document.body.appendChild(scriptElement);
   });
   promisesMap[url] = promise;
   return promise;
 };


export default {
  loadScript
};
