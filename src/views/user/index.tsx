/* eslint-disabled */
import {Component, Vue} from 'vue-property-decorator';
import {Tag, Modal, Button, Table, Avatar, Rate, Badge} from 'ant-design-vue';
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
    'a-badge': Badge,
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
      key: 'name',
      label: '请输入学生姓名',
      type: 'input',
      placeholder: '请输入姓名',
    },
    {
      key: 'is_admin',
      label: 'status',
      type: 'cascader',
      placeholder: '请选择账号类型',
      options: [
        {value: 0, label: '学生'},
        {value: 1, label: '管理员'},
        {value: 2, label: '老师'},
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
      title: '用户名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 200,
      customRender: this.ImgRender,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: 'Email',
      align: 'center',
      width: '300px',
      dataIndex: 'email',
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
      customRender: this.genderRender,
    },
    {
      title: '积分',
      align: 'center',
      dataIndex: 'points',
    },
    {
      title: '账号类型',
      align: 'center',
      dataIndex: 'is_admin',
      customRender: this.typeRender,
    },
    {
      title: '注册来源',
      align: 'center',
      dataIndex: 'device',
      customRender: this.deviceRender,
    },
    {
      title: '账号状态',
      align: 'center',
      dataIndex: 'status',
      customRender: this.statusRender,
    },
    {
      title: '上次登录',
      align: 'center',
      dataIndex: 'login_time',
    },
  ];

  opreat: Opreat[] = [
    {
      key: 'pass',
      rowKey: 'id',
      color(value: any) {
        if (value.status === 0) {
          return 'green';
        }
        return 'red';
      },
      text(value: any) {
        if (value.status === 0) {
          return '解冻账户';
        }
        return '禁用账户';
      },
      roles: true,
      popconfirm: true,
      msg(value: any) {
        if (value.status === 0) {
          return '确认解冻账户吗？';
        }
        return '确定禁用改账户吗？';
      },
    },
    {
      key: 'delete',
      rowKey: 'id',
      color: 'black',
      text: '删除',
      roles: true,
      popconfirm: true,
      msg: '是否删除该用户?',
    },
  ];

  title: string = '新增图片';

  visible: boolean = false;

  type: string = 'add';

  editData: object = {};

  nameRender(name: string, row: any) {
    return <a-tag color='green'>{name}</a-tag>;
  }

  genderRender(gender: number) {
    if (gender === 1) {
      return <a-tag color='blue'>男</a-tag>;
    }
    return <a-tag color='green'>女</a-tag>;
  }

  typeRender(gender: number) {
    if (gender === 1) {
      return <a-badge status='success' text='管理员' />;
    }
    if (gender === 0) {
      return <a-badge status='warning' text='学生' />;
    }
    return <a-badge status='default' text='教师' />;
  }

  statusRender(gender: number) {
    if (gender === 1) {
      return <a-badge status='success' text='正常' />;
    }
    return <a-badge status='default' text='已禁用' />;
  }

  deviceRender(gender: number) {
    if (gender === 1) {
      return <a-badge status='success' text='PC端' />;
    }
    return <a-badge status='processing' text='移动端' />;
  }

  ImgRender(url: string) {
    if (!url) {
      url = 'http://img.pinxianhs.com/timg.jpeg';
    }
    return <a-avatar shape='circle' size={56} src={url} />;
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
    if (row.is_admin === 1) {
      this.$message.info('禁止对管理员账户进行任何操作！');
      return;
    }
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
        window.api
          .userUpdate({...row, id: data.id, status: row.status === 1 ? 0 : 1})
          .then((res: any) => {
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
    this.title = '添加用户';
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
          url={'/user/list'}
          filterParams={this.filterParams}
          outParams={this.outParams}
          addBtn={true}
          localName={'userList'}
          exportBtn={false}
          opreatWidth={'120px'}
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
