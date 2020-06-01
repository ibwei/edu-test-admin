import {Component, Vue} from 'vue-property-decorator';
import {Tag, Modal, Button, Table} from 'ant-design-vue';
import moment from 'moment';
import {tableList, FilterFormList, Opreat} from '@/interface';
import InfoModal from './infoModal';

@Component({
  name: 'feedback',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
  },
})
export default class Feedback extends Vue {
  filterParams: any = {
    name: '',
    address: [],
    createtime: [],
    startTime: '',
    endTime: '',
  };

  BackParams: any = {
    code: 'data.resultCode',
    codeOK: 0,
    message: 'data.resultMessage',
    data: 'data.data',
    total: 'data.total',
  };

  outParams: any = {};

  filterList: FilterFormList[] = [
    {
      key: 'name',
      label: 'name',
      type: 'input',
      placeholder: '请输入反馈内容',
    },
    {
      key: 'createtime',
      label: 'Createtime',
      type: 'datetimerange',
      placeholder: ['开始时间', '结束时间'],
      value: ['startTime', 'endTime'],
    },
  ];

  tableList: tableList[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      customRender: this.nameRender,
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '微信号',
      dataIndex: 'wechat',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
    },
    {
      title: '用户设备',
      dataIndex: 'device',
      align: 'center',
      customRender: this.device,
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: '300px',
    },
    {
      title: '反馈时间',
      dataIndex: 'created_at',
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'edit',
      rowKey: 'id',
      color(value: any) {
        if (value.status === 0) {
          return 'blue';
        }
        return 'green';
      },
      text(value: any) {
        if (value.status === 0) {
          return '去处理';
        }
        return '查看结果';
      },
      roles: true,
      popconfirm: false,
    },
    {
      key: 'delete',
      rowKey: 'id',
      color: 'red',
      text: '删除',
      roles: true,
      msg: '确定删除？',
    },
  ];

  changeVis: boolean = false;

  detailVis: boolean = false;

  title: string = '新增区域';

  visible: boolean = false;

  modelType: string = 'add';

  editData: object = {};

  dataSource: Array<any> = [];

  //打开地图的入口 [查看|编辑]
  openType: string = '';

  //地图需要展示的图形 [多边形,圆形,自定义等]
  type: string = '';

  handleOk() {
    this.detailVis = true;
  }

  nameRender(name: string, row: any) {
    return <a-tag color='green'>{name}</a-tag>;
  }

  device(device: number) {
    if (device === 0) {
      return <a-tag color={'green'}>手机</a-tag>;
    }
    return <a-tag color={'blue'}>PC</a-tag>;
  }

  handleCancel() {
    this.detailVis = false;
  }

  tableClick(key: string, row: any) {
    const data = JSON.parse(JSON.stringify(row));
    this.type = row.type;
    switch (key) {
      case 'edit':
        this.editData = data;
        this.visible = true;
        if (row.status === 0) {
          this.title = '处理反馈';
        } else {
          this.title = '查看反馈处理结果';
        }
        this.type = 'edit';
        break;
      case 'delete':
        window.api.feedbackDelete({id: row.id}).then((res: any) => {
          const {resultCode} = res.data;
          if (resultCode === 0) {
            this.$message.success('删除成功');
            this.success();
          } else {
            this.$message.error('删除失败');
          }
        });
        break;
      default:
        break;
    }
  }

  add() {
    this.title = '新增反馈';
    this.type = 'add';
    this.visible = true;
    this.editData = {};
  }

  closeModal() {
    this.visible = false;
    this.editData = {};
  }

  success() {
    this.visible = false;
    const Table2: any = this.$refs.baseInfoTable;
    this.editData = {};
    Table2.reloadTable();
  }

  render() {
    return (
      <div class='baseInfo-wrap'>
        <filter-table
          ref='baseInfoTable'
          tableList={this.tableList}
          filterList={this.filterList}
          filterGrade={[]}
          scroll={{x: 900}}
          url={'/feedback/feedbackList'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={false}
          exportBtn={false}
          opreatWidth={'140px'}
          dataType={'json'}
          rowKey={'id'}
          localName={'feedback'}
          opreat={this.opreat}
          fetchType={'post'}
          backParams={this.BackParams}
          on-menuClick={this.tableClick}
          on-add={this.add}
        />
        {this.visible ? (
          <info-modal
            on-close={this.closeModal}
            on-success={this.success}
            data={this.editData}
            type={this.type}
            title={this.title}
            visible={this.visible}
          ></info-modal>
        ) : (
          ''
        )}
      </div>
    );
  }
}
