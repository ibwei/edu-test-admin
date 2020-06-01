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
  Select,
} from 'ant-design-vue';

import { quillEditor } from 'vue-quill-editor';
// @ts-ignore
import UploadImage from '@/components/UploadImage';

import './infoModal.less';

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
    'a-select': Select,
    UploadImage,
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

  editorOption: any = {};

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

  created() {
    this.url = this.data.url;
  }

  spinShow: boolean = false;
  submit() {
    if (this.url === '') {
      this.$message.info('你还未选择任何图片!');
      return false;
    }

    if (this.data.result) {
      this.spinShow = true;
    }
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('values :', values);
        if (this.type === 'edit') {
          window.api
            .environmentUpdate({
              ...values,
              id: this.data.id,
              url: this.url,
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
          window.api.environmentAdd({ ...values, url: this.url }).then((res: any) => {
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
        }
      }
    });
  }

  cancel() {
    this.$emit('close');
  }

  thumbnail: string = '';
  //图片上传完成
  url: string = '';
  uploaded(e: any) {
    this.url = e;
  }

  //富文本编辑器的内容
  contentHTML: string = '';

  onChange1(e: any) {
    this.data.status = e.target.value;
  }

  render() {
    const { getFieldDecorator } = this.Form;

    const options = [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ];
    return (
      <a-modal
        width={'650px'}
        title={this.title}
        visible={this.visible}
        on-ok={this.submit}
        on-cancel={this.cancel}
      >
        <a-form>
          {this.type === 'edit' ? (
            <a-form-item {...{ props: this.formItemLayout }} label='环境图片'>
              <img src={this.url} width='80%'></img>
            </a-form-item>
          ) : (
              ''
            )}
          <a-form-item
            {...{ props: this.formItemLayout }}
            label={'画室图片'}
          >
            <div>
              <upload-image on-uploaded={this.uploaded}></upload-image>
            </div>
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='排序权重'>
            {getFieldDecorator('order', {
              initialValue: this.data.order,
            })(<a-input placeholder='数值越大排序越靠前'></a-input>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='环境标签'>
            {getFieldDecorator('desc', {
              initialValue: this.data.desc,
            })(<a-input placeholder='请输入描述'></a-input>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='是否启用'>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择轮播图状态' }],
              initialValue: this.data.status,
            })(<a-select options={options}></a-select>)}
          </a-form-item>

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
