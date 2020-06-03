import { Component, Vue } from 'vue-property-decorator';
import config from '@/utils/config';
import MenuList from '@/components/Layout/Sidebar/MenuList';
import './Sidebar.less';

@Component
export default class SiderBar extends Vue {
  render() {
    const {
      menuData,
      sidebar: { opened },
    } = this.$store.state.app;
    return (
      <div class='side-bar'>
        <div
          class='logo-wrap'
          style='border-bottom:1px solid rgba(255,255,255,0.1)'
        >
          <img
            src={require('../../../assets/logo1.png')}
            width='100%'
            height='100%'
          />
        </div>
        <MenuList />
      </div>
    );
  }
}
