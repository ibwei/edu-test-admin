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
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };
  max = 5;
  min = 0;

  created() {
    this.imgUrl = this.data.photo;
  }
  submit() {
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.type === 'edit') {
          window.api
            .teacherBaseInfoUpdate({...values, id: this.data.id, photoUrl: this.imgUrl})
            .then((res: any) => {
              console.log('res :', res);
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
          if (this.imgUrl === '') {
            this.$message.error('请选择上传的图片');
            return false;
          }
          window.api.teacherBaseInfoAdd({...values, photoUrl: this.imgUrl}).then((res: any) => {
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

  imgUrl: string = '';
  //图片上传完成
  uploaded(e: any) {
    console.log(e);
    this.imgUrl = e;
    this.data.photo = e;
  }
  render() {
    const {getFieldDecorator} = this.Form;

    const imageList =
      this.imgUrl &&
      this.imgUrl
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
          <a-form-item {...{props: this.formItemLayout}} label='教师名字'>
            {getFieldDecorator('name', {
              rules: [{required: true, message: '请输入教师名字'}],
              initialValue: this.data.name,
            })(<a-input placeholder='请输入教师名字'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='教师照片'>
            <div style={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-start'}}>
              {imageList}
              <upload-image pictureLength={1} on-uploaded={this.uploaded}></upload-image>
            </div>
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='擅长内容'>
            {getFieldDecorator('good_at', {
              rules: [{required: true, message: '请输入教师擅长内容以-分隔'}],
              initialValue: this.data.good_at,
            })(<a-input placeholder='请输入擅长内容以-分隔'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='奖项'>
            {getFieldDecorator('deeds', {
              rules: [{required: true, message: '请输入教师奖项以-分隔'}],
              initialValue: this.data.deeds,
            })(<a-input placeholder='请输入奖项以-分隔'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='教师评分'>
            {getFieldDecorator('rate', {
              rules: [{required: true, message: '请输入教师评分'}],
              initialValue: this.data.rate,
            })(
              <a-input-number
                max={this.max}
                min={this.min}
                placeholder='请输入教师评分'
              ></a-input-number>,
            )}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='学生印象'>
            {getFieldDecorator('impression', {
              rules: [{required: true, message: '请输入学生印象以-分隔'}],
              initialValue: this.data.impression,
            })(<a-input placeholder='请输入学生印象以-分隔'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='教师简介'>
            {getFieldDecorator('desc', {
              rules: [{required: true, message: '请输入教师简介'}],
              initialValue: this.data.desc,
            })(<a-textarea row={6} placeholder='请输入教师简介'></a-textarea>)}
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
