import { Component, Vue } from 'vue-property-decorator';
import { Button, Badge } from 'ant-design-vue';
import './g.less';

@Component({
  name: 'google',
  components: {
    aButton: Button,
    aBadge: Badge,
  },
})
export default class Google extends Vue {

  openGoogle() {
    const url = 'https://analytics.google.com/analytics/web/#/'
    window.open(url, 'blank')
  }

  render() {
    return (<div class="g"><a-button type="primary" onClick={this.openGoogle} size="large">打开谷歌统计</a-button>
      <a-badge style="margin-top:20px;" status="success" text="为了更好的用户体验，请手动点击谷歌统计以在外部打开" />
    </div>);
  }
}
