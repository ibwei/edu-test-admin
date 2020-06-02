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
    'a-select-option': Select.Option,
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
  partList: any = [];

  async created() {
    const listString = localStorage.getItem('partList');
    if (listString) {
      this.partList = JSON.parse(listString);
    } else {
      const { data } = await window.api.partList({ pageSize: 10, pageNum: 1 });
      for (let i = 0; i < data.data.length; i++) {
        this.partList.push({ name: data.data[i].name, id: data.data[i].id });
      }
      localStorage.setItem('partList', JSON.stringify(this.partList));
    }
    if (this.type === 'add') {
      this.data.a_score = 1;
      this.data.b_score = 2;
      this.data.c_score = 3;
      this.data.d_score = 4;
      this.data.e_score = 5;
      const partID = localStorage.getItem('lastPartId');
      if (partID) {
        for (let i = 0; i < this.partList.length; i++) {
          if (this.partList[i].id === Number(partID)) {
            this.data.name = this.partList[i].name;
            this.data.part_id = this.partList[i].id;
            break;
          }
        }
      } else {
        this.data.name = this.partList[0].name;
        this.data.part_id = this.partList[0].id;
      }
    }
  }

  submit() {
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.type === 'edit') {
          window.api
            .questionUpdate({
              ...values,
              id: this.data.id,
              part_id: this.data.part_id,
              status: 1,
            })
            .then((res: any) => {
              console.log('res :', res);
              const { resultCode, resultMessage } = res.data;
              if (!resultCode) {
                this.$message.success(resultMessage);
                this.Form.resetFields();
                this.$emit('success');
                localStorage.setItem('lastPartId', String(this.data.part_id));
              } else {
                this.$message.error(resultMessage);
              }
            });
        } else {
          window.api
            .questionAdd({ ...values, part_id: this.data.part_id, status: 1 })
            .then((res: any) => {
              const { resultCode, resultMessage } = res.data;
              if (!resultCode) {
                this.$message.success(resultMessage);
                this.Form.resetFields();
                localStorage.setItem('lastPartId', String(this.data.part_id));
                this.$emit('success');
              } else {
                this.$message.error(resultMessage);
              }
            });
        }
      }
    });
  }

  partChange(index: number) {
    this.data.part_id = this.partList[index].id;
    this.data.name = this.partList[index].name;
  }

  cancel() {
    this.$emit('close');
  }
  //图片上传完成
  render() {
    const { getFieldDecorator } = this.Form;
    const selectOptions = this.partList.map((item: any, index: number) => (
      <a-select-option key={index}>{item.name}</a-select-option>
    ));
    return (
      <a-modal
        title={this.title}
        visible={this.visible}
        on-ok={this.submit}
        on-cancel={this.cancel}
      >
        <a-form>
          <a-form-item {...{ props: this.formItemLayout }} label='题目'>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入题目' }],
              initialValue: this.data.title,
            })(<a-input placeholder='请输入题目'></a-input>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='所属板块'>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入题目' }],
              initialValue: this.data.name,
            })(
              <a-select
                style='width: 100%'
                placeholder='请选择板块名'
                min={this.min}
                onChange={this.partChange}
              >
                {selectOptions}
              </a-select>,
            )}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='A答案'>
            {getFieldDecorator('a_answer', {
              rules: [{ required: true, message: '请输入A答案内容' }],
              initialValue: this.data.a_answer,
            })(
              <a-textarea rows={3} placeholder='请输入A答案内容'></a-textarea>,
            )}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='A答案分值'>
            {getFieldDecorator('a_score', {
              rules: [{ required: true, message: '请输入A答案分值' }],
              initialValue: this.data.a_score,
            })(<a-input-number placeholder='请输入A答案分值'></a-input-number>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='B答案'>
            {getFieldDecorator('b_answer', {
              rules: [{ required: true, message: '请输入B答案内容' }],
              initialValue: this.data.b_answer,
            })(
              <a-textarea rows={3} placeholder='请输入B答案内容'></a-textarea>,
            )}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='B答案分值'>
            {getFieldDecorator('b_score', {
              rules: [{ required: true, message: '请输入B答案分值' }],
              initialValue: this.data.b_score,
            })(<a-input-number placeholder='请输入B答案分值'></a-input-number>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='C答案'>
            {getFieldDecorator('c_answer', {
              rules: [{ required: true, message: '请输入C答案内容' }],
              initialValue: this.data.c_answer,
            })(
              <a-textarea rows={3} placeholder='请输入C答案内容'></a-textarea>,
            )}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='C答案分值'>
            {getFieldDecorator('c_score', {
              rules: [{ required: true, message: '请输入C答案分值' }],
              initialValue: this.data.c_score,
            })(<a-input-number placeholder='请输入C答案分值'></a-input-number>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='D答案'>
            {getFieldDecorator('d_answer', {
              rules: [{ required: true, message: '请输入D答案内容' }],
              initialValue: this.data.d_answer,
            })(
              <a-textarea rows={3} placeholder='请输入D答案内容'></a-textarea>,
            )}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='D答案分值'>
            {getFieldDecorator('d_score', {
              rules: [{ required: true, message: '请输入D答案分值' }],
              initialValue: this.data.d_score,
            })(<a-input-number placeholder='请输入D答案分值'></a-input-number>)}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='E答案'>
            {getFieldDecorator('e_answer', {
              rules: [{ required: true, message: '请输入E答案内容' }],
              initialValue: this.data.e_answer,
            })(
              <a-textarea rows={3} placeholder='请输入E答案内容'></a-textarea>,
            )}
          </a-form-item>
          <a-form-item {...{ props: this.formItemLayout }} label='E答案分值'>
            {getFieldDecorator('e_score', {
              rules: [{ required: true, message: '请输入E答案分值' }],
              initialValue: this.data.e_score,
            })(<a-input-number placeholder='请输入E答案分值'></a-input-number>)}
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
