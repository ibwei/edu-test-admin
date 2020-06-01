import {Component, Vue} from 'vue-property-decorator';
import {Tag, Modal, Button, Table} from 'ant-design-vue';
import {tableList, FilterFormList, Opreat} from '@/interface';
import InfoModal from './infoModal';

@Component({
  name: 'studentWorks',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
  },
})
export default class StudentWorks extends Vue {
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
      label: '学生姓名',
      type: 'input',
      placeholder: '请输入学生姓名',
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
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '教室环境',
      dataIndex: 'url',
      customRender: this.thumbnailRender,
    },
    {
      title: '教室环境描述',
      dataIndex: 'desc',
      align: 'center',
    },
    {
      title: '图片状态',
      dataIndex: 'status',
      customRender: this.statusRender,
      align: 'center',
    },
    {
      title: '排序权重',
      dataIndex: 'order',
      align: 'center',
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'edit',
      rowKey: 'id',
      color: 'blue',
      text: '编辑',
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

  title: string = '新增画室环境';

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
  statusRender(status: number) {
    if (status === 1) return <a-tag color='green'>已启用</a-tag>;
    return <a-tag color='red'>已禁用</a-tag>;
  }
  thumbnailRender(url: string) {
    console.log(url);
    if (url) {
      return <img src={url} class='thumbnail-image'></img>;
    }
    return <a-tag color='red'>无</a-tag>;
  }

  tagsRender(tags: string) {
    const tagArray = tags.split('-');
    const color = ['green', 'blue', 'cyan', 'pink', 'purple', 'orange'];
    const dom = tagArray.map((item, index) => {
      const c = Math.floor(Math.random() * 6);
      return (
        <a-tag key={Math.random() + index} color={color[c]}>
          {item}
        </a-tag>
      );
    });
    return dom;
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
        this.title = '编辑画室环境';
        this.type = 'edit';
        break;
      case 'delete':
        window.api.environmentDelete({id: row.id}).then((res: any) => {
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
    this.title = '新增画室环境';
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
          url={'/environment/environmentList'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          localName={'StudentWorks'}
          addBtn={true}
          exportBtn={false}
          opreatWidth={'140px'}
          dataType={'json'}
          rowKey={'id'}
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
