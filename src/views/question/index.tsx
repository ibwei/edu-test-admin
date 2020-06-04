import { Component, Vue } from 'vue-property-decorator';
import { Tag, Modal, Button, Table, Badge } from 'ant-design-vue';
import { tableList, FilterFormList, Opreat } from '@/interface';
import InfoModal from './infoModal';
import './infoModal.less';
import { ColorArray } from '@/utils/config';
@Component({
  name: 'question',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-badge': Badge,
  },
})
export default class Question extends Vue {
  // @ts-ignore
  partList: any = JSON.parse(localStorage.getItem('partList'));

  filterParams: any = {
    title: '',
    part_id: [],
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
      key: 'title',
      label: 'title',
      type: 'input',
      placeholder: '请输入题目',
    },
    {
      key: 'part_id',
      label: 'status',
      type: 'cascader',
      placeholder: '请选择所属板块',
      options: this.partList,
    },
  ];

  tableList: tableList[] = [
    {
      title: '题号',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: '题目内容',
      dataIndex: 'title',
      align: 'center',
      width: '180px',
      customRender: this.nameRender,
    },
    {
      title: '所属板块',
      dataIndex: 'name',
      align: 'center',
      customRender: this.partNameRender,
    },
    {
      title: 'A答案',
      dataIndex: 'a_answer',
      customRender: this.answerRender.bind(null, 0),
    },
    {
      title: 'B答案',
      dataIndex: 'b_answer',
      customRender: this.answerRender.bind(null, 1),
    },
    {
      title: 'C答案',
      dataIndex: 'c_answer',
      customRender: this.answerRender.bind(null, 2),
    },
    {
      title: 'D答案',
      dataIndex: 'd_answer',
      customRender: this.answerRender.bind(null, 3),
    },
    {
      title: 'E答案',
      dataIndex: 'e_answer',
      customRender: this.answerRender.bind(null, 4),
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'edit',
      rowKey: 'id',
      color: 'green',
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

  title: string = '新增题库题目';

  visible: boolean = false;

  modelType: string = 'add';

  editData: object = {};

  dataSource: Array<any> = [];

  //地图需要展示的图形 [多边形,圆形,自定义等]
  type: string = '';

  handleOk() {
    this.detailVis = true;
  }
  partChange(e: any) {
    console.log(e);
    const Table2: any = this.$refs.baseInfoTable;
  }

  nameRender(name: string, row: any) {
    return <a-tag color='green'>{name}</a-tag>;
  }

  partNameRender(partName: string, row: any) {
    return <a-tag color={ColorArray[row.part_id]}>{partName}</a-tag>;
  }

  answerRender(type: number, answer: string, row: any) {
    let scoreColumn = '';
    switch (type) {
      case 0:
        scoreColumn = 'a_score';
        break;
      case 1:
        scoreColumn = 'b_score';
        break;
      case 2:
        scoreColumn = 'c_score';
        break;
      case 3:
        scoreColumn = 'd_score';
        break;
      case 4:
        scoreColumn = 'e_score';
        break;
      default:
        scoreColumn = 'a_score';
    }
    return (
      <div>
        <a-tag color={ColorArray[type]}>分值：{row[scoreColumn]}</a-tag>
        <div class='answer-bg'>{answer}</div>
      </div>
    );
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
        this.type = 'edit';
        break;
      case 'delete':
        window.api.questionDelete({ id: row.id }).then((res: any) => {
          const { resultCode } = res.data;
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
    this.title = '新增题目';
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
          scroll={{ x: 900 }}
          url={'/question/list'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={true}
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
