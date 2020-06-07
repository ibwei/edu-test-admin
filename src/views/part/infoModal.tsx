import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Avatar,
} from 'ant-design-vue';
//@ts-ignore
import UploadImage from '@/components/UploadImage';

@Component({
  components: {
    'a-modal': Modal,
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-input': Input,
    'a-input-number': InputNumber,
    'a-select': Select,
    'a-avatar': Avatar,
    'a-textarea': Input.TextArea,
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

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  max = 2000;
  min = 0;

  created() {
    if (!this.data.order) {
      this.data.order = 0;
    }
  }

  submit() {
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.type === 'edit') {
          window.api
            .partUpdate({ ...values, id: this.data.id })
            .then((res: any) => {
              const { resultCode, resultMessage } = res.data;
              if (!resultCode) {
                this.$message.success(resultMessage);
                this.Form.resetFields();
                this.$emit('success');
              } else {
                this.$message.error(resultMessage);
              }
            });
        } else {
          window.api.partAdd({ ...values }).then((res: any) => {
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
  //图片上传完成
  render() {
    const { getFieldDecorator } = this.Form;
    return (
      <a-modal
        title={this.title}
        visible={this.visible}
        on-ok={this.submit}
        on-cancel={this.cancel}
      >
        <a-form>
          <a-form-item {...{ props: this.formItemLayout }} label='板块名字'>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入板块名字' }],
              initialValue: this.data.name,
            })(<a-input placeholder='请输入板块名字'></a-input>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='板块排序'>
            {getFieldDecorator('order', {
              rules: [{ required: true, message: '请输入板块评分' }],
              initialValue: this.data.order,
            })(
              <a-input-number
                max={this.max}
                min={this.min}
                placeholder='请输入板块评分'
              ></a-input-number>,
            )}
          </a-form-item>
          <a-form-item
            {...{ props: this.formItemLayout }}
            label='5-10分区间分析结果'
          >
            {getFieldDecorator('a_answer', {
              rules: [{ required: true, message: '请输入5-10分区间分析结果' }],
              initialValue: this.data.a_answer,
            })(<a-textarea rows={6} placeholder='请输入5-10分区间分析结果' />)}
          </a-form-item>
          <a-form-item
            {...{ props: this.formItemLayout }}
            label='11-15分区间分析结果'
          >
            {getFieldDecorator('b_answer', {
              rules: [{ required: true, message: '请输入11-15分区间分析结果' }],
              initialValue: this.data.a_answer,
            })(<a-textarea rows={6} placeholder='请输入11-15分区间分析结果' />)}
          </a-form-item>
          <a-form-item
            {...{ props: this.formItemLayout }}
            label='16-20分区间分析结果'
          >
            {getFieldDecorator('c_answer', {
              rules: [{ required: true, message: '请输入16-20分区间分析结果' }],
              initialValue: this.data.a_answer,
            })(<a-textarea rows={6} placeholder='请输入16-20分区间分析结果' />)}
          </a-form-item>
          <a-form-item
            {...{ props: this.formItemLayout }}
            label='21-25分区间分析结果'
          >
            {getFieldDecorator('d_answer', {
              rules: [{ required: true, message: '请输入21-25分区间分析结果' }],
              initialValue: this.data.a_answer,
            })(<a-textarea rows={6} placeholder='请输入21-25分区间分析结果' />)}
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
