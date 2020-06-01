import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const DEFAULT_LANG = 'zh';
const LOCALE_KEY = 'localeLanguage';

const locales: any = {
  zh: require('./zh.json'),
  en: require('./en.json'),
};
const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
});
//这里我们抛出一个setup方法，用来修改我们的语言；
//并且在这个方法中，我们把用户选择的语言存储在localStorage里面，方便用户下次进入是直接使用上次选择的语言
//因为语言的不同，可能我们页面上的样式也会有相应的调整，所以这里在body上加入了相应的类名，方便我们做样式定制
export const setup = (lang: any) => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY);
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG;
    }
  }
  window.localStorage.setItem(LOCALE_KEY, lang);

  Object.keys(locales).forEach((langs: any) => {
    document.body.classList.remove(`lang-${langs}`);
  });
  document.body.classList.add(`lang-${lang}`);
  document.body.setAttribute('lang', lang);
  //把当前语言设置到vue的配置里面，方便在代码中读取
  const Config: any = Vue.config;
  Config.lang = lang;
  i18n.locale = lang;
};
//设置默认语言为中文
setup('zh');
//把i18n绑定到window上，方便我们在vue以外的文件使用语言包
window.i18n = i18n;
export default i18n;
