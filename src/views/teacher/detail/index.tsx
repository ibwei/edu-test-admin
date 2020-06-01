/* eslint-disabled */
import { Component, Vue } from 'vue-property-decorator';
import { Tag, Modal, Button, Table, Avatar } from 'ant-design-vue';
import { tableList, FilterFormList, Opreat } from '@/interface';
import InfoModal from '../infoModal';

@Component({
  name: 'detail',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-avatar': Avatar,
  },
})
export default class Detail extends Vue {
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
        { value: 0, label: '启用' },
        { value: 1, label: '禁用' },
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
      title: '教师姓名',
      dataIndex: 'name',
      align: 'center',
      customRender: this.nameRender,
    },
    {
      title: '照片预览',
      dataIndex: 'photo',
      align: 'center',
      customRender: this.ImgRender,
    },
    {
      title: '教师简介',
      dataIndex: 'desc',
      width: '400px',
    },
    {
      title: '教师评分',
      align: 'center',
      dataIndex: 'rate',
    },
    {
      title: '学生印象',
      align: 'center',
      dataIndex: 'impression',
      customRender: this.tagsRender,
    },
    {
      title: '擅长内容',
      dataIndex: 'good_at',
      customRender: this.tagsRender,
    },
    {
      title: '奖项',
      dataIndex: 'deeds',
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'edit',
      rowKey: 'id',
      color(value: any) {
        if (value.status === 0) {
          return 'red';
        }
        return 'blue';
      },
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
      msg: '是否删除该教师信息',
    },
  ];

  title: string = '新增图片';

  visible: boolean = false;

  type: string = 'add';

  editData: object = {};

  nameRender(name: string, row: any) {
    return <a-tag color='green'>{name}</a-tag>;
  }

  ImgRender(url: string) {
    return <a-avatar shape='square' size={96} src={url} />;
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

  tableClick(key: string, row: any) {
    const data = JSON.parse(JSON.stringify(row));
    this.type = row.type;
    switch (key) {
      case 'delete':
        window.api.teacherBaseInfoDelete({ id: data.id }).then((res: any) => {
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
        this.title = '编辑教师信息';
        this.type = 'edit';
        this.visible = true;
        this.editData = row;
        break;
      default:
        break;
    }
  }

  add() {
    this.title = '添加教师';
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
          url={'/teacher/teacherList'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={true}
          localName={'teacherList'}
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
