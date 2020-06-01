import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  InputNumber,
  Cascader,
  Button,
  Spin,
} from 'ant-design-vue';

import './infoModal.less';

import { getCurrentDate } from '../../utils/index';

@Component({
  components: {
    'a-modal': Modal,
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-input': Input,
    'a-button': Button,
    'a-input-number': InputNumber,
    'a-radio': Radio,
    'a-radio-group': Radio.Group,
    'a-date-picker': DatePicker,
    'a-cascader': Cascader,
    'a-textarea': Input.TextArea,
    'a-spin': Spin,
  },
  props: {
    Form,
  },
})
class InfoModal extends Vue {
  @Prop() title!: string;

  @Prop() visible!: boolean;

  @Prop() type!: string;

  @Prop() data!: any;

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  submit() {
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.type === 'edit') {
          if (this.data.status === 1) {
            this.cancel();
            return false;
          }
          window.api
            .feedbackUpdate({
              id: this.data.id,
              result: this.data.result,
            })
            .then((res: any) => {
              this.spinShow = false;
              const { resultCode, resultMessage } = res.data;
              if (!resultCode) {
                this.$message.success(resultMessage);
                this.Form.resetFields();
                this.$emit('success');
              } else {
                this.$message.error(resultMessage);
              }
            });
        } else if (this.type === 'add') {
          window.api.feedbackAdd(values).then((res: any) => {
            const {
              err_code,
              result: { resultMessage },
            } = res.data;
            if (!err_code) {
              this.$message.success(resultMessage);
              this.Form.resetFields();
              this.$emit('success');
            } else {
              this.$message.error(resultMessage);
            }
          });
        }
      }
    });
  }

  cancel() {
    this.$emit('close');
  }

  resultChange(e: any) {
    this.data.result = e.target.value;
  }

  spinShow: boolean = false;

  render() {
    const { getFieldDecorator } = this.Form;
    return (
      <a-modal
        title={this.title}
        visible={this.visible}
        on-ok={this.submit}
        on-cancel={this.cancel}
      >
        {this.spinShow ? (
          <div class='spin'>
            <a-spin tip='正在发送邮件,请稍后...'></a-spin>
          </div>
        ) : (
          ''
        )}
        <a-form>
          {this.data.status === 0 ? (
            <a-form-item {...{ props: this.formItemLayout }} label='回复该反馈'>
              <a-textarea
                onChange={this.resultChange}
                placeholder='如需回复,请在此输入回复内容,内容将以邮件方式通知反馈人。不需要回复,请直接点击确定按扭。'
                rows={5}
              ></a-textarea>
            </a-form-item>
          ) : (
            <div>
              <a-form-item {...{ props: this.formItemLayout }} label='处理结果'>
                <div>{this.data.result ? this.data.result : '默认处理,没有回复任何内容 .'}</div>
              </a-form-item>
              <a-form-item {...{ props: this.formItemLayout }} label='处理时间'>
                <div>{this.data.updated_at}</div>
              </a-form-item>
            </div>
          )}
        </a-form>
      </a-modal>
    );
  }
}

export default Form.create({
  props: {
    title: String,
    visible: Boolean,
    type: String,
    data: Object,
  },
})(InfoModal);
