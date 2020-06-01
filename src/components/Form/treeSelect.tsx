import { Component, Vue, Watch } from 'vue-property-decorator';
import { TreeSelect } from 'ant-design-vue';
@Component({
  name: 'treeSelect',
  components: {
    'a-tree-select': TreeSelect,
  },
  watch: {
    value(value) {
      console.log(value);
    },
  },
})
export default class treeSelect extends Vue {
  treeData: any = [
    {
      title: '类型1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: '类型0-1-0',
          value: '类型0-0-1',
          key: '类型0-0-1',
          scopedSlots: {
            // custom title
            title: '类型1',
          },
        },
        {
          title: '类型0-1-1',
          value: '类型0-0-2',
          key: '类型0-0-2',
        },
      ],
    },
    {
      title: '类型2',
      value: '0-1',
      key: '0-1',
    },
  ];

  value: any = '类型1';

  change(e: string) {
    this.value = e;
  }


  render() {
    return (
      <div>
        <a-tree-select
          onChange={this.change}
          style="width: 300px"
          dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
          treeData={this.treeData}
          placeholder="请选择类型"
          treeDefaultExpandAll
          value={this.value}
        >
          <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
            Child Node1 {this.value}
          </span>
        </a-tree-select>
      </div>
    );
  }
}
