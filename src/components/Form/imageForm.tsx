
import { Component, Vue } from 'vue-property-decorator';
import { Form, Upload, Icon, Modal } from 'ant-design-vue';

@Component({
  name: 'ImageForm',
  components: {
    'a-form-item': Form.Item,
    'a-upload': Upload,
    'a-icon': Icon,
    'a-modal': Modal,
  },
})

export default class ImageForm extends Vue {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  previewVisible: boolean = true;

  previewImage: string = '';

  fileList: any = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://i0.sinaimg.cn/dy/c/sd/2012-04-01/U7815P1T1D24212000F21DT20120401172319.jpg',
    },
  ];

  cancel() {
    this.$emit('close');
  }

  hideThumbnail() {
    this.previewVisible = false;
  }

  handlePreview(file: any) {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  // @ts-ignore
  handleChange({ fileList }) {
    this.fileList = fileList;
  }

  render() {
    const plus = () =>
      (
        <div>
          <a-icon type="picture" />
          <div class="ant-upload-text">上传图片</div>
        </div>
      );
    return (
      <a-form-item {...{ props: this.formItemLayout }} label="类型图标">
        <div>
          <a-upload
            name="avatar"
            listType="picture-card"
            class="avatar-uploader"
            showUploadList={true}
            fileList={this.fileList}
          >
            {plus}
            <a-modal visible={this.previewVisible} footer={null} onCancel={this.hideThumbnail}>
              <img alt="example" style={{ width: '100%' }} src={this.previewImage} />
            </a-modal>
          </a-upload>
        </div>
      </a-form-item>
    )
  }
}
