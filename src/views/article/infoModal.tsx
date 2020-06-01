import {Vue, Component, Prop} from 'vue-property-decorator';
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

import {quillEditor} from 'vue-quill-editor';
// @ts-ignore
import UploadImage from '@/components/UploadImage';

// 富文本框样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
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
    UploadImage,
    quillEditor,
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
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };

  spinShow: boolean = false;
  thumbnail: string = '';

  submit() {
    this.$props.Form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.type === 'edit') {
          window.api
            .articleUpdate({
              ...values,
              id: this.data.id,
              content: this.contentHTML,
              thumbnail: this.thumbnail,
            })
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
          window.api
            .articleAdd({
              ...values,
              content: this.contentHTML,
              thumbnail: this.thumbnail,
            })
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
        }
      }
    });
  }

  cancel() {
    this.$emit('close');
  }

  //图片上传完成
  uploaded(e: any) {
    console.log(e);
    this.thumbnail = e;
  }

  onEditorBlur = (e: any) => {};

  onEditorFocus = (e: any) => {};

  onEditorReady = (e: any) => {};

  //富文本编辑器的内容
  contentHTML: string = '';

  created() {
    this.thumbnail = this.data.thumbnail;
    this.$nextTick(() => {
      this.contentHTML = this.data.content;
    });
  }

  render() {
    const {getFieldDecorator} = this.Form;
    const imageList =
      this.thumbnail &&
      this.thumbnail
        .split(',')
        .map((item, index) => (
          <img src={item} key={index} width='100px' height='auto' style={{marginRight: '10px'}} />
        ));
    return (
      <a-modal
        width={'650px'}
        title={this.title}
        visible={this.visible}
        on-ok={this.submit}
        on-cancel={this.cancel}
      >
        <a-form>
          <a-form-item {...{props: this.formItemLayout}} label='文章标题'>
            {getFieldDecorator('title', {
              rules: [{required: true, message: '请输入标题'}],
              initialValue: this.data.title,
            })(<a-input placeholder='请输入标题'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='文章分类'>
            {getFieldDecorator('category', {
              initialValue: this.data.category,
              rules: [{required: true, message: '请输入分类'}],
            })(<a-input placeholder='请输入分类'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='文章标签'>
            {getFieldDecorator('tags', {
              initialValue: this.data.tags,
              rules: [{required: true, message: '请输入标签'}],
            })(<a-input placeholder='请输入标签,多个标签-分隔'></a-input>)}
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='文章缩略图'>
            <div style={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-start'}}>
              {imageList}
              <upload-image pictureLength={3} on-uploaded={this.uploaded}></upload-image>
            </div>
          </a-form-item>
          <a-form-item {...{props: this.formItemLayout}} label='正文'>
            <div>
              <quill-editor
                v-model={this.contentHTML}
                ref='myQuillEditor'
                options={this.editorOption}
                on-blur={this.onEditorBlur.bind(this)}
                on-focus={this.onEditorFocus.bind(this)}
                on-ready={this.onEditorReady.bind(this)}
              ></quill-editor>
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
