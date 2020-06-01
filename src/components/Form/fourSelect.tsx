
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Form, Upload, Icon, Modal, Input, Button, Select, DatePicker } from 'ant-design-vue';
import './fourSelect.less';

@Component({
  name: 'FourSelect',
  components: {
    'a-form-item': Form.Item,
    'a-upload': Upload,
    'a-icon': Icon,
    'a-modal': Modal,
    'a-input': Input,
    'a-button': Button,
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-date-picker': DatePicker,

  },
  props: {
    Form,
  },
})

class FourSelect extends Vue {

  @Prop() data!: any;

  @Prop() formItemLayout!: any;

  @Prop() openType!: string;

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

  beforeUpdated() {
    console.log('hah')
  }

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

  addType: string = '';

  handleChange1(e: number) {
    this.addType = this.dataTypeList[e];
  }

  ownPropertyList: Array<any> = []

  ownCount: number = 3;

  selectList: Array<any> = [];

  dataTypeList: Array<string> = ['字符', '数值', '逻辑值', '日期时间', '数组', '图片', '文件'];

  addOwnProperty(type: string) {
    this.selectList = this.dataTypeList.map((item, index) =>
      <a-select-option key={index}>{item}</a-select-option>);

    const temp = (
      <a-form-item {...{ props: this.formItemLayout }} label={`自定义属性${this.ownCount++}`}>
        <a-input addonBefore="属性名称" placeholder="请输入属性名称" />
        <a-select onChange={this.handleChange1} placeholder='请选择属性数据类型'>
          {this.selectList}
        </a-select>
        {this.openType === 'list' ? (<a-input addonBefore="属性值" placeholder="请输入属性值" />) : ''}

      </a-form-item>
    )

    this.ownPropertyList.push(temp);
    return this.ownPropertyList;
  }

  render() {
    const { getFieldDecorator } = this.Form;
    return (
      <div class="four-select-area">
        <a-form-item {...{ props: this.formItemLayout }} label="基础属性1">
          {getFieldDecorator('basicProperty1', {
            initialValue: this.data.basicProperty1,
            rules: [{ required: true, message: '请输入基础属性1' }],
          })(<a-input placeholder="请输入基础属性1"></a-input>)}
        </a-form-item>
        <a-form-item {...{ props: this.formItemLayout }} label="基础属性2">
          {getFieldDecorator('basicProperty2', {
            initialValue: this.data.basicProperty1,
            rules: [{ required: true, message: '请输入基础属性2' }],
          })(<a-input placeholder="请输入基础属性2"></a-input>)}
        </a-form-item>
        <a-form-item {...{ props: this.formItemLayout }} label="自定义属性1">
          {getFieldDecorator('basicProperty1', {
            initialValue: this.data.ownProperty1,
            rules: [{ required: true, message: '请输入自定义属性1' }],
          })(<a-input placeholder="请输入自定义属性1"></a-input>)}
        </a-form-item>
        <a-form-item {...{ props: this.formItemLayout }} label="自定义属性2">
          {getFieldDecorator('ownProperty2', {
            initialValue: this.data.ownProperty2,
            rules: [{ required: true, message: '请输入自定义属性2' }],
          })(<a-input placeholder="请输入自定义属性2"></a-input>)}
        </a-form-item>
        {this.ownPropertyList ? this.ownPropertyList : ''}
        <div class="puls">
          <a-button onClick={this.addOwnProperty} type="primary"><a-icon type="plus" /> 添加自定义属性</a-button>
        </div>
      </div>
    )
  }
}

export default Form.create({
  props: {
    data: Object,
    formItemLayout: Object,
    openType: String,
  },
})(FourSelect);
