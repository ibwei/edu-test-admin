/* eslint-disabled */
import { Component, Vue } from 'vue-property-decorator';
import {
  Tag,
  Modal,
  Button,
  Table,
  Avatar,
  Rate,
  Badge,
  Form,
  Icon,
  Input,
} from 'ant-design-vue';
import './password.less';

@Component({
  name: 'comment',
  components: {
    'a-tag': Tag,
    'a-input': Input,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-avatar': Avatar,
    'a-rate': Rate,
    'a-badge': Badge,
    'a-icon': Icon,
    'a-form': Form,
    'a-form-item': Form.Item,
  },
  props: {
    Form,
  },
})
class Password extends Vue {
  loginForm: any = { password: '', confirmPassword: '' };
  loading: boolean = false;

  submitForm() {
    this.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (values.password !== values.confirmPassword) {
          this.$message.error('两次输入密码不一致！');
          return false;
        }
        this.loading = true;
        window.api
          .userUpdatePassword({ ...values })
          .then(res => {
            this.loading = false;
            const { resultCode, resultMessage } = res.data;
            if (resultCode !== 0) {
              this.$message.error(resultMessage || '未知错误');
            } else {
              this.$message.success(resultMessage);
              this.$router.push('/login');
              //将token 保存在本地
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
    const { getFieldDecorator } = this.Form;
    return (
      <div class='user'>
        <div class='password'>
          <a-form ref='loginForm' on-submit={this.submitForm}>
            <h2 style='text-align:center;'>更改密码</h2>
            <a-form-item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
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
              {getFieldDecorator('confirmPassword', {
                rules: [{ required: true, message: '请再次确认密码' }],
              })(
                <a-input
                  id='confirmPassword'
                  type='password'
                  prefix-icon='iconfont-lock'
                  placeholder='请再次确认密码'
                >
                  <a-icon slot='prefix' type='lock' />
                </a-input>,
              )}
            </a-form-item>

            <a-form-item>
              <a-button
                loading={this.loading}
                type='primary'
                on-click={this.submitForm}
              >
                提交
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    );
  }
}

export default Form.create({})(Password);
