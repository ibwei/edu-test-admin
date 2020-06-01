module.exports = (file: string) => {
  'use strict';
  //return () => import(`@/views/${file}`);
  return (resolve: any) => require([`@/views/${file}`], resolve);

};
