/* eslint-disabled */
import {Component, Vue} from 'vue-property-decorator';
import {Tag, Modal, Button, Table, Avatar} from 'ant-design-vue';
import moment from 'moment';
import {tableList, FilterFormList, Opreat} from '@/interface';
import city from '@/utils/city';
import InfoModal from './infoModal';

@Component({
  name: 'bannerCourselBoard',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-avatar': Avatar,
  },
})
export default class messageBoard extends Vue {
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
      key: 'desc',
      label: 'desc',
      type: 'input',
      placeholder: '请输入图片描述',
    },
    {
      key: 'status',
      label: 'status',
      type: 'cascader',
      placeholder: '请选择图片状态',
      options: [
        {value: 0, label: '启用'},
        {value: 1, label: '禁用'},
      ],
    },
  ];

  warnListModalShow: boolean = false;

  tableList: tableList[] = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      customRender: this.nameRender,
    },
    {
      title: '图片预览',
      dataIndex: 'url',
      align: 'center',
      customRender: this.ImgRender,
    },
    {
      title: '图片描述',
      dataIndex: 'desc',
      align: 'center',
    },
    {
      title: '跳转链接',
      dataIndex: 'routerUrl',
      align: 'center',
    },
    {
      title: '图片显示先后顺序',
      dataIndex: 'order',
      align: 'center',
    },
    {
      title: '图片状态',
      dataIndex: 'status',
      align: 'center',
      customRender: this.statusRender,
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'updateStatus',
      rowKey: 'id',
      color(value: any) {
        if (value.status === 0) {
          return 'red';
        }
        return 'blue';
      },
      text(value: any) {
        if (value.status === 0) {
          return '启用';
        }
        return '禁用';
      },
      roles: true,
      popconfirm: true,
      msg(value: any) {
        return value.status === 1 ? '是否启用该轮播图片' : '是否禁用该轮播图片';
      },
    },
    {
      key: 'edit',
      rowKey: 'id',
      color: 'blue',
      text: '编辑',
      roles: true,
    },
    {
      key: 'delete',
      rowKey: 'id',
      color: 'black',
      text: '删除',
      roles: true,
      popconfirm: true,
      msg: '是否删除该轮播图片',
    },
  ];

  title: string = '新增图片';

  visible: boolean = false;

  type: string = 'add';

  editData: object = {};

  nameRender(name: string, row: any) {
    return <a-tag color='green'>{name}</a-tag>;
  }

  statusRender(status: number) {
    if (status === 1) return <a-tag color='green'>已启用</a-tag>;
    return <a-tag color='red'>已禁用</a-tag>;
  }
  ImgRender(url: string) {
    return <img width='300px' height='auto' src={url} />;
  }

  tableClick(key: string, row: any) {
    const data = JSON.parse(JSON.stringify(row));
    this.type = row.type;
    switch (key) {
      case 'updateStatus':
        window.api.bannerBaseInfoUpdateStatus({id: data.id}).then((res: any) => {
          const resultCode = res.data.resultCode;
          if (resultCode === 0) {
            this.$message.success('修改成功');
            this.success();
          } else {
            this.$message.error('修改失败');
          }
        });
        break;
      case 'delete':
        window.api.bannerBaseInfoDelete({id: data.id}).then((res: any) => {
          const resultCode = res.data.resultCode;
          if (resultCode === 0) {
            this.$message.success('删除成功');
            this.success();
          } else {
            this.$message.error('删除失败');
          }
        });
        break;
      case 'edit':
        this.title = '编辑轮播图';
        this.type = 'edit';
        this.visible = true;
        this.editData = row;
        break;
      default:
        break;
    }
  }

  add() {
    this.title = '添加轮播图';
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
          url={'/coursel/courselList'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={true}
          exportBtn={false}
          dataType={'json'}
          localName={'banner'}
          rowKey={'id'}
          opreat={this.opreat}
          opreatWidth={'160px'}
          fetchType={'get'}
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
