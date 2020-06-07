import { Component, Vue } from 'vue-property-decorator';
import {
  Tag,
  Modal,
  Button,
  Table,
  Badge,
  Steps,
  Popover,
} from 'ant-design-vue';
import { tableList, FilterFormList, Opreat } from '@/interface';
import InfoModal from './infoModal';
import './infoModal.less';
import { ColorArray } from '@/utils/config';
@Component({
  name: 'test',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-badge': Badge,
    'a-steps': Steps,
    'a-step': Steps.Step,
    'a-popover': Popover,
  },
})
export default class Test extends Vue {
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
      key: 'student_name',
      label: 'student_name',
      type: 'input',
      placeholder: '请输入要查找的学生姓名',
    },
  ];

  tableList: tableList[] = [
    {
      title: '测试序号',
      align: 'center',
      dataIndex: 'id',
      width: '50px',
    },
    {
      title: '学生姓名',
      dataIndex: 'student_name',
      align: 'center',
      width: '100px',
      customRender: this.nameRender,
    },
    {
      title: '所属学校',
      dataIndex: 'school_name',
      align: 'center',
      width: '140px',
    },
    {
      title: '家长电话',
      dataIndex: 'parent_phone',
      width: 120,
    },
    {
      title: '各板块得分',
      dataIndex: 'scoreArray',
      customRender: this.partScore,
    },
    {
      title: '总得分',
      dataIndex: 'allScore',
      align: 'center',
      width: 80,
      customRender: this.scoreRender,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      customRender: this.statusRender,
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 140,
    },
  ];

  partScore(scoreString: string) {
    const scoreArray = scoreString.split('-');
    const rawString = localStorage.getItem('partList');
    let partList: any = [];
    if (rawString) {
      partList = JSON.parse(rawString);
    } else {
      partList = [];
    }
    for (let i = 0; i < partList.length; i++) {
      partList[i].score = scoreArray[i] ? scoreArray[i] : 0;
    }
    const scoreDom = partList.map((item: any, index: number) => {
      let resultIndex = Math.floor(item.score / 5);
      if (!resultIndex) {
        resultIndex = 1;
      }
      partList[index].result = partList[index][resultIndex];
      return (
        <a-popover key={index}>
          <template slot='title'>
            <div style='padding:5px;'>{`${item.label}分析结果`}</div>
          </template>
          <template slot='content'>
            <div style='padding:5px;max-width:500px;'>
              {partList[index][resultIndex]}
            </div>
          </template>
          <a-button
            type='dashed'
            style='margin-right:5px;'
          >{`${item.label}:${item.score}分`}</a-button>
        </a-popover>
      );
    });
    localStorage.setItem('partResult', JSON.stringify(partList));
    return <div>{scoreDom}</div>;
  }
  scoreRender(score: number) {
    if (score >= 60) {
      return <a-tag color={'green'}>{score}</a-tag>;
    }
    return <a-tag color={'blue'}>{score}</a-tag>;
  }

  statusRender(status: number) {
    if (status === 1) {
      return <a-badge status='processing' text='已查看' />;
    } else if (status === 2) {
      return <a-badge status='success' text='审核完毕' />;
    }
    return <a-badge status='default' text='待查看' />;
  }
  opreat: Opreat[] = [
    {
      key: 'edit',
      rowKey: 'id',
      color: 'green',
      text: '查看测试详情',
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

  title: string = '新增测试';

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
    const Table2: any = this.$refs.baseInfoTable;
  }

  nameRender(name: string, row: any) {
    return <a-tag color='green'>{name}</a-tag>;
  }

  partNameRender(partName: string, row: any) {
    return <a-tag color={ColorArray[row.part_id]}>{partName}</a-tag>;
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
    this.type = row.type;
    switch (key) {
      case 'edit':
        localStorage.setItem('testInfo', JSON.stringify(row));
        this.$router.push({ path: '/test/detail', query: { id: row.id } });
        break;
      case 'delete':
        window.api.testDelete({ id: row.id }).then((res: any) => {
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
          url={'/test/list'}
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
