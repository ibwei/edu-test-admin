import {Vue, Component, Prop} from 'vue-property-decorator';
import {Modal, Form, Input, InputNumber, Select, Avatar} from 'ant-design-vue';
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
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };

  created() {
    this.url = this.data.url;
  }

  submit() {
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.type === 'edit') {
          window.api
            .bannerBaseInfoUpdate({id: this.data.id, ...values, url: this.url})
            .then((res: any) => {
              const {resultCode, resultMessage} = res.data;
              if (!resultCode) {
                this.$message.success(resultMessage);
                this.Form.resetFields();
                this.$emit('success');
              } else {
                this.$message.error(resultMessage);
              }
            });
        } else if (this.type === 'add') {
          console.log('values :', values);
          if (this.url === '') {
            this.$message.error('请选择上传的图片');
            return false;
          }
          window.api.bannerBaseInfoAdd({...values, url: this.url}).then((res: any) => {
            const {resultCode, resultMessage} = res.data;
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

  optionStatus = [
    {value: 0, label: '禁用'},
    {value: 1, label: '启用'},
  ];

  url: string = '';
  //图片上传完成
  uploaded(e: any) {
    this.url = e;
  }
  render() {
    const {getFieldDecorator} = this.Form;
    const imageList =
      this.url &&
      this.url
        .split(',')
        .map((item, index) => (
          <img src={item} key={index} width='100px' height='auto' style={{marginRight: '10px'}} />
        ));
    return (
      <a-modal
        title={this.title}
        visible={this.visible}
        on-ok={this.submit}
        on-cancel={this.cancel}
      >
        <a-form>
          <a-form-item {...{props: this.formItemLayout}} label='轮播图描述'>
            {getFieldDecorator('desc', {
              rules: [{required: true, message: '请输入轮播图描述'}],
              initialValue: this.data.desc,
            })(<a-input placeholder='请输入轮播图'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='跳转链接'>
            {getFieldDecorator('routerUrl', {
              initialValue: this.data.routerUrl,
            })(<a-input placeholder='请输入轮播图跳转链接'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='展示权重'>
            {getFieldDecorator('order', {
              rules: [{required: true, message: '请输入轮播图展示权重，权重越大，轮播图越先展示'}],
              initialValue: this.data.order,
            })(<a-input-number placeholder='请输入轮播图展示权重'></a-input-number>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='是否启用'>
            {getFieldDecorator('status', {
              rules: [{required: true, message: '请选择轮播图状态'}],
              initialValue: this.data.status,
            })(<a-select options={this.optionStatus}></a-select>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='轮播图'>
            <div style={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-start'}}>
              {imageList}
              <upload-image pictureLength={1} on-uploaded={this.uploaded}></upload-image>
            </div>
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
