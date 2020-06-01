import {Component, Emit, Vue} from 'vue-property-decorator';
import {Form, Button, Input, Icon} from 'ant-design-vue';
import config from '@/utils/config';

import './login.less';

@Component({
  components: {
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-button': Button,
    'a-input': Input,
    'a-icon': Icon,
  },
  props: {
    Form,
  },
})
class Login extends Vue {
  loginForm: {
    username: string;
    password: string;
  } = {username: 'admin', password: 'admin'};

  config = config;

  imgToken = '';

  loading = false;

  created() {}

  @Emit()
  submitForm() {
    this.Form.validateFields((err: any, values: object) => {
      if (!err) {
        this.loading = true;
        window.api
          .login({...values})
          .then(res => {
            this.loading = false;
            const {resultCode, resultMessage, data} = res.data;
            if (resultCode !== 0) {
              this.$message.error(resultMessage || '未知错误');
            } else {
              this.$message.success(resultMessage);
              //将token 保存在本地
              localStorage.setItem('token', data.token);
              setTimeout(() => {
                this.$store
                  .dispatch('getUserInfo')
                  .then(() => {
                    this.$router.push('/');
                  })
                  .catch(error => {
                    this.$message.error(error);
                  });
              }, 200);
            }
          })
          .catch((errs: any) => {
            this.loading = false;
            this.$message.error(errs.message);
          });
        return true;
      }
      return false;
    });
  }

  render() {
    const {getFieldDecorator} = this.Form;
    return (
      <div class='loginWrap'>
        <div class='loginForm'>
          <div class='logo'>
            {/* <img alt='logo' src={require('../../assets/logo.png')} /> */}
            <span>{config.name}</span>
          </div>
          <a-form ref='loginForm' on-submit={this.submitForm}>
            <a-form-item>
              {getFieldDecorator('username', {
                rules: [{required: true, message: '请输入用户名字'}],
              })(
                <a-input id='username' prefix-icon='iconfont-user' placeholder='请输入用户名字'>
                  <a-icon slot='prefix' type='user' />
                </a-input>,
              )}
            </a-form-item>
            <a-form-item>
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入密码'}],
              })(
                <a-input
                  id='password'
                  prefix-icon='iconfont-lock'
                  type='password'
                  on-pressEnter={this.submitForm}
                  placeholder='请输入密码'
                >
                  <a-icon slot='prefix' type='lock' />
                </a-input>,
              )}
            </a-form-item>
            <a-form-item>
              <a-button loading={this.loading} type='primary' on-click={this.submitForm}>
                Login
              </a-button>
            </a-form-item>
          </a-form>
          <div class='tips'>
            <span>请妥善保管密码</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({})(Login);
