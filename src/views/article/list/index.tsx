import {Component, Vue} from 'vue-property-decorator';
import {Tag, Modal, Button, Table} from 'ant-design-vue';
import {tableList, FilterFormList, Opreat} from '@/interface';
import InfoModal from '../infoModal';

@Component({
  name: 'article',
  components: {
    'a-tag': Tag,
    'info-modal': InfoModal,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
  },
})
export default class Article extends Vue {
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
      key: 'title',
      label: 'title',
      type: 'input',
      placeholder: '请输入文章标题',
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
    },
    {
      title: '文章标题',
      dataIndex: 'title',
    },
    {
      title: '文章缩略图',
      dataIndex: 'thumbnail',
      align: 'center',
      customRender: this.imgRender,
    },
    {
      title: '文章分类',
      align: 'center',
      dataIndex: 'category',
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      align: 'center',
      customRender: this.tagsRender,
    },
    {
      title: '阅读数',
      align: 'center',
      dataIndex: 'read_count',
    },
    {
      title: '点赞数',
      align: 'center',
      dataIndex: 'praise_count',
    },
    {
      title: '评论数',
      align: 'center',
      dataIndex: 'comment_count',
    },
    {
      title: '发表时间',
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

  title: string = '新增文章';

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

  thumbnailRender(url: string) {
    console.log(url);
    if (url) {
      return <img src={url} class='thumbnail-image'></img>;
    }
    return <a-tag color='red'>无</a-tag>;
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

  imgRender(tags: string) {
    const tagArray = tags.split(',');
    /* eslint-disable-next-line */
    const dom = tagArray.map((item, index) => {
      return (
        <img key={Math.random() + index} width='100px' src={item}>
          {item}
        </img>
      );
    });
    return dom;
  }

  tableClick(key: string, row: any) {
    const data = JSON.parse(JSON.stringify(row));
    this.type = row.type;
    switch (key) {
      case 'edit':
        this.editData = data;
        this.visible = true;
        this.title = '编辑文章';
        this.type = 'edit';
        break;
      case 'delete':
        window.api.articleDelete({id: row.id}).then((res: any) => {
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
    this.title = '新增文章';
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
          url={'/article/articleList'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={true}
          localName={'article'}
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
