/* eslint-disabled */
import {Component, Vue} from 'vue-property-decorator';
import {Tag, Modal, Button, Table, Avatar, Rate} from 'ant-design-vue';
import {tableList, FilterFormList, Opreat} from '@/interface';

@Component({
  name: 'comment',
  components: {
    'a-tag': Tag,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-avatar': Avatar,
    'a-rate': Rate,
  },
})
export default class Comment extends Vue {
  filterParams: any = {
    name: '',
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
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '评论文章',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      customRender: this.nameRender,
    },
    {
      title: '评论层级',
      dataIndex: 'level',
      align: 'center',
    },
    {
      title: '评论内容',
      align: 'center',
      width: '300px',
      dataIndex: 'content',
    },
    {
      title: '评论时间',
      align: 'center',
      dataIndex: 'created_at',
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'pass',
      rowKey: 'id',
      color: 'green',
      text(value: any) {
        if (value.status === 0) {
          return '通过审核';
        }
        return '';
      },
      roles: true,
    },
    {
      key: 'reject',
      rowKey: 'id',
      color(value: any) {
        if (value.status === 0) {
          return 'green';
        } else if (value.status === 1) {
          return 'red';
        }
        return 'gray';
      },
      text(value: any) {
        if (value.status === 0) {
          return '驳回评论';
        } else if (value.status === 1) {
          return '已通过';
        }
        return '未通过';
      },
      disabled(value: any) {
        if (value.status !== 0) {
          return true;
        }
        return false;
      },
      roles: true,
    },
    {
      key: 'delete',
      rowKey: 'id',
      color: 'black',
      text: '删除',
      roles: true,
      popconfirm: true,
      msg: '是否删除该条文章评论',
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

  starRender(star: number) {
    return <a-rate defaultValue={star} allowHalf disabled />;
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
        window.api.articleCommentDelete({id: data.id}).then((res: any) => {
          const resultCode = res.data.resultCode;
          if (resultCode === 0) {
            this.$message.success('删除成功');
            this.success();
          } else {
            this.$message.error('删除失败');
          }
        });
        break;
      case 'pass':
        window.api.articleCommentUpdate({id: data.id, status: 1}).then((res: any) => {
          const resultCode = res.data.resultCode;
          if (resultCode === 0) {
            this.$message.success(res.data.resultMessage);
            this.success();
          } else {
            this.$message.error('处理失败');
          }
        });
        break;
      case 'reject':
        window.api.articleCommentUpdate({id: data.id, status: 2}).then((res: any) => {
          const resultCode = res.data.resultCode;
          if (resultCode === 0) {
            this.$message.success(res.data.resultMessage);
            this.success();
          } else {
            this.$message.error('处理失败');
          }
        });
        break;
      default:
        console.log('默认处理');
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
          url={'/article/comment/list'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={true}
          localName={'articleCommentList'}
          exportBtn={false}
          opreatWidth={'180px'}
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
