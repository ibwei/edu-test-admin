import { Component, Vue } from 'vue-property-decorator';
import '../google/google.less';
@Component({
  name: 'baidu',
})
export default class Baidu extends Vue {
  render() {
    return <iframe src='http://www.pinxianhs.com/baidu/' class='google'></iframe>;
  }
}
